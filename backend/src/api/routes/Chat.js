const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

/************************************************************/
/*                   Personal Chat CRUD Operations          */
/************************************************************/

/* Endpoint for creating new direct chat */
// @request body : {members: [uid1, uid2]}
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
	let members = req.body.members?.concat(user.uid);

	if(!members) return res.status(400).json({ error: "Missing required data" });
	if (members?.length < 2) return res.status(400).json({ error: "Not enough members" });

	let ref = await fb.db.collection("chats").add({
		members,
	});

	// Add chat to each member's chats
	members.forEach(async (member) =>
	{
		
		let status = await fb.db.doc(`users/${member}`).update({
			chats: fb.admin.firestore.FieldValue.arrayUnion(ref.id)
		});

		if (!status) return res.status(500).json({ error: "Error adding chat to user" });
	});

	return res.status(200).json({ message: "Chat created" });
});

/* Endpoint for retrieving all chats a user is part of */
router.get("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// get chats from users
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	if(!userRef?.data()?.chats)
		return res.status(200).json({ message: "No chats" });

	//Promise.all and get the chats info
	let chats = [];
	let chatsStatus = await Promise.all(userRef.data().chats.map(async chat =>
	{
		// get chat info
		let chatRef = await fb.db.doc(`chats/${chat}`).get();
		chats.push({id:chat ,...chatRef.data()});

		// get chat members info
		let members = [];
		let membersStatus = await Promise.all(chatRef.data().members.map(async member =>
		{
			let memberRef = await fb.db.doc(`users/${member}`).get();
			members.push({ id: member, username: memberRef.data().username, email: memberRef.data().email , fname: memberRef.data().fname, lname: memberRef.data().lname});
		}));

		chats[chats.length-1].members = members;

		// also get the last message
		let lastMessage = await fb.db.collection(`chats/${chat}/messages`).orderBy("sentAt", "desc").limit(1).get();
		if(lastMessage.size > 0)
			chats[chats.length-1].lastMessage = lastMessage.docs[0].data();
		else
			chats[chats.length-1].lastMessage = null;
	}));

	return res.status(200).json(chats);
});

/* Endpoint for adding a user to a chat */
// @request body : {members: [uid1, uid2]}
router.post("/:chat/members", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.members)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is in chat
	let chat = await fb.db.doc(`chats/${req.params.chat}`).get();
	if (!chat.data().members.includes(user.uid))
		return res.status(401).json({ error: "Unauthorized" });

	// Add members to chat
	
	let status = await fb.db.doc(`chats/${req.params.chat}`).update({
		members: fb.admin.firestore.FieldValue.arrayUnion(...req.body.members)
	});
	if (!status) return res.status(500).json({ error: "Error adding member to chat" });

	// Add chat to each member's chats
	req.body.members.forEach(async (member) =>
	{
		let status = await fb.db.doc(`users/${member}`).update({
			chats: fb.admin.firestore.FieldValue.arrayUnion(req.params.chat)
		});
		if (!status) return res.status(500).json({ error: "Error adding chat to user" });
	}
	);

	return res.status(200).json({ message: "Member added to chat" });
});

/* Endpoint for removing a user from a chat */
router.delete("/:chat/members/:member", async (req, res) =>
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

	// Remove member from chat
	let status = await fb.db.doc(`chats/${req.params.chat}`).update({
		members: fb.admin.firestore.FieldValue.arrayRemove(req.params.member)
	});
	if (!status) return res.status(500).json({ error: "Error removing member from chat" });

	// Remove chat from member's chats
	let status2 = await fb.db.doc(`users/${req.params.member}`).update({
		chats: fb.admin.firestore.FieldValue.arrayRemove(req.params.chat)
	});
	if (!status2) return res.status(500).json({ error: "Error removing chat from user" });

	return res.status(200).json({ message: "Member removed from chat" });
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
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// make sure either of message xor reactions is present
	if (!req.body.message && !req.body.reactions)
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
		message: (req.body.message)? req.body.message : message.data().message,
		reactions: (req.body.reactions)? req.body.reactions : message.data().reactions,
		edited: true
	})
		.catch(err => { return res.status(500).json({ error: err }); });

	return res.status(200).json({ message: "Message updated" });
});

module.exports = router;