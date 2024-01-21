const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

/************************************************************/
/*                   User CRUD Operations                   */
/************************************************************/

// Get users
router.get("/", async (req, res) => 
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get up to 1000 users
	fb.db.collection("users").limit(1000).get().then(records =>
	{
		let users = [];
		records.forEach(doc => { users.push(doc.data()); });
		res.json(users);
	});
});

// Get user from ID
router.get("/:user", async (req, res) =>
{
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
router.post("/", (req, res) =>
{
	// Make sure all required fields are present
	if (!req.body.email || !req.body.fname || !req.body.lname || !req.body.username || !req.body.photo)
		return res.status(400).json({ error: "Missing required data" });

	// Add user to database
	fb.db.doc(`users/${req.body.uid}`).set(
		{
			email: req.body.email,
			fname: req.body.fname,
			lname: req.body.lname,
			username: req.body.username,
			photo: req.body.photo,
			bio: "",
			teams: [],
			friends: [],
			blocked: []
		})
		.then(() => { return res.json({ message: "User added" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Update user info
router.patch("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// Verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Update user info
	fb.db.doc(`users/${user.uid}`).update(req.body)
		.then(() => { return res.json({ message: "User updated" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Delete user
router.delete("/:user", async (req, res) =>
{
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

/************************************************************/
/*                   Friends CRUD Operations                */
/************************************************************/

// Get friends
router.get("/friends", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	fb.db.doc(`users/${user.uid}`).get()
		.then(doc => { res.json(doc.data().friends); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Send friend request
router.post("/friends/request/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Sender's user data
	let senderData = {
		uid: user.uid,
		username: user.username,
		photo: user.photo
	};

	// Send friend request
	fb.db.doc(`users/${req.params.user}`).update({ friendRequests: fb.admin.firestore.FieldValue.arrayUnion(senderData) })
		.then(() => { return res.json({ message: "Friend request sent" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Cancel friend request
router.delete("/friends/request/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Cancel friend request
	fb.db.doc(`users/${req.params.user}`).update({ friendRequests: fb.admin.firestore.FieldValue.arrayRemove(user.uid) })
		.then(() => { return res.json({ message: "Friend request cancelled" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

// Accept friend request
router.post("/friends/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	try
	{
		// Add to friends lists
		// Current user
		fb.db.doc(`users/${user.uid}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(req.params.user) });
		// Other user
		fb.db.doc(`users/${req.params.user}`).update({ friends: fb.admin.firestore.FieldValue.arrayUnion(user.uid) });
		// Remove from friend requests
		fb.db.doc(`users/${user.uid}`).update({ friendRequests: fb.admin.firestore.FieldValue.arrayRemove(user.uid) });

		return res.status(200).json({ message: "Friend request accepted" });
	}
	catch (err) { return res.status(500).json({ error: err }); }
});

// Remove friend
router.delete("/friends/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Remove from friends lists
	// Current user
	fb.db.doc(`users/${user.uid}`).update({ friends: fb.admin.firestore.FieldValue.arrayRemove(req.params.user) });
	// Other user
	fb.db.doc(`users/${req.params.user}`).update({ friends: fb.admin.firestore.FieldValue.arrayRemove(user.uid) });
});

/************************************************************/
/*                   Block CRUD Operations                  */
/************************************************************/

// Block user
router.post("/block/:user", async (req, res) =>
{
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
router.delete("/block/:user", async (req, res) =>
{
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