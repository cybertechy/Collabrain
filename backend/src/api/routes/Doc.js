const express = require('express');
const router = express.Router();
const db = require("../helpers/firebase.js");

// Doc api endpoints
// NOTE: Need to be tested

router.post("/new", (req, res) =>
{
	try
	{
		db.verifyUser(req.body.token).then(user =>
		{
			if (!user)
				throw new Error("Unauthorized");

			db.createDoc(user.uid)
				.then((ref) => { res.json({ message: "Document created", id: ref.id }); })
				.catch((error) => { res.status(500).json({ message: "Failed" }); });

		});
	}
	catch (error) { res.status(401).json({ message: error }); }
});

router.post("/:ref", (req, res) =>
{
	try
	{
		db.verifyUser(req.body.token).then(user =>
		{
			if (!user)
				throw new Error("Unauthorized");

			db.updateDoc(user.uid, req.params.ref, req.body.title, req.body.content)
				.then(() => { res.json({ message: "Document updated" }); })
				.catch((error) => { res.status(500).json({ message: "Failed" }); });

		});
	}
	catch (error) { res.status(401).json({ message: error }); }
});

router.post("/delete/:ref", (req, res) =>
{
	try
	{
		db.verifyUser(req.body.token).then(user =>
		{
			if (!user)
				throw new Error("Unauthorized");

			db.removeDoc  (user.uid, req.params.ref)
				.then(() => { res.json({ message: "Document deleted" }); })
				.catch((error) => { res.status(500).json({ message: "Failed" }); });

		});
	}
	catch (error) { res.status(401).json({ message: error }); }
});

module.exports = router;	