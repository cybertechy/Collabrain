const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");
const uuid = require('uuid');
const oci = require("../helpers/oracle");

/************************************************************/
/*                   User CRUD Operations                   */
/************************************************************/

// Get users
router.get("/", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get up to 1000 users
	fb.db.collection("users").limit(1000).get().then(records => {
		let users = [];
		records.forEach(doc => { users.push(doc.data()); });
		return res.json(users);
	});
});

// search users
router.get("/search", async (req, res) => {
	if (!req.headers.authorization || !req.query.username)
	  return res.status(400).json({ error: "Missing required data" });
  
	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
	  return res.status(401).json({ error: "Unauthorized" });

	// Get the current user's friends
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	if (!userRef.exists)
		return res.status(404).json({ error: "User not found" });

	let userdata = userRef.data();

	if(!userdata.friends) userdata.friends = [];
  
	// Get up to 1000 users
	fb.db.collection("users")
	  .orderBy("lowUsername", "asc")
	  .where("lowUsername", ">=", req.query.username)
	  .where("lowUsername", "<=", req.query.username + "\uf8ff")
	  .limit(1000)
	  .get()
	  .then((records) => {
		let users = [];
		records.forEach(doc => { 
			if(userdata?.friends?.includes(doc.id) && !req.query.noFriends) return;
			if(doc.id === user.uid) return;
			users.push({id:doc.id,...doc.data()}); 
		});
		return res.status(200).json(users);
	}).catch(err => { return res.status(500).json({ error: err }); });
})

// Get user from ID
router.get("/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	fb.db.doc(`users/${req.params.user}`).get()
		.then(doc => { return res.json(doc.data())})
		.catch(err => { return res.status(500).json({ error: err }); });

});

