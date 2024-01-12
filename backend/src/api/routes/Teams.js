const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");
const storage = require("../helpers/oracle.js");
const uuid = require("uuid");


/************************************************************/
/*                   Teams CRUD Operations                 */
/************************************************************/

/* Endpoint for creating a new team */

router.post("/", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token || !req.body.name || !req.body.visibility)
		return res.status(400).json({error: "Missing required data"}); 

    // verfiy token
    let user = await fb.verifyUser(req.body.token);
    if(!user)
        return res.status(401).json({error: "Unauthorized"});

	// Get user id to set them as the owner
	let uid = user.uid;
	let imageID;

    // upload the image to oracle if it exists
    if(req.body.image && req.body.MIMEtype)
	{
		//generate a unique ImageID uuid
		imageID = uuid.v4();
        let res = await storage.addData("B2", imageID, req.body.MIMEtype, req.body.image, null)
        if(!imageID)
            return res.status(400).json({code:400, error: "Image upload failed"});
    }

	// Team data
	let data = {
		name: req.body.name,
		// teamImageID: (teamImage && MIMEtype) ? ImageID : null,
		teamImageID: (imageID) ? imageID : null,
		owner: uid,
		members : { [uid]: {
			role: "admin",
		} },
		visibility: req.body.visibility
	}

	// Create team
	fb.db.collection("teams").add(data)
		.then(ref => {
			// Create general channel
			ref.collection("channels").add({name: "General"})
			.then(ref => {
				ref.collection("messages").add({
					message: "Welcome to the General channel!",
					sender: "System",
					timestamp: new Date().getSeconds()
				})
			})
			
			// Add the team to the user's teams
			fb.db.collection("users").doc(uid).update({
				teams: fb.admin.firestore.FieldValue.arrayUnion(ref.id)
			})

			return res.status(200).json({message: "Team created", teamID: ref.id});
		})
		.catch(err => { return res.status(500).json({error: "Team creation failed"}); });
});

/* Endpoint for getting a team's data */

router.get("/:team", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token)
		return res.status(400).json({error: "Missing required data"});
    
	// verfiy token
	let user = await fb.verifyUser(req.body.token);
	if(!user)
		return res.status(401).json({error: "Unauthorized"});

	fb.db.doc(`teams/${req.params.team}`).get()
		.then(doc => {
			return res.status(200).json(doc.data());
		})
		.catch(err => { return res.status(400).json({error: "Team not found"}); });
});


/* Endpoint for updating a team's data */

router.patch("/:team", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token || !req.body.data)
		return res.status(400).json({error: "Missing required data"});

	// verify token
	let user = await fb.verifyUser(req.body.token);
	if(!user)
		return res.status(401).json({error: "Unauthorized"});

	try
	{
		// Check if user is a administator of the team
		await fb.db.doc(`teams/${req.params.team}`).get()
			.then(doc => {
				if(doc.data().members[user.uid].role != "administator")
					return res.status(400).json({error: "User is not a administator of the team"});
			})

		fb.db.doc(`teams/${req.params.team}`).update(req.body.data)
			.then(() => { return res.status(200).json({message: "Team updated"}); })

	}
	catch(err) { return res.status(400).json({error: "Team update failed"}); }
});

/* Endpoint for deleting a team */

router.delete("/:team", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token)
		return res.status(400).json({error: "Missing required data"});

	// verfiy token
	let user = await fb.verifyUser(req.body.token);
	if(!user)
		return res.status(400).json({code:401, error: "Unauthorized"});

	// Check if user is a administator of the team
	await fb.db.doc(`teams/${req.params.team}`).get()
	.then(doc => {
		if(doc.data().members[user.uid].role != "administator")
			return res.status(400).json({error: "Unauthorized"});

		// Delete team
		fb.db.doc(`teams/${req.params.team}`).delete()
			.then(() => { return res.status(200).json({message: "Team deleted"}); })
			.catch(err => { return res.status(500).json({error: "Team deletion failed"}); });
	})
	.catch(err => { return res.status(400).json({error: "Team not found"}); })
});


/************************************************************/
/*                   Members CRUD Operations                */
/************************************************************/


/* Endpoint for adding a member to a team*/

