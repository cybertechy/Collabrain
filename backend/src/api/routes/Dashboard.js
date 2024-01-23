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

	// get folder document
	let folder = await fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).get();
	if (!folder.exists)
		return res.status(400).json({ error: "Folder not found" });

	folder = folder.data();

	// Add file to folder
	fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).update({
		files: fb.admin.firestore.FieldValue.arrayUnion({id:req.params.fileid,type:contentMapfound?"contentmap":"document"})
	})
		.then(() => res.status(200).json({ message: "File added to folder" }))
		.catch((err) => res.status(500).json({ error: err }));
});

// Remove file from folder
router.delete("/file/:fileid/:folder", async (req, res) => 
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
	let contentMapfound = folder.files.find((file) => file.id === req.params.fileid && file.type === "contentmap");
	let documentfound = null;
	if (!contentMapfound)
		documentfound = folder.files.find((file) => file.id === req.params.fileid && file.type === "document");

	// Check if file already exists in folder
	if (!contentMapfound && !documentfound)
		return res.status(400).json({ error: "File not found in folder" });

	// Remove file from folder
	fb.db.doc(`users/${user.uid}/folders/${req.params.folder}`).update({
		files: fb.admin.firestore.FieldValue.arrayRemove({id:req.params.fileid,type:contentMapfound?"contentmap":"document"})
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

	for (let i = 0; i < folder.files.length; i++)
	{
		let type = folder.files[i].type === "contentmap" ? "contentMaps" : "documents";
		let file = await fb.db.doc(`${type}/${folder.files[i].id}`).get();
		if (!file)
			return res.status(400).json({ error: "File not found" });

		file = file.data();

		files.push({
			id: folder.files[i].id,
			name: file.name,
			updatedAt: file.updatedAt.toDate(),
			type: folder.files[i].type
		});
	}

	
	return res.status(200).json({ files: files });

});



module.exports = router;