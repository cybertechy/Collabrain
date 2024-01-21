const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

router.get("/", async (req, res) => 
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get up to 1000 users
	fb.db.collection("users").limit(1000).get().then(records =>
	{
		let users = [];
		records.forEach(doc => { users.push(doc.data()); });
		res.json(users);
	});
});

router.get("/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	fb.db.doc(`users/${req.params.user}`).get()
		.then(doc => { res.json(doc.data()); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

router.post("/", (req, res) =>
{
	// Make sure all required fields are present
	if (!req.body.email || !req.body.fname || !req.body.lname || !req.body.username || !req.body.photo)
		return res.status(400).json({ error: "Missing required data" });

	// Add user to database
	fb.db.doc(`users/${req.body.uid}`).set(
		{
			email: req.body.email,
			fname: req.body.fname,
			lname: req.body.lname,
			username: req.body.username,
			photo: req.body.photo,
			teams: [],
			friends: [],
			blocked: []
		})
		.then(() => { return res.json({ message: "User added" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

router.delete("/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check that user is deleting their own account
	if (req.params.user !== user.uid)
		return res.status(401).json({ message: "Unauthorized" });

	fb.db.doc(`users/${req.params.user}`).delete()
		.then(() => { return res.json({ message: "User deleted" }); })
		.catch(err => { return res.status(500).json({ error: err }); });

});

module.exports = router;	