router.post("/:team/user", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token)
		return res.status(400).json({error: "Missing required data"});

    // verify token and authority
    let user = await fb.verifyUser(req.body.token);
    if(!user || user.uid != req.body.user)
        return res.status(401).json({error: "Unauthorized"});

	// Check if user is part of the team already
	let doc = await fb.db.doc(`users/${req.body.user}`).get()
	if (doc.data().teams.includes(req.params.team))
		return res.status(400).json({error: "User is already part of the team"});

	// Add user to team members list
	try
	{
		fb.db.doc(`teams/${req.params.team}`).update({
			[`members.${req.body.user}`]: {
				role: "member"
			}
		})

		// Add team to user's teams list
		fb.db.collection("users").doc(req.body.user).update({
			teams: fb.admin.firestore.FieldValue.arrayUnion(req.params.team)
		})
	}
	catch(err) { return res.status(500).json({error: "Failed to join team"}); }

	return res.status(200).json({message: "Member added"});
});

/* Endpoint for deleting a member from a team */

router.delete("/:team/user", async (req, res) => {
	// Make sure all required fields are present
	if(!req.body.token)
		return res.status(400).json({error: "Missing required data"});

    // verify token and authority
    let user = await fb.verifyUser(req.body.token);
    if(!user || user.uid != req.body.user)
        return res.status(401).json({error: "Unauthorized"});

	// Check if user is part of the team
	let doc = await fb.db.doc(`users/${req.body.user}`).get()
	if (!doc.data().teams.includes(req.params.team))
		return res.status(400).json({error: "User is not part of the team"});

	// Check if user is a admin of the team
	let team = await fb.db.doc(`teams/${req.params.team}`).get()
	if (team.data().members[user.uid].role == "admin")
		return res.status(400).json({error: "Admin cannot leave team"});
	
	// Remove user from team
	try
	{
		fb.db.doc(`teams/${req.params.team}`).update({
			[`members.${req.body.user}`]: fb.admin.firestore.FieldValue.delete()
		})

		// Remove team from user's teams list
		fb.db.collection("users").doc(req.body.user).update({
			teams: fb.admin.firestore.FieldValue.arrayRemove(req.params.team)
		})
	}
	catch(err) { return res.status(500).json({error: "Failed to leave team"}); }

	return res.status(200).json({message: "Member removed"});
});

/************************************************************/
/*                   Channel CRUD operations                */
/************************************************************/

