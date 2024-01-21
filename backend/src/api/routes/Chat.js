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

module.exports = router;