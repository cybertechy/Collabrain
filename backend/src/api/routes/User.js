const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");

router.get("/", (req, res) =>
{
	// Get up to 1000 users
	// fb.admin.auth().listUsers().then(records =>
	// {
	// 	res.json(records.users);
	// });

	fb.db.collection("users").limit(1000).get().then(records =>
	{
		let users = [];
		records.forEach(doc => { users.push(doc.data()); });
		res.json(users);
	});
});

router.get("/:user", (req, res) =>
{
	fb.db.doc(`users/${req.params.user}`).get()
		.then(doc => { res.json(doc.data()); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

router.post("/", (req, res) =>
{
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
	// verfiy token
	let user = await fb.verifyUser(req.body.token);
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