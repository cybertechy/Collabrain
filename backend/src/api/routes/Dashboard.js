const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

// Create new folder
// @RequestBody: {name: string}
router.post("/folder", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.name)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if folder already exists
	let folder = await fb.db.collection(`users/${user.uid}/folders/`).where("name", "==", req.body.name).get();
	if (folder.exists)
		return res.status(400).json({ error: "Folder already exists" });

	// Create new folder
	fb.db.collection(`users/${user.uid}/folders/`).add({
		name: req.body.name,
		createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
	})
		.then(ref => res.status(200).json({ message: "Folder created", folderID: ref.id }))
		.catch((err) => res.status(500).json({ error: err }));
});

// Delete folder
router.delete("/folder/:folder", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.params.folder)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Delete folder
	fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).delete()
		.then(() => res.status(200).json({ message: "Folder deleted" }))
		.catch((err) => res.status(500).json({ error: err }));
});

// Add file to folder
router.put("/file/:fileid/:folder", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.params.fileid || !req.params.folder)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if file exists in contentMaps array of user
	let userref = await fb.db.doc(`users/${user.uid}`).get();
	if (!userref.exists)
		return res.status(400).json({ error: "User not found" });

	let contentMaps = userref.data().contentMaps;
	let documents = userref.data().documents;

	let contentMapfound = contentMaps?.includes(req.params.fileid);
	let documentfound = documents?.includes(req.params.fileid);
	
	if (!contentMapfound && !documentfound)
		return res.status(400).json({ error: "File not found" });

	// remove file from contentMaps array
	if (contentMapfound)
	{
		fb.db.doc(`users/${user.uid}`).update({
			contentMaps: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});
	}
	else
	{
		fb.db.doc(`users/${user.uid}`).update({
			documents: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});
	}

	// get folder document
	let folder = await fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).get();
	if (!folder.exists)
		return res.status(400).json({ error: "Folder not found" });

	folder = folder.data();

	let type = contentMapfound ? "contentMaps" : "documents";
	// Add file to folder
	fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).update({
		[type]: fb.admin.firestore.FieldValue.arrayUnion(req.params.fileid)
	})
		.then(() => res.status(200).json({ message: "File added to folder" }))
		.catch((err) => res.status(500).json({ error: err }));
});

// Remove file from a folder
router.patch("/file/:fileid/:folder", async (req, res) => 
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.params.fileid || !req.params.folder)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// get folder document
	let folder = await fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).get();
	if (!folder.exists)
		return res.status(400).json({ error: "Folder not found" });

	folder = folder.data();

	// search by id in filed array
	let contentMapfound = folder.contentMaps?.includes(req.params.fileid);
	let documentfound = null;
	if (!contentMapfound)
		documentfound = folder.documents?.includes(req.params.fileid);

	// Check if file already exists in folder
	if (!contentMapfound && !documentfound)
		return res.status(400).json({ error: "File not found in folder" });

	// Add file contentMaps array or documents array
	if (contentMapfound)
	{
		fb.db.doc(`users/${user.uid}`).update({
			contentMaps: fb.admin.firestore.FieldValue.arrayUnion(req.params.fileid)
		});
	}
	else
	{
		fb.db.doc(`users/${user.uid}`).update({
			documents: fb.admin.firestore.FieldValue.arrayUnion(req.params.fileid)
		});
	}

	// Remove file from folder
	let type = contentMapfound ? "contentMaps" : "documents";

	fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).update({
		[type]: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
	})
		.then(() => res.status(200).json({ message: "File removed from folder" }))
		.catch((err) => res.status(500).json({ error: err }));

});

// Get all folders
router.get("/folders", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get all folders
	let folders = await fb.db.collection(`users/${user.uid}/folders`).get();
	if (!folders)
		return res.status(400).json({ error: "Folders not found" });

	// send the folder name and id
	folders = folders.docs.map((doc) => {
		return {
			id: doc.id,
			name: doc.data().name
		};
	});

	return res.status(200).json({ folders: folders });
});
 
// Get all files in folder
router.get("/:folder/files", async (req, res) =>
{

	// Make sure all required fields are present
	if (!req.headers.authorization || !req.params.folder)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get folder
	let folder = await fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).get();
	if (!folder)
		return res.status(400).json({ error: "Folder not found" });

	folder = folder.data();

	let files = [];

	// For each file id, fetch the corresponding type data, such name and updateAt

	for(let i = 0; i < folder.contentMaps?.length; i++)
	{
		let file = await fb.db.doc(`contentMaps/${folder.contentMaps[i]}`).get();
		if(!file)
			return res.status(400).json({ error: "File not found" });

		file = file.data();

		files.push({
			id: folder.contentMaps[i],
			name: file.name,
			updatedAt: file.updatedAt.toDate(),
			createdAt: file.createdAt.toDate(),
			type: "contentmap"
		});
	}

	for(let i = 0; i < folder.documents?.length; i++)
	{
		let file = await fb.db.doc(`documents/${folder.documents[i]}`).get();
		if(!file)
			return res.status(400).json({ error: "File not found" });

		file = file.data();

		files.push({
			id: folder.documents[i],
			name: file.name,
			updatedAt: file.updatedAt.toDate(),
			createdAt: file.createdAt.toDate(),
			type: "document"
		});
	}

	
	return res.status(200).json({ files: files });

});

