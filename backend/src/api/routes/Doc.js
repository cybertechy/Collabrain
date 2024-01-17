const express = require('express');
const router = express.Router();
const db = require("../helpers/firebase");

// Doc api endpoints
// NOTE: Need to be tested

router.post("/", (req, res) =>
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
	catch (error) { res.status(401).json({ error: error }); }
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
				.catch((error) => { res.status(500).json({ error: "Failed to create doc" }); });

		});
	}
	catch (error) { res.status(401).json({ error: error }); }
});

router.delete("/:ref", (req, res) =>
{
	try
	{
		db.verifyUser(req.body.token).then(user =>
		{
			if (!user)
				throw new Error("Unauthorized");

			db.removeDoc(user.uid, req.params.ref)
				.then(() => { res.json({ message: "Document deleted" }); })
				.catch((error) => { res.status(500).json({ error: "Failed to delete doc" }); });

		});
	}
	catch (error) { res.status(401).json({ message: error }); }
});

module.exports = router;	