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
	if (!req.headers.authorization || !req.body.reason || !req.params.source || !req.params.sender)
		return res.status(400).json({ error: "Missing required data" });

	// req must have image xor message
	// req source must be either "user" xor "team"
	if ((!req.body.image && !req.body.message) || (req.body.image && req.body.message) || 
		(req.params.source != "user" && req.params.source != "team"))
		return res.status(400).json({ error: "Invalid request" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let image = (req.body.image) ? req.body.image : null;
	let message = (req.body.message) ? req.body.message : null;
	let chatID = (req.params.source == "user") ? req.params.chat : null;
	let teamID = (req.params.source == "team") ? req.params.team : null;

	// Report message
	let ref = await fb.db.collection("reports").add({
		chatID: chatID,
		teamID: teamID,
		message: message,
		image: image,
		reason: req.body.reason,
		sender: req.params.sender,
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



module.exports = router;