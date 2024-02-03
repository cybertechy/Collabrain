const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");
const storage = require("../helpers/oracle");
const uuid = require("uuid");


/************************************************************/
/*                   Teams CRUD Operations                 */
/************************************************************/

/* Endpoint for getting teams with filters */
router.get("/search", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Go through filters and apply them
	let result = fb.db.collection("teams").where("visibility", "==", "public"); // Get all public teams
	if (req.query.name)
		result = result.orderBy("name", "asc").where("name", ">=", req.query.name)
			.where("name", "<=", req.query.name + "\uf8ff");

	// Sort by score and limit to 100
	let limit = 100;
	let results = result.orderBy("score", "desc").offset((req.query.page) ? req.query.page * limit : 0).limit(limit);
	// Get results
	results.get()
		.then(snapshot =>
		{
			let teams = [];
			snapshot.forEach(doc => teams.push(doc.data()));
			return res.status(200).json(teams);
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for creating a new team */
router.post("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.name || !req.body.visibility)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get user id to set them as the owner
	let uid = user.uid;
	let imageID;

	// upload the image to oracle if it exists
	if (req.body.image && req.body.MIMEtype)
	{
		//generate a unique ImageID uuid
		imageID = uuid.v4();
		let res = await storage.addData("B2", imageID, req.body.MIMEtype, req.body.image, null);
		if (!imageID)
			return res.status(500).json({ error: "Image upload failed" });
	}

	// Team data
	let data = {
		name: req.body.name,
		// teamImageID: (teamImage && MIMEtype) ? ImageID : null,
		teamImageID: (imageID) ? imageID : null,
		owner: uid,
		members: {
			[uid]: {
				role: "admin",
			}
		},
		visibility: req.body.visibility,
		score: 0,
	};

	// Create team
	fb.db.collection("teams").add(data)
		.then(ref =>
		{
			// Create general channel
			ref.collection("channels").add({ name: "General" })
				.then(ref =>
				{
					ref.collection("messages").add({
						message: "Welcome to General!",
						sender: "System",
						timestamp: new Date().getSeconds(),
						sentAt: fb.admin.firestore.FieldValue.serverTimestamp()
					});
				});

			// Add the team to the user's teams
			fb.db.doc(`users/${uid}`).update({
				teams: fb.admin.firestore.FieldValue.arrayUnion(ref.id)
			});

			return res.status(200).json({ message: "Team created", teamID: ref.id });
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for getting a team's data along with its channels including channelId */
router.get("/:team", async (req, res) => {
    if (!req.headers.authorization)
        return res.status(400).json({ error: "Missing required data" });

    // verify token
    let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });

    // Get team data
    let teamData = {};
    fb.db.doc(`teams/${req.params.team}`).get()
        .then(doc => {
            teamData = doc.data();
            
            // Get list of channels for the team using the team's ID
            return fb.db.collection(`teams/${req.params.team}/channels`).get();
        })
        .then(snapshot => {
            let channels = [];
            snapshot.forEach(doc => {
                const channelData = doc.data();
                channelData.channelId = doc.id; // Add channelId to channel data
                channels.push(channelData);
            });
            
            // Add the channels data to the team data
            teamData.channels = channels;
            
            return res.status(200).json(teamData);
        })
        .catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for updating a team's data */
router.patch("/:team", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.data)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	try
	{
		// Check if user is a administator of the team
		await fb.db.doc(`teams/${req.params.team}`).get()
			.then(doc =>
			{
				if (doc.data().members[user.uid].role != "admin")
					return res.status(401).json({ error: "Unauthorized" });
			});

		fb.db.doc(`teams/${req.params.team}`).update(req.body.data)
			.then(() => { return res.status(200).json({ message: "Team updated" }); });

	}
	catch (err) { return res.status(500).json({ error: err }); }
});

/* Endpoint for deleting a team */
router.delete("/:team", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({ error: "Unauthorized" });

	// Check if user is a administator of the team
	let doc = await fb.db.doc(`teams/${req.params.team}`).get();
	if(!doc.exists) return res.status(404).json({ error: "Team not found" });
	if (doc.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	let teamData = doc.data();

	// remove the team reference from all the users
	Object.keys(teamData.members).forEach(member => {
		fb.db.doc(`users/${member}`).update({
			teams: fb.admin.firestore.FieldValue.arrayRemove(req.params.team)
		});
	});

	// delete all collections and subcollections
	// get all the channels
	let channels = await fb.db.collection(`teams/${req.params.team}/channels`).get();


	// delete all channels
    let channelRef = await fb.db.collection(`teams/${req.params.team}/channels`).get()
	channelRef.forEach(async doc => {
		// delete all messages
		let messages = await fb.db.collection(`teams/${req.params.team}/channels/${doc.id}/messages`).get();
		messages.forEach(async message => {
			fb.db.doc(`teams/${req.params.team}/channels/${doc.id}/messages/${message.id}`).delete();
		});
		// delete the channel
		await fb.db.doc(`teams/${req.params.team}/channels/${doc.id}`).delete();
	})
	
	// Delete team
	await fb.db.doc(`teams/${req.params.team}`).delete()
		.then(() => { return res.status(200).json({ message: "Team deleted" }); })
		.catch(err => { return res.status(500).json({ error: err }); });

	
});

/* Endpoint for user's teams */
router.get("/", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(401).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get user's teams
	fb.db.doc(`users/${user.uid}`).get()
		.then(doc => { return res.status(200).json(doc.data().teams); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/************************************************************/
/*                   Invites CRUD Operations                */
/************************************************************/

/* Endpoint for sending team invite */
router.post("/:team/invite/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is a administator of the team
	let doc = await fb.db.doc(`teams/${req.params.team}`).get();
	if (doc.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Make sure user is not already part of the team
	let userDoc = await fb.db.doc(`users/${req.params.user}`).get();
	if (userDoc.data().teams.includes(req.params.team))
		return res.status(400).json({ error: "User is already part of the team" });

	// Send invite
	fb.db.doc(`users/${req.params.user}`).update({
		invites: fb.admin.firestore.FieldValue.arrayUnion({
			team: req.params.team
		})
			.catch(err => { return res.status(500).json({ error: err }); })
	});
});

/* Endpoint for getting user's invites */
router.get("/:team/invite", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({ error: "Unauthorized" });

	// Get user's invites
	fb.db.doc(`users/${user.uid}`).get()
		.then(doc =>
		{
			return res.status(200).json(doc.data().invites);
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for cancelling user's invite */
router.delete("/:team/invite/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is a administator of the team
	let doc = await fb.db.doc(`teams/${req.params.team}`).get();
	if (doc.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Cancel invite
	fb.db.doc(`users/${req.params.user}`).update({
		invites: fb.admin.firestore.FieldValue.arrayRemove({
			team: req.params.team
		})
	})
		.catch(err => { return res.status(500).json({ error: err }); });

	return res.status(200).json({ message: "Invite cancelled" });
});

/** Endpoint to decline invite */
router.delete("/:team/invite", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verfiy token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({ error: "Unauthorized" });

	// Decline invite
	fb.db.doc(`users/${user.uid}`).update({
		invites: fb.admin.firestore.FieldValue.arrayRemove({
			team: req.params.team
		})
	})
		.then(() => { return res.status(200).json({ message: "Invite declined" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/************************************************************/
/*                   Members CRUD Operations                */
/************************************************************/


/* Endpoint for adding a member to a team */
router.post("/:team/users", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is part of the team already
	let doc = await fb.db.doc(`users/${user.uid}`).get();
	if (doc.data().teams.includes(req.params.team))
		return res.status(400).json({ error: "User is already part of the team" });

	try
	{
		// Add user to team members list
		fb.db.doc(`teams/${req.params.team}`).update({
			[`members.${user.uid}`]: {
				role: "member"
			}
		});

		// Add team to user's teams list
		fb.db.collection("users").doc(user.uid).update({
			teams: fb.admin.firestore.FieldValue.arrayUnion(req.params.team)
		});

		// If joined from invite, remove invite
		if (req.query.invite == "true")
		{
			fb.db.doc(`users/${user.uid}`).update({
				invites: fb.admin.firestore.FieldValue.arrayRemove({
					teamID: req.params.team
				})
			});
		}
	}
	catch (err) { return res.status(500).json({ error: err }); }

	return res.status(200).json({ message: "Member added" });
});

/* Endpoint for deleting a member from a team */
router.delete("/:team/users", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is part of the team
	let doc = await fb.db.doc(`users/${user.uid}`).get();
	if (!doc.data().teams.includes(req.params.team))
		return res.status(400).json({ error: "User is not part of the team" });

	// Check if user is a admin of the team
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role == "admin")
		return res.status(400).json({ error: "Admin cannot leave team" });

	// Remove user from team
	try
	{
		fb.db.doc(`teams/${req.params.team}`).update({
			[`members.${user.uid}`]: fb.admin.firestore.FieldValue.delete()
		});

		// Remove team from user's teams list
		fb.db.collection("users").doc(user.uid).update({
			teams: fb.admin.firestore.FieldValue.arrayRemove(req.params.team)
		});
	}
	catch (err) { return res.status(500).json({ error: err }); }

	return res.status(200).json({ message: "Member removed" });
});

/* Endpoint for getting a team's members */
router.get("/:team/users", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is part of the team
	let doc = await fb.db.doc(`users/${user.uid}`).get();
	if (!doc.data().teams.includes(req.params.team))
		return res.status(400).json({ error: "User is not part of the team" });

	// Get team members
	fb.getTeamMembers(req.params.team)
		.then(members => { return res.status(200).json(members); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for banning a member from a team */
router.post("/:team/ban/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({error: "Unauthorized" });

	// Check if initiator is admin
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Add user to banned list
	fb.db.doc(`teams/${req.params.team}`).update({
		banned: fb.admin.firestore.FieldValue.arrayUnion(req.params.user)
	})
		.catch(err => { return res.status(500).json({ error: err }); });
	
});

/* Endpoint for unbanning a member from a team */
router.delete("/:team/ban/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });
	
	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({ error: "Unauthorized" });

	// Check if initiator is admin
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });
	
	// Remove user from banned list
	fb.db.doc(`teams/${req.params.team}`).update({
		banned: fb.admin.firestore.FieldValue.arrayRemove(req.params.user)
	})
		.catch(err => { return res.status(500).json({ error: err }); });

	return res.status(200).json({ message: "User unbanned" });
});

/* Endpoint for getting a team's banned members */
router.get("/:team/ban", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({error: "Unauthorized" });

	// Check if initiator is admin
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Get team's banned members
	fb.db.doc(`teams/${req.params.team}`).get()
		.then(doc => { return res.status(200).json(doc.data().banned); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for updating a member's role */
router.patch("/:team/users/:user", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.role)
		return res.status(400).json({ error: "Missing required data" });

	// verify token and authority
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(400).json({error: "Unauthorized" });

	// Check if initiator is owner
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().owner != user.uid)
		return res.status(401).json({ error: "Unauthorized" });

	// Update member's role
	fb.db.doc(`teams/${req.params.team}`).update({
		[`members.${req.params.user}.role`]: req.body.role
	})
		.then(() => { return res.status(200).json({ message: "Member role updated" }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/************************************************************/
/*                   Channel CRUD operations                */
/************************************************************/

/* Endpoint for creating a new channel */
router.post("/:team/channels", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.name)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is a admin of the team
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Create channel
	fb.db.collection(`teams/${req.params.team}/channels`).add({ name: req.body.name })
		.then(ref => { return res.status(200).json({ message: "Channel created", channelID: ref.id }); })
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for updating a channel's data */
router.patch("/:team/channels/:channel", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.data)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is a admin of the team
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	try
	{
		fb.db.doc(`teams/${req.params.team}/channels/${req.params.channel}`).update(req.body.data)
			.then(() => { return res.status(200).json({ message: "Channel updated" }); });
	}
	catch (err) { return res.status(500).json({ error: err }); }
});

/* Endpoint for deleting a channel */
router.delete("/:team/channels/:channel", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is a admin of the team
	let team = await fb.db.doc(`teams/${req.params.team}`).get();
	if (team.data().members[user.uid].role != "admin")
		return res.status(401).json({ error: "Unauthorized" });

	// Delete subcollection of messages
	fb.deleteCollection(`teams/${req.params.team}/channels/${req.params.channel}/messages`)
		.catch(err => { return res.status(500).json({ error: err }); });

	// Delete channel
	fb.db.doc(`teams/${req.params.team}/channels/${req.params.channel}`).delete()
		.then(() => { return res.status(200).json({ message: "Channel deleted" }); })
		.catch(err => { return res.status(500).json({ error: err }); });

});

/* Endpoint for getting a channel's messages */
router.get("/:team/channels/:channel/messages", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Get messages
	let channelID = (await fb.db.collection(`teams/${req.params.team}/channels`)
		.where("name", "==", req.params.channel).get()).docs[0].id;

	fb.db.collection(`teams/${req.params.team}/channels/${channelID}/messages`)
		.orderBy("sentAt").limit(100).get()
		.then(snapshot =>
		{
			let messages = [];
			snapshot.forEach(doc => messages.push(doc.data()));
			return res.status(200).json(messages);
		})
		.catch(err => { return res.status(500).json({ error: err }); });
});

/* Endpoint for editing a message */
router.patch("/:team/channels/:channel/messages/:message", async (req, res) =>
{
	// Make sure all required fields are present
	if (!req.headers.authorization || !req.body.message)
		return res.status(400).json({ error: "Missing required data" });

	// verify token
	let user = await fb.verifyUser(req.headers.authorization.split(" ")[1]); // Get token from header
	if (!user)
		return res.status(401).json({ error: "Unauthorized" });

	// Check if user is the sender of the message
	let message = await fb.db.doc(`teams/${req.params.team}/channels/${req.params.channel}/messages/${req.params.message}`).get();
	if (message.data().sender != user.uid)
		return res.status(401).json({ error: "Unauthorized" });

	// Update message
	fb.db.doc(`teams/${req.params.team}/channels/${req.params.channel}/messages/${req.params.message}`).update({
		message: req.body.message,
		edited: true
	})
		.catch(err => { return res.status(500).json({ error: err }); });

	return res.status(200).json({ message: "Message updated" });
});

module.exports = router;