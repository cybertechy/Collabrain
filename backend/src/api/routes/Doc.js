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
	if (!req.headers.authorization || !req.body.name || !req.body.path)
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
	let docRef = await fb.db.collection(`documents`).add(doc);

	// Add document to user
	if (req.body.path === "/")
	{
		userRef.update({
			documents: fb.admin.firestore.FieldValue.arrayUnion(docRef.id)
		});
	} else
	{
		// Get the folder of the user
		let folderRef = await userRef.collection("folders").where("path", "==", req.body.path).get();

		if (folderRef?.empty)
		{
			return res.status(500).json({ error: "Failed to create document" });
		}

		let folder = folderRef.docs[0].data();
		if (!folder?.documents) return res.status(500).json({ code: 500, error: "Critical Server Error" });

		let documents = folder.documents || [];
		documents.push(docRef.id);

		let updateStatus = await userRef.collection("folders").doc(folderRef.docs[0].id).update({
			documents: documents
		});
		if (!updateStatus) return res.status(500).json({ error: "Failed to create document" });

	}

	return res.status(200).json({ message: "Document created", id: docRef.id });

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
	let docRef = fb.db.doc(`documents/${req.params.id}`);
	let docData = await docRef.get();
	if (!docData.data())
		return res.status(401).json({ error: "No Access" });

	let userAccess = false;
	if (!docData.data().Access[user.uid]) userAccess = false;
	else userAccess = true;

	if (!userAccess)
	{
		for (const [key, value] of Object.entries(docData.data().Access))
		{
			if (value.type !== "teams") continue;
			if (value.members.includes(user.uid))
			{
				userAccess = true;
				break;
			}
		}
	}

	if (!userAccess)
		return res.status(401).json({ error: "Unauthorized access" });

	// Get document

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
			let updateData = {};
			if (req.body.name) updateData.name = req.body.name;
			if (req.body.path) updateData.path = req.body.path;
			if (req.body.access) updateData.access = req.body.access;

			updateData.updatedAt = fb.admin.firestore.FieldValue.serverTimestamp();
			docRef.update(updateData)
				.then(() => { res.status(200).json({ message: "Document updated" }); })
				.catch((error) => { throw error; });
		})
		.catch((error) => { res.status(500).json({ error: "Failed to update document" }); });

});

/* Update a document of a user for sharing */
router.put("/:id", async (req, res) =>
{
	if (!req.headers.authorization || !req.body) return res.status(400).json({ code: 400, error: "Missing token or data" });

	// Check if the data exists
	let token = req.headers.authorization.split(' ')[1];
	if (!token) return res.status(400).json({ code: 400, error: "Missing token" });

	//verify user
	const user = await fb.verifyUser(token);
	if (!user) return res.status(403).json({ code: 403, error: "Invalid token" });

	const db = fb.admin.firestore();

	const document = await db.collection("documents").doc(req.params.id).get();
	if (!document.exists) return res.status(404).json({ code: 404, error: "Document not found" });


	let docData = document.data();
	//check if user has access to the content map
	let Access = null;
	let userRole = null;
	if (!docData.access[user.uid])
	{

		// check if the user exists in the team members list
		for (const [key, value] of Object.entries(docData.access))
		{
			if (value.type !== "teams") continue;
			if (value.members.includes(user.uid))
			{
				Access = "team";
				userRole = value.role;
				break;
			}
		}
	} else
	{
		Access = "user";
		userRole = docData.access[user.uid].role;
	}

	if (!Access) return res.status(403).json({ code: "AM109", error: "Access Denied" });

	let updatedDocument = { ...docData };

	if (userRole === "read") return res.status(403).json({ code: 403, error: "User does not have access to the operation" });

	if (req.body.data && (userRole === "owner" || userRole === "edit"))
	{


		// check if the data is uuid else generate new uuid
		if (uuid.validate(docData.data)) updatedDocument.data = docData.data;
		else updatedDocument.data = uuid.v4();

		// upload data to oracle cloud
		const uploadData = await oci.addData("B3", docData.data, "application/json", JSON.stringify(req.body.data));


		if (!uploadData.eTag)
		{
			return res.status(500).json({ code: 500, error: "Uploading data failed" });
		}
	}

	if (userRole === "owner")
	{

		if (req.body.name) updatedDocument.name = req.body.name;

		if (req.body.path) updatedDocument.path = req.body.path;

		// Revoke/grant access
		if (req.body.access && req.body.user && (req.body.revokeAccess === true || req.body.revokeAccess === false))
		{
			updatedDocument.Access = req.body.access;

			if (req.body.revokeAccess)
			{
				fb.db.collection("users").doc(req.body.user).update({
					AccessDocuments: fb.admin.firestore.FieldValue.arrayRemove(req.params.id)
				});
			} else
			{
				fb.db.collection("users").doc(req.body.user).update({
					AccessDocuments: fb.admin.firestore.FieldValue.arrayUnion(req.params.id)
				});
			}
		}

		if (req.body.access && req.body.team && (req.body.revokeAccess === true || req.body.revokeAccess === false))
		{
			// Get the members of the team
			let team = await fb.db.collection("teams").doc(req.body.team).get();
			let members = Object.keys(team.data().members);

			// Grant access to the team members
			if (req.body.revokeAccess)
			{
				fb.db.collection("teams").doc(req.body.team).update({
					teamDocAccess: fb.admin.firestore.FieldValue.arrayRemove({
						documentId: req.params.id,
						contentMapName: docData.name,
						type: "document"
					})
				});
			} else
			{
				fb.db.collection("teams").doc(req.body.team).update({
					teamDocAccess: fb.admin.firestore.FieldValue.arrayUnion({
						documentId: req.params.id,
						contentMapName: docData.name,
						type: "document"
					})
				});
				req.body.access[req.body.team].members = members;
			}

			updatedDocument.Access = req.body.access;
		}

		// Set public access
		if ("public" in req.body)
		{
			updatedDocument.public = req.body.public;
		}
	}

	updatedDocument.updatedAt = fb.admin.firestore.FieldValue.serverTimestamp();

	//set updated content map
	await db.collection("documents").doc(req.params.id).set(updatedDocument);

	return res.status(200).json({ code: 200, id: req.params.id });
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

			let userRef = fb.db.doc(`users/${req.params.user}`);
			let userData = (await userRef.get()).data();

			// Add document to user
			userRef.update({
				AccessDocuments: fb.admin.firestore.FieldValue.arrayUnion(req.params.id)
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
				AccessDocuments: fb.admin.firestore.FieldValue.arrayRemove(req.params.id)
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