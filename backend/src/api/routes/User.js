const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

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
		res.json(users);
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

	// Get up to 1000 users
	fb.db.collection("users").orderBy("lowUsername", "asc").where("lowUsername", ">=", req.query.username).where("lowUsername", "<=", req.query.username + "\uf8ff").limit(1000).get().then(records => {
		let users = [];
		records.forEach(doc => { users.push(doc.data()); });
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
		.then(doc => { res.json(doc.data()); })
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
			
		})
		.then(() => { return res.json({ message: "User added" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Update user info
router.patch("/", async (req, res) => {
	// Make sure all required fields are present
	if (!req.headers.authorization)
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

	// Send friend request
	fb.db.doc(`users/${req.params.user}`).update({
		friendRequests: fb.admin.firestore.FieldValue.arrayUnion({ user: user.uid })
	})
		.then(() => { return res.json({ message: "Friend request sent" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Cancel/decline friend request
router.delete("/friends/request/:user", async (req, res) => {
	// req.body.type = "cancel" or "decline"

	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.type)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	let uid = (req.body.type == "cancel") ? req.params.user : user.uid;

	// Cancel friend request
	fb.db.doc(`users/${uid}`).update({
		friendRequests: fb.admin.firestore.FieldValue.arrayRemove({ user: uid })
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

	let friendRequest = friendRequests.find(request => request.uid == req.params.user);
	if (friendRequest == undefined)
		return res.status(400).json({ error: "No friend requests" });

	try {
		// Add to friends lists
		// Current user
		fb.db.doc(`users/${user.uid}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(req.params.user) });
		// Other user
		fb.db.doc(`users/${req.params.user}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(user.uid) });
		// Remove from friend requests
		fb.db.doc(`users/${user.uid}`).update({ friendRequests: fb.admin.firestore.FieldValue.arrayRemove(friendRequest) });

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

module.exports = router;	