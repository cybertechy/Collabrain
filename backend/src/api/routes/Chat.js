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

	//Check if chat already exists
	let chatRef = await fb.db.collection("chats").where("members", "==", members).get();
	console.log(chatRef.empty);
	if (!chatRef.empty) return res.status(400).json({ error: "Chat already exists" });

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
router.get("/", async (req, res) => {
    // Make sure all required fields are present
    if (!req.headers.authorization)
        return res.status(400).json({ error: "Missing required data" });

    // verify token
    let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });

    // get chats from users
    let userRef = await fb.db.doc(`users/${user.uid}`).get();
    if (!userRef?.data()?.chats)
        return res.status(200).json({ message: "No chats" });

    //get the chats info
    let chats = userRef.data().chats;
	let chatsLength = chats.length;
	let result = [];

    for(let i=0; i<chatsLength; i++){
        // get chat info
		let chatId = chats[i];
        let chatRef = await fb.db.doc(`chats/${chatId}`).get();
        result.push({id: chatId, ...chatRef.data()});
	
        // get chat members info
        let members = [];
        await Promise.all(chatRef.data().members.map(async member => {
			if(member === user.uid) return; // Skip the user themselves
            let memberRef = await fb.db.doc(`users/${member}`).get();
            // Prepend the user themselves to the members list if it's their ID
            let memberData = { id: member, username: memberRef.data().username, email: memberRef.data().email, fname: memberRef.data().fname, lname: memberRef.data().lname };
            
			if (member === user.uid) members.unshift(memberData); // Prepend the user themselves
			else members.push(memberData);  
        }));

		// add the current user to the members list
		members.unshift({ id: user.uid, username: userRef.data().username, email: userRef.data().email, fname: userRef.data().fname, lname: userRef.data().lname });
        result[result.length-1].members = members;
	
        // also get the last message
        let lastMessage = await fb.db.collection(`chats/${chatId}/messages`).orderBy("sentAt", "desc").limit(1).get();	
        if (lastMessage.size > 0) {
            result[result.length-1].lastMessage =  lastMessage.docs[0].data();
			result[result.length-1].lastMessage.id = lastMessage.docs[0].id;
		}
        else
            result[result.length-1].lastMessage = {};	
    }

	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(result);
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
		.orderBy("sentAt").limit(100).get()
		.then(snapshot =>
		{
			let messages = [];
			snapshot.forEach(doc => messages.push({... doc.data(), id: doc.id}));
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