const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

/************************************************************/
/*                   Report CRUD Operations                 */
/*                         Untested                         */
/************************************************************/


/* Endpoint for reporting a message */
router.post("/", async (req, res) =>
{
	// req.body.source = "user" or "team"
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.reason || !req.body.source || !req.body.sender)
		return res.status(400).json({ error: "Missing required data" });

	// req must have image xor message
	// req source must be either "user" xor "team"
	if ((!req.body.image && !req.body.message) || (req.body.image && req.body.message) || 
		(req.body.source != "user" && req.body.source != "team"))
		return res.status(400).json({ error: "Invalid request" });

	// verify tokens
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let image = (req.body.image) ? req.body.image : null;
	let message = (req.body.message) ? req.body.message : null;
	let chatID = (req.body.source == "user") ? req.body.chat : null;
	let teamID = (req.body.source == "team") ? req.body.team : null;

	// Report message
	let ref = await fb.db.collection("reports").add({
		chatID: chatID,
		teamID: teamID,
		message: message,
		image: image,
		reason: req.body.reason,
		sender: req.body.sender,
		reporter: user.uid
	})
    .then(() => res.status(200).json({ message: "Message reported" }))
    .catch(err => res.status(500).json({ error: err }))	
});

/* Endpoint for getting all reports */
router.get("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is admin
	let userRef = await fb.db.doc(`users/${user.uid}`).get();

	// Get reports
	let reports = [];
	let snapshot = await fb.db.collection("reports").get();
	snapshot.forEach(doc => reports.push(doc.data()));
	return res.status(200).json(reports);
});

/* Get all reports of an user */
router.get("/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is admin
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	let userRole = userRef.data().role;
	if (!(userRole=== "content moderator")) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	// Get reports
	let reports = [];
	let snapshot = await fb.db.collection("reports").where("sender", "==", req.params.user).get();
	snapshot.forEach(doc => reports.push(doc.data()));
	return res.status(200).json(reports);
});



module.exports = router;