const express = require('express')
const router = express.Router()
const db = require("../helpers/firebase.js");

router.get("/new", (req, res) =>
{
	db.verifyUser(req.query.token).then(user =>
	{
		if (!user)
			res.json({ message: "Invalid token" });

		// Get doc data and create it in Firestore
		db.createDoc(`${user.uid}/docs`, { owner: user.uid, title: req.query.title, content: req.query.content })
			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
	});

	res.json({ message: "Success!" });
});

router.get("/remove", (req, res) =>
{
	db.verifyUser(req.query.token).then(user =>
	{
		if (!user)
			res.json({ message: "Invalid token" });

		// Remove doc from Firestore
		db.removeDoc(`${user.uid}/docs`, req.query.docID)
			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
	});

	res.json({ message: "Success!" });
});

router.get("/update", (req, res) =>
{
	db.verifyUser(req.query.token).then(user =>
	{
		if (!user)
			res.json({ message: "Invalid token" });

		// Update doc in Firestore
		db.updateDoc(`${user.uid}/docs`, req.query.docID, { title: req.query.title, content: req.query.content })
			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
	});

	res.json({ message: "Success!" });
});

router.get("/get", (req, res) =>
{
	db.verifyUser(req.query.token).then(user =>
	{
		if (!user)
			res.json({ message: "Invalid token" });

		// Get doc from Firestore
		db.getDoc(`${user.uid}/docs`, req.query.docID)
			.then(doc => { res.json(doc); }).catch((error) => { res.json({ message: error }); });
	});

	res.json({ message: "Success!" });
});

module.exports = router;