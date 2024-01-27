const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

/************************************************************/
/*                   Personal Chat CRUD Operations          */
/************************************************************/

/* Endpoint for creating new direct chat */
router.post("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.members)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Create new chat
	let ref = await fb.db.collection("chats").add({
		members: req.body.members + [user.uid],
	});

	// Add chat to each member's chats
	req.body.members.forEach(async (member) =>
	{
		fb.db.doc(`users/${user.uid}`).update({
			chats: fb.admin.firestore.FieldValue.arrayUnion(ref.id)
		});
	});

	return res.status(200).json({ message: "Chat created" });
});

/* Endpoint for getting a chat's messages */
router.get("/:chat/messages", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is in chat
	let chat = await fb.db.doc(`chats/${req.params.chat}`).get();
	if (!chat.data().members.includes(user.uid))
		return res.status(401).json({ error: "Unauthorized" });

	// Get messages
	fb.db.collection(`chats/${req.params.chat}/messages`)
		.orderBy("sentAt.seconds").limit(100).get()
		.then(snapshot =>
		{
			let messages = [];
			snapshot.forEach(doc => messages.push(doc.data()));
			return res.status(200).json(messages);
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for editing a message */
router.patch("/:chat/messages/:message", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.message)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is the sender of the message
	let message = await fb.db.doc(`chats/messages/${req.params.message}`).get();
	if (message.data().sender != user.uid)
		return res.status(401).json({ error: "Unauthorized" });

	// Update message
	fb.db.doc(`chats/messages/${req.params.message}`).update({
		message: req.body.message,
		edited: true
	})
		.catch(err => { return res.status(500).json({ error: err }); });

	return res.status(200).json({ message: "Message updated" });
});

/* Endpoint for reporting a message */
router.post("/:chat/messages/:message/report", async (req, res) =>
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
	});
});

module.exports = router;