const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");
const uuid = require("uuid");
const oci = require("../helpers/oracle");

// Make an enum for user roles
const roles = {
	viewer: "view",
	editor: "edit",
	owner: "owner"
};

/************************************************************/
/*                    Docs CRUD Operations                  */
/************************************************************/

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

	// Create and upload new document to oracle cloud
	let dataId = uuid.v4();
	const emptyDoc = {
		"ops": [
		]
	};
	const uploadData = await oci.addData("B3", dataId, "application/json", JSON.stringify(emptyDoc));
	if (!uploadData.eTag)
		return res.status(500).json({ error: "Failed to create document" });

	const userRef = fb.db.doc(`users/${user.uid}`);
	let userData = (await userRef.get()).data();

	const doc = {
		name: req.body.name,
		data: dataId,
		createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: fb.admin.firestore.FieldValue.serverTimestamp(),
		access: {
			[user.uid]: {
				role: roles.owner,
				type: "users",
				email: userData.email,
				name: userData.username
			}
		},
		path: (req.body.path) ? req.body.path : "/"
	};

	// Add document collection
	fb.db.collection(`documents`).add(doc)
		.then(docRef =>
		{
			userRef.update({
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
	const userRef = await fb.db.doc(`users/${user.uid}`).get();
	if (!userRef.data().documents.includes(req.params.id))
		return res.status(400).json({ error: "No Access" });

	try
	{
		// Get document
		const docData = await fb.db.doc(`documents/${req.params.id}`).get()
			.catch((error) => { throw error; });

		// Get data from oracle cloud
		const oracleData = await oci.getData("B3", docData.data().data)
			.catch((error) => { throw error; });

		const contents = await oci.generateStringFromStream(oracleData.value);
		res.status(200).json({ ...docData.data(), contents: contents });
	}
	catch (err) { res.status(500).json({ error: "Failed to get document" }); }
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
				})
				.catch((error) => { throw error; });

			// Remove doc from oracle cloud
			oci.deleteData("B3", doc.data().data)
				.catch((error) => { throw error; });

			// Delete document
			docRef.delete()
				.then(() => { res.status(200).json({ message: "Document deleted" }); })
				.catch((error) => { throw error; });
		})
		.catch((err) => { res.status(500).json({ error: "Failed to delete document" }); });
});

// Update document info
router.patch('/:id', async (req, res) =>
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

			// Update document
			docRef.update()
				.then(() => { res.status(200).json({ message: "Document updated" }); })
				.catch((error) => { throw error; });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to update document" }); });

});

/************************************************************/
/*                  Sharing CRUD Operations                 */
/************************************************************/

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
		.then(async (doc) =>
		{
			// Check if user is owner of document
			if (doc.data().access[user.uid].role !== roles.owner)
				return res.status(401).json({ error: "Unauthorized" });

			let userRef = fb.db.doc(`users/${req.params.user}`)
			let userData = (await userRef.get()).data();

			// Add document to user
			userRef.update({
				documents: fb.admin.firestore.FieldValue.arrayUnion(req.params.id)
			})
				.then(() =>
				{ 
					// Add user to document
					docRef.update({
						[`access.${req.params.user}`]: {
							role: req.body.role,
							type: "users",
							email: userData.email,
							name: userData.username
						}
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

/************************************************************/
/*                  Comment CRUD Operations                 */
/************************************************************/

// Add comment
router.post('/:id/comment', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.comment)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get username
	const userData = await fb.db.doc(`users/${user.uid}`).get();

	const comment = {
		username: userData.data().username,
		comment: req.body.comment,
		updatedAt: fb.admin.firestore.FieldValue.serverTimestamp()
	};

	// Add comment to document
	fb.db.collection(`documents/${req.params.id}/comments`).add(comment)
		.then((ref) => { res.status(200).json({ id: ref.id, message: "Comment added" }); })
		.catch((error) => { res.status(500).json({ error: "Failed to add comment" }); });
});

// Get comments
router.get('/:id/comments', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get comments of document
	fb.db.collection(`documents/${req.params.id}/comments`).get()
		.then((snapshot) =>
		{
			let comments = [];
			snapshot.forEach((doc) => { comments.push({ id: doc.id, ...doc.data() }); });
			res.status(200).json(comments);

		}).catch((error) => { res.status(500).json({ error: "Failed to get comments" }); });
});

// Delete comment
router.delete('/:id/comment/:comment', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Delete comment
	fb.db.doc(`documents/${req.params.id}/comments/${req.params.comment}`).delete()
		.then(() => { res.status(200).json({ message: "Comment deleted" }); })
		.catch((error) => { res.status(500).json({ error: "Failed to delete comment" }); });
});

// Edit comment
router.patch('/:id/comment/:comment', async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.comment)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Edit comment
	fb.db.doc(`documents/${req.params.id}/comments/${req.params.comment}`).update(
		{
			comment: req.body.comment,
			updatedAt: fb.admin.firestore.FieldValue.serverTimestamp()
		})
		.then(() => { res.status(200).json({ message: "Comment edited" }); })
		.catch((error) => { res.status(500).json({ error: "Failed to edit comment" }); });
});

module.exports = router;	