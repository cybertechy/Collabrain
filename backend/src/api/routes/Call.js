const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

// Endpoint to store call in realtime database
router.post("/", async (req, res) =>
{
	// Make sure all required fields are present
	// Target is "team" or "direct"
	// ID is the target's ID
	if (!req.headers.authorization || !req.body.room || !req.body.target || !req.body.targetID)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Add to realtime database
	if (req.body.target === "team")
		// fb.realtimeDB.ref(`calls/team`).child(req.body.targetID).set("room", req.body.room);
		fb.realtimeDB.ref(`calls/team/${req.body.targetID}`).set({ room: req.body.room});

	else if (req.body.target === "chat")
		// fb.realtimeDB.ref(`calls/chat`).child(req.body.targetID).set("room", req.body.room);
		fb.realtimeDB.ref(`calls/chat/${req.body.targetID}`).set({ room: req.body.room});

	res.status(200).json({ message: "Call created" });
});

router.get("/:target/:targetID", async (req, res) =>
{
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get call room
	let room = null;
	if (req.params.target === "team")
		room = await fb.realtimeDB.ref(`calls/team/${req.params.targetID}`).get();
	
	else if (req.params.target === "chat")
		room = await fb.realtimeDB.ref(`calls/chat/${req.params.targetID}`).get();

	res.status(200).json(room);
});

module.exports = router;