/* Endpoint for creating a new channel */
router.post("/channel", async (req, res) => {
    const {token, teamID, channelName} = req.body;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!channelName) {
        return res.status(400).json({code:400, error: "Missing channel name"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");
    let channelsRef = db.collection("channels");

    // get team data
    let query = await teamsRef.doc(teamID).get();
    if(!query.exists){
        return res.status(400).json({code:400, error: "Team does not exist"});
    }

    let teamData = query.data();

    // check if user is a administator of the team
    if(teamData.members[user.uid].role != "administator"){
        return res.status(400).json({code:400, error: "User is not a administator of the team"});
    }

    // check if channel name is already taken
    if(teamData.channels[channelName]){
        return res.status(400).json({code:400, error: "Channel name already taken"});
    }

    // create channel
    let channelRef = channelsRef.doc();
    let channelID = channelRef.id;

    let channelData = {
        channelName: channelName,
        channelID: channelID,
        teamID: teamID,
        message: []
    }

    let creation = await channelRef.set(channelData);
    if(!creation){
        return res.status(400).json({code:400, error: "Channel creation failed"});
    }

    // add channel to team
    teamData.channels[channelName] = {
        channelName: channelName,
        channelID: channelID
    }

    let update = await teamsRef.doc(teamID).update(teamData);

    if(!update){
        return res.status(400).json({code:400, error: "Channel addition failed"});
    }

    return res.status(200).json({code:200, message: "Channel created", channelID: channelID});

});

/* Endpoint for getting a channel's data */
router.get("/channel", async (req, res) => {
    const {token, teamID, channelID} = req.query;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!channelID) {
        return res.status(400).json({code:400, error: "Missing channel ID"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");
    let channelsRef = db.collection("channels");

    // get team data
    let query = await teamsRef.doc(teamID).get();
    if(!query.exists){
        return res.status(400).json({code:400, error: "Team does not exist"});
    }

    let teamData = query.data();

    // check if user is a member of the team
    if(!teamData.members[user.uid]){
        return res.status(400).json({code:400, error: "User is not a member of the team"});
    }

    // get channel data
    let channelQuery = await channelsRef.doc(channelID).get();
    if(!channelQuery.exists){
        return res.status(400).json({code:400, error: "Channel does not exist"});
    }

    let channelData = channelQuery.data();

    if(channelData.teamID != teamID){
        return res.status(400).json({code:400, error: "Unauthorized access"});
    }

    return res.status(200).json({code:200, data: channelData});
});

/* Endpoint for updating a channel's data */
router.put("/channel", async (req, res) => {

    const {token, teamID, channelID, channelName} = req.body;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!channelID) {
        return res.status(400).json({code:400, error: "Missing channel ID"});
    }

    if(!channelName) {
        return res.status(400).json({code:400, error: "Missing channel name"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");
    let channelsRef = db.collection("channels");

    // get team data
    let query = await teamsRef.doc(teamID).get();
    if(!query.exists){
        return res.status(400).json({code:400, error: "Team does not exist"});
    }

    let teamData = query.data();

    // check if user is a administator of the team
    if(teamData.members[user.uid].role != "administator"){
        return res.status(400).json({code:400, error: "User is not a administator of the team"});
    }

    // check if channel name is already taken
    if(teamData.channels[channelName]){
        return res.status(400).json({code:400, error: "Channel name already taken"});
    }

    // get channel data
    let channelQuery = await channelsRef.doc(channelID).get();
    if(!channelQuery.exists){
        return res.status(400).json({code:400, error: "Channel does not exist"});
    }

    let channelData = channelQuery.data();

    if(channelData.teamID != teamID){
        return res.status(400).json({code:400, error: "Unauthorized access"});
    }

    //update Info in team by deleting the existing channel and adding the updated one
    delete teamData.channels[channelData.channelName];

    let updateTeam = await teamsRef.doc(teamID).update(teamData);

    if(!updateTeam){
        return res.status(400).json({code:400, error: "Channel update failed"});
    }

    // add channel to team
    teamData.channels[channelName] = {
        channelName: channelName,
        channelID: channelID
    }

    let updateTeamChannel = await teamsRef.doc(teamID).update(teamData);

    if(!updateTeamChannel){
        return res.status(400).json({code:400, error: "Channel addition failed"});
    }

    // update channel data
    channelData.channelName = channelName;

    let update = await channelsRef.doc(channelID).update(channelData);
    if(!update){
        return res.status(400).json({code:400, error: "Channel update failed"});
    }

    return res.status(200).json({code:200, message: "Channel updated"});

});

/* Endpoint for deleting a channel */
router.delete("/channel", async (req, res) => {

    const {token, teamID, channelID} = req.body;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!channelID) {
        return res.status(400).json({code:400, error: "Missing channel ID"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");
    let channelsRef = db.collection("channels");

    // get team data
    let query = await teamsRef.doc(teamID).get();
    if(!query.exists){
        return res.status(400).json({code:400, error: "Team does not exist"});
    }

    let teamData = query.data();

    // check if user is a administator of the team
    if(teamData.members[user.uid].role != "administator"){
        return res.status(400).json({code:400, error: "User is not a administator of the team"});
    }

    // get channel data
    let channelQuery = await channelsRef.doc(channelID).get();

    if(!channelQuery.exists){
        return res.status(400).json({code:400, error: "Channel does not exist"});
    }

    let channelData = channelQuery.data();

    if(channelData.teamID != teamID){
        return res.status(400).json({code:400, error: "Unauthorized access"});
    }

    // delete channel
    let deletion = await channelsRef.doc(channelID).delete();

    if(!deletion){
        return res.status(400).json({code:400, error: "Channel deletion failed"});
    }

    // delete channel from team
    delete teamData.channels[channelData.channelName];

    let update = await teamsRef.doc(teamID).update(teamData);

    if(!update){

        return res.status(400).json({code:400, error: "Channel deletion failed"});

    }

    return res.status(200).json({code:200, message: "Channel deleted"});

});

module.exports = router;