// Get all files not in folder
router.get("/files", async (req, res) => 
{
	
	if(!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let files = [];

	
	let userRef = await fb.db.collection(`users`).doc(user.uid).get();
	if(!userRef.exists)
		return res.status(400).json({ error: "User not found" });

	let contentMapsIds = userRef.data().contentMaps;

	// Get all documents in user's documents array
	let documentsIds = userRef.data().documents;

	// get name, id , updatedAt and type of each file
	for(let i = 0; i < contentMapsIds?.length; i++)
	{
		let file = await fb.db.doc(`contentMaps/${contentMapsIds[i]}`).get();
		if(!file)
			return res.status(400).json({ error: "File not found" });

		file = file.data();

		files.push({
			id: contentMapsIds[i],
			name: file.name,
			updatedAt: file.updatedAt.toDate(),
			createdAt: file.createdAt.toDate(),
			type: "contentmap"
		});
	}

	for(let i = 0; i < documentsIds?.length; i++)
	{
		let file = await fb.db.doc(`documents/${documentsIds[i]}`).get();
		if(!file)
			return res.status(400).json({ error: "File not found" });

		file = file.data();

		files.push({
			id: documentsIds[i],
			name: file.name,
			updatedAt: file.updatedAt.toDate(),
			createdAt: file.createdAt.toDate(),
			type: "document"
		});
	}

	return res.status(200).json({ files: files });

});

// Delete file from Anywhere
// Can be in or out of a folder
router.delete("/file/:fileid", async (req, res) =>
{

	if(!req.headers.authorization || !req.params.fileid)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get user document
	let userRef = await fb.db.collection(`users`).doc(user.uid).get();
	if(!userRef.exists)
		return res.status(400).json({ error: "User not found" });

	// File can exist in contentMaps array or documents array or in a folder
	let contentMapfound = userRef.data().contentMaps?.includes(req.params.fileid);

	let documentfound = null;
	if(!contentMapfound)
		documentfound = userRef.data().documents?.includes(req.params.fileid);

	let foldercontentMapfound = null;
	let folderdocumentfound = null;
	let folderId = null;

	if(!documentfound){
		let folders = await fb.db.collection(`users/${user.uid}/folders`).get();
		if(!folders)
			return res.status(400).json({ error: "Folders not found" });

		for(let i = 0; i < folders.docs.length; i++)
		{
			let folder = folders.docs[i].data();

			foldercontentMapfound = folder.contentMaps?.includes(req.params.fileid);
			folderdocumentfound = folder.documents?.includes(req.params.fileid);

			if(foldercontentMapfound || folderdocumentfound){
				folderId = folders.docs[i].id
				break;
			}
		}
	}

	// Ensure it exists somewhere
	if(!contentMapfound && !documentfound && !foldercontentMapfound && !folderdocumentfound)
		return res.status(400).json({ error: "File not found" });

	if(contentMapfound){
		// Delete file from contentMaps array
		await fb.db.doc(`users/${user.uid}`).update({
			contentMaps: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});

		// Delete file from contentMaps collection
		await fb.db.doc(`contentMaps/${req.params.fileid}`).delete();
	} 
	else if (documentfound) {
		// Delete file from documents array
		await fb.db.doc(`users/${user.uid}`).update({
			documents: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});

		// Delete file from documents collection
		await fb.db.doc(`documents/${req.params.fileid}`).delete();
	} else if (foldercontentMapfound) {
		// Delete file from folder contentMaps array
		await fb.db.doc(`users/${user.uid}/folders/${folderId}`).update({
			contentMaps: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});

		// Delete file from contentMaps collection
		await fb.db.doc(`contentMaps/${req.params.fileid}`).delete();
	} else if (folderdocumentfound) {
		// Delete file from folder documents array
		await fb.db.doc(`users/${user.uid}/folders/${folderId}`).update({
			documents: fb.admin.firestore.FieldValue.arrayRemove(req.params.fileid)
		});

		// Delete file from documents collection
		await fb.db.doc(`documents/${req.params.fileid}`).delete();
	}

	return res.status(200).json({ message: "File deleted" });


})



module.exports = router;