// Create user
router.post("/", (req, res) => {
	// Make sure all required fields are present
	if (!req.body.email || !req.body.fname || !req.body.lname || !req.body.uid)
		return res.status(400).json({ error: "Missing required data" });

	// Check if user already exists
	let users = fb.db.collection("users").where("email", "==", req.body.email);
	if (users.length > 0)
		return res.status(400).json({ error: "User already exists" });

	// Update user info
	fb.updateUser(req.body.uid, { email: req.body.email, displayName: req.body.fname + " " + req.body.lname })
	
	// Add user to database
	fb.db.doc(`users/${req.body.uid}`).set(
		{
			email: req.body.email,
			fname: req.body.fname,
			lname: req.body.lname,
			username: null,
			photo: null,
			bio: "",
			teams: [],
			friends: [],
			aliases: [],
			blocked: [],
			contentMaps: [],
			documents: [],
			friendRequests: [],
			teamInvites: [],
			education: [],
			courses: [],
			achievements: [],
			learningMaterials: [],
			twoFA: false,
			colorBlindFilter: false,
			fontSize: 16,
			theme: "light",
			language: "en",
			role: "user",
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.then(() => { return res.json({ message: "User added" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Update user info
router.patch("/", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization || Object.keys(req.body).length === 0)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	if(req.body.username){
		// Check if username is taken
		let users = fb.db.collection("users").where("username", "==", req.body.username);
		if (users.length > 0)
			return res.status(400).json({ error: "Username already taken" });

		// Update lowUsername
		req.body.lowUsername = req.body.username.toLowerCase();
	}

	if(req.body.fname || req.body.lname){
		fb.updateUser(user.uid, { displayName: req.body.fname + " " + req.body.lname });
	}

	if(req.body.photo && req.body.type){
		// get current photo
		let userRef = await fb.db.doc(`users/${user.uid}`).get();
		if (!userRef.exists)
			return res.status(404).json({ error: "User not found" });

		let userdata = userRef.data();

		if(!userdata.photo) userdata.photo = uuid.v4();

		// Upload photo to OCI
		let photo = await oci.addData("B1",userdata.photo,req.body.type,req.body.photo, { "user": user.uid });
		if(!photo.eTag) return res.status(500).json({ error: "Image not updated" });

		req.body.photo = userdata.photo
	}

	req.body.updatedAt = new Date();

	// Update user info
	fb.db.doc(`users/${user.uid}`).update(req.body)
		.then(() => { return res.json({ message: "User updated" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Delete user
router.delete("/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check that user is deleting their own account
	if (req.params.user !== user.uid)
		return res.status(401).json({ message: "Unauthorized" });

	// get user data 
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	if (!userRef.exists)
		return res.status(404).json({ error: "User not found" });

	let userdata = userRef.data();

	// delete the content maps and documents 
	if(userdata.contentMaps) await Promise.all(userdata.contentMaps?.map(async (content) => {
		let contentMapData = await fb.db.doc(`contentMaps/${content}`).get();
		if (!contentMapData.exists)
			return res.status(404).json({ error: "Content map not found" });

		let contentMap = contentMapData.data();
		let dataDelete = await oci.deleteData("B3", contentMap.data);

		if (dataDelete.error)
			return res.status(500).json({ error: dataDelete.error });

		await fb.db.doc(`contentMaps/${content}`).delete();
	}));

	if(userdata.documents) await Promise.all(userdata.documents?.map(async (document) => {
		let documentData = await fb.db.doc(`documents/${document}`).get();
		if (!documentData.exists)
			return res.status(404).json({ error: "Document not found" });

		let documentMap = documentData.data();
		let dataDelete = await oci.deleteData("B3", documentMap.data);

		if (dataDelete.error)
			return res.status(500).json({ error: dataDelete.error });

		await fb.db.doc(`documents/${document}`).delete();
	}));

	
	// remove user from any teams they are in
	if(userdata.teams) await Promise.all(userdata.teams?.map(async (team) => {
		let teamData = await fb.db.doc(`teams/${team}`).get();
		if (!teamData.exists)
			return res.status(404).json({ error: "Team not found" });

		let teamMap = teamData.data();

		// remove user from team
		delete teamMap.members[user.uid];

		await fb.db.doc(`teams/${team}`).update({members: teamMap.members});

		// remove team if user is owner and only member
		if (teamMap.owner == user.uid && Object.keys(teamMap.members).length == 0)
			await fb.db.doc(`teams/${team}`).delete();

	}));
	
	// remove members from any content maps or documents they access to
	if(userdata.AccessContentMaps) await Promise.all(userdata.AccessContentMaps?.map(async (access) => {
		let contentMapData = await fb.db.doc(`contentMaps/${access}`).get();
		if (!contentMapData.exists)
			return res.status(404).json({ error: "Content map not found" });

		let contentMap = contentMapData.data();
		delete contentMap.Access[user.uid];

		fb.db.doc(`contentMaps/${access}`).update({Access: contentMap.Access});
	}));

	if(userdata.AccessDocuments) await Promise.all(userdata.AccessDocuments?.map(async (access) => {
		let documentData = await fb.db.doc(`documents/${access}`).get();
		if (!documentData.exists)
			return res.status(404).json({ error: "Document not found" });

		let document = documentData.data();
		delete document.Access[user.uid];

		fb.db.doc(`documents/${access}`).update({Access: document.Access});
	}));

	// remove user from chat
	if(userdata.chats) await Promise.all(userdata.chats?.map(async (chat) => {
		let chatData = await fb.db.doc(`chats/${chat}`).get();
		if (!chatData.exists)
			return res.status(404).json({ error: "Chat not found" });

		// remove user from chat array
		chatData.update({members: fb.admin.firestore.FieldValue.arrayRemove(user.uid)});
	}));

	// remove folders
	await fb.db.collection(`users/${user.uid}/folders`).get().then(records => {
		records.forEach(doc => { doc.ref.delete(); });
	});

	// remove notifications
	await fb.db.collection(`users/${user.uid}/notifications`).get().then(records => {
		records.forEach(doc => { doc.ref.delete(); });
	});

	await fb.deleteUser(user.uid);

	fb.db.doc(`users/${req.params.user}`).delete()
		.then(() => { return res.json({ message: "User deleted" }); })
		.catch(err => { return res.status(500).json({ error: err }); });

});

// Check if username is taken
router.get("/username/:username", async (req, res) => {
	// Check if username is taken
	let users = await fb.db.collection("users").where("username", "==", req.params.username).get();
	if (users.docs.length > 0)
		return res.status(400).json({ error: "Username already taken" });

	return res.json({ message: "Username available" });
});

/************************************************************/
/*                   Friends CRUD Operations                */
/************************************************************/

// Get friends
router.get("/f/friends", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });
	

	fb.db.doc(`users/${user.uid}`).get()
		.then(doc => {
			res.json({
				friends: doc.data().friends,
				alias: doc.data().alias
			});
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Send friend request
router.post("/friends/request/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// don't send friend request to self
	if (req.params.user === user.uid)
		return res.status(400).json({ error: "Can't send friend request to self" });

	// Check if user is already friends
	let doc = await fb.db.doc(`users/${user.uid}`).get();
	if (!doc.exists)
		return res.status(404).json({ error: "User not found" });

	

	let friends = doc.data().friends;
	if(!friends) friends = [];

	if (friends.includes(req.params.user))
		return res.status(400).json({ error: "Already friends" });

	// check if request already sent
	let fUser = await fb.db.doc(`users/${req.params.user}`).get()
	if (!fUser.exists)
		return res.status(404).json({ error: "User not found" });

	let fUserData = fUser.data();
	if (fUserData.friendRequests && fUserData.friendRequests.includes(user.uid))
		return res.status(400).json({ error: "Friend request already sent" });

	// Send friend request
	fb.db.doc(`users/${req.params.user}`).update({
		friendRequests: fb.admin.firestore.FieldValue.arrayUnion(user.uid)
	})
		.then(() => { return res.json({ message: "Friend request sent" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Cancel/decline friend request
router.delete("/friends/request/:user", async (req, res) =>
{
	// req.body.type = "cancel" or "decline"

	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.type)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	//let uid = (req.body.type == "cancel") ? req.params.user : user.uid;

	// Cancel friend request
	fb.db.doc(`users/${user.uid}`).update({
		friendRequests: fb.admin.firestore.FieldValue.arrayRemove(req.params.user)
	})
		.then(() => { return res.json({ message: "Removed friend request" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Accept friend request
router.post("/friends/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user has friend request
	let error;
	let doc = await fb.db.doc(`users/${user.uid}`).get()
		.catch(err => { error = err; });

	if (error) return res.status(500).json({ error: error });

	let friendRequests = doc.data().friendRequests;
	if (friendRequests == undefined)
		return res.status(400).json({ error: "No friend requests" });

	let friendRequest = friendRequests.includes(req.params.user);
	if (!friendRequest)
		return res.status(400).json({ error: "No friend requests" });

	try {
		// Add to friends lists
		// Current user
		fb.db.doc(`users/${user.uid}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(req.params.user),
			friendRequests: fb.admin.firestore.FieldValue.arrayRemove(req.params.user)
		 });
		// Other user
		fb.db.doc(`users/${req.params.user}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(user.uid) });
		
		

		return res.status(200).json({ message: "Friend request accepted" });
	}
	catch (err) { return res.status(500).json({ error: err }); }
});

// Get friend requests
router.get("/friends/requests", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization) return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header

	if (!user) return res.status(401).json({ error: "Unauthorized" });

	fb.db.doc(`users/${user.uid}`).get()
		.then(doc => { res.json(doc.data().friendRequests); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Remove friend
router.delete("/friends/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	try {
		// Remove from friends lists
		// Current user
		fb.db.doc(`users/${user.uid}`).update({ friends: fb.admin.firestore.FieldValue.arrayRemove(req.params.user) });
		// Other user
		fb.db.doc(`users/${req.params.user}`).update({ friends: fb.admin.firestore.FieldValue.arrayRemove(user.uid) });

		return res.status(200).json({ message: "Friend removed" });
	}
	catch (err) { return res.status(500).json({ error: err }); }
});

// update alias for friend
// @requestParams: user id of friend
// @requestBody: alias
// Initially a friend has no alias, so only username is displayed
// If user sets alias, frontend will show alias and underneath "@username"
router.patch("/friends/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.alias)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]);
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// get user friends
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	if (!userRef.exists)
		return res.status(404).json({ error: "User not found" });

	let userdata = userRef.data();

	let friends = userRef.data().friends;
	if (!friends.includes(req.params.user))
		return res.status(400).json({ error: "firend not found" });

	if(!userdata.alias) userdata.alias = {};

	userdata.alias[req.params.user] = req.body.alias;

	fb.db.doc(`users/${user.uid}`).update({ alias: userdata.alias })
		.then(() => { return res.json({ message: "Alias updated" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});



/************************************************************/
/*                   Block CRUD Operations                  */
/************************************************************/

// Block user
router.post("/block/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Block user
	fb.db.doc(`users/${user.uid}`).update({ blocked: fb.admin.firestore.FieldValue.arrayUnion(req.params.user) })
		.then(() => { return res.json({ message: "User blocked" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Unblock user
router.delete("/block/:user", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Unblock user
	fb.db.doc(`users/${user.uid}`).update({ blocked: fb.admin.firestore.FieldValue.arrayRemove(req.params.user) })
		.then(() => { return res.json({ message: "User unblocked" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});


// Get blocked users
router.get("/blocked/users", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get blocked users
	let userRef = await fb.db.doc(`users/${user.uid}`).get();
	if (!userRef?.exists)
		return res.status(404).json({ error: "User not found" });

	let userdata = userRef.data();

	let blocked = await Promise.all(userdata.blocked.map(async (uid) => {
		let userRef = await fb.db.doc(`users/${uid}`).get();
		if (!userRef?.exists)
			return null;

		return { id: userRef.id, fname: userRef.data().fname, lname: userRef.data().lname, username: userRef.data().username, email: userRef.data().email };
	}));

	// filter out null values
	blocked = blocked.filter(user => user != null);

	return res.json((blocked)? blocked : []);
});
module.exports = router;	