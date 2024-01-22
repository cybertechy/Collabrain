const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

// Create new folder
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
	if (folder)
		return res.status(400).json({ error: "Folder already exists" });

	// Create new folder
	fb.db.collection(`users/${user.uid}/folders/`).add({
		name: req.body.name,
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

module.exports = router;