const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");
const uuid = require("uuid");
const oci = require("../helpers/oracle");

// Make an enum for user roles
const roles = {
	viewer: "viewer",
	editor: "editor",
	owner: "owner"
};

// Create new document
router.post('/', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.name)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Create andn upload new document to oracle cloud
	let dataId = uuid.v4();
	const uploadData = await oci.addData("B3", dataId, "application/json", JSON.stringify({}));
	if (!uploadData.eTag)
		return res.status(500).json({ error: "Failed to create document" });

	const doc = {
		name: req.body.name,
		data: dataId,
		createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: fb.admin.firestore.FieldValue.serverTimestamp(),
		access: { [user.uid]: { role: roles.owner } },
		path: (req.body.path) ? req.body.path : "/"
	};

	// Add document collection
	fb.db.collection(`documents`).add(doc)
		.then((docRef) =>
		{
			fb.db.doc(`users/${user.uid}`).update({
				documents: fb.admin.firestore.FieldValue.arrayUnion(docRef.id)
			})
				.then(() => { res.status(200).json({ message: "Document created", id: docRef.id }); })
				.catch((error) => { res.status(500).json({ error: "Failed to create document" }); });

		}).catch((error) => { res.status(500).json({ error: "Failed to create document" }); });
});

// Get all documents of user
router.get('/all', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get all documents of user
	fb.db.collection("documents").where(`access.${user.uid}.role`, "!=", "null").get()
		.then((snapshot) =>
		{
			let documents = [];
			snapshot.forEach((doc) => { documents.push({ id: doc.id, ...doc.data() }); });
			res.status(200).json(documents);

		}).catch((error) => { res.status(500).json({ error: "Failed to get documents" }); });
});

// Get document by id
router.get('/:id', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user has access to document
	fb.db.doc(`users/${user.uid}`).get()
		.then((doc) =>
		{
			if (!doc.data().documents.includes(req.params.id))
				return res.status(401).json({ error: "Unauthorized" });

			// Get document
			fb.db.doc(`documents/${req.params.id}`).get()
				.then((doc) => { res.status(200).json({ id: doc.id, ...doc.data() }); })
				.catch((error) => { res.status(500).json({ error: "Failed to get document" }); });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to get document" }); });
});

// Delete document
router.delete('/:id', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user has is owner of document
	let docRef = fb.db.doc(`documents/${req.params.id}`);
	docRef.get()
		.then((doc) =>
		{
			if (doc.data().access[user.uid].role !== roles.owner)
				return res.status(401).json({ error: "Unauthorized" });

			// Get all users with access to document
			let users = Object.keys(doc.data().access);
			// Delete document from all users
			fb.db.collection(`users`).where(fb.admin.firestore.FieldPath.documentId(), "in", users).get()
				.then((snapshot) =>
				{
					snapshot.forEach((userDoc) =>
					{
						userDoc.ref.update({
							documents: fb.admin.firestore.FieldValue.arrayRemove(req.params.id)
						});
					});
				});

			// Remove doc from oracle cloud
			oci.deleteFile("B3", doc.data().data);
			// Delete document
			docRef.delete()
				.then(() => { res.status(200).json({ message: "Document deleted" }); })
				.catch((error) => { throw error; });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to delete document" }); });
});

// Share document
router.post('/:id/share/:user', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.role)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let docRef = fb.db.doc(`documents/${req.params.id}`);
	docRef.get()
		.then((doc) =>
		{
			// Check if user is owner of document
			if (doc.data().access[user.uid].role !== roles.owner)
				return res.status(401).json({ error: "Unauthorized" });

			// Add document to user
			fb.db.doc(`users/${req.params.user}`).update({
				documents: fb.admin.firestore.FieldValue.arrayUnion(req.params.id)
			})
				.then(() =>
				{
					// Add user to document
					docRef.update({
						[`access.${req.params.user}`]: { role: req.body.role }
					})
						.then(() => { res.status(200).json({ message: "Document shared" }); })
						.catch((error) => { throw error; });
				})
				.catch((error) => { throw error; });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to share document" }); });
});

// Remove user from document
router.delete('/:id/share/:user', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let docRef = fb.db.doc(`documents/${req.params.id}`);
	docRef.get()
		.then((doc) =>
		{
			// Check if user is owner of document
			if (doc.data().access[user.uid].role !== roles.owner)
				return res.status(401).json({ error: "Unauthorized" });

			// Remove document from user
			fb.db.doc(`users/${req.params.user}`).update({
				documents: fb.admin.firestore.FieldValue.arrayRemove(req.params.id)
			})
				.then(() =>
				{
					// Remove user from document
					docRef.update({
						[`access.${req.params.user}`]: fb.admin.firestore.FieldValue.delete()
					})
						.then(() => { res.status(200).json({ message: "Document unshared" }); })
						.catch((error) => { throw error; });
				})
				.catch((error) => { throw error; });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to unshare document" }); });
});

module.exports = router;	