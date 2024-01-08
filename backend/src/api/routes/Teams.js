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

    const { token, name, image } = req.body;

    // verfiy token
    let user = await fb.verifyUser(token);
    if(!user)
        return res.status(401).json({error: "Unauthorized"});

	// Get user id to set them as the owner
	let uid = user.uid;

	// ----------

    //generate a unique ImageID uuid
    let ImageID = uuid.v4();

    // upload the image to oracle if it exists
    if(teamImage && MIMEtype){
        let imageID = await storage.addData("B2",ImageID,MIMEtype,teamImage,null)
        if(!imageID){
            return res.status(400).json({code:400, error: "Image upload failed"});
        }
    }

	// ----------

	// Team data
	let data = {
		name: name,
		teamImageID: (teamImage && MIMEtype) ? ImageID : null,
		MIMEtype: (teamImage && MIMEtype) ? MIMEtype : null,
		owner: uid,
		members : { [uid]: {
			role: "administator",
		} },
		Visibility: "public"
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
    
	// verfiy token
	let user = await fb.verifyUser(token);
	if(!user)
		return res.status(401).json({error: "Unauthorized"});

	fb.db.doc(`teams/${req.params.team}`).get()
		.then(doc => {
			return res.status(200).json(doc.data());
		})
		.catch(err => { return res.status(400).json({error: "Team not found"}); });
});


/* Endpoint for updating a team's data */

router.put("/:team", async (req, res) => {
    
        const {token, teamID, teamName, teamImage, MIMEtype, Visibility} = req.body;
    
        if(!token) {
            return res.status(400).json({code:400, error: "Missing token"});
        }
    
        if(!teamID) {
            return res.status(400).json({code:400, error: "Missing team ID"});
        }

        if(!teamName && !teamImage && !MIMEtype && !Visibility) {
            return res.status(400).json({code:400, error: "Missing update data"});
        }
    
        // verify token
        let user = await fb.verifyUser(token);
        if(!user){
            return res.status(400).json({code:400, error: "Invalid token"});
        }
    
        // get database references
        let db = fb.admin.firestore();
        let teamsRef = db.collection("teams");
    
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

        // update team data
        if(teamName){
            teamData.teamName = teamName;

            // check if team name is already taken
            let query = await teamsRef.where("teamName", "==", teamName).get();
            if(!query.empty){
                return res.status(400).json({code:400, error: "Team name already taken"});
            }

        }

        if(teamImage && MIMEtype){
            teamData.teamImageID = uuid.v4();
            teamData.MIMEtype = MIMEtype;

            // upload the image to oracle
            let imageID = await storage.AddData("B2",teamData.teamImageID,MIMEtype,teamImage,null)

            if(!imageID){
                return res.status(400).json({code:400, error: "Image upload failed"});
            }
        }

        if(Visibility){
            teamData.Visibility = Visibility;
        }

        let update = await teamsRef.doc(teamID).update(teamData);
        if(!update){
            return res.status(400).json({code:400, error: "Team update failed"});
        }

        return res.status(200).json({code:200, message: "Team updated"});
    
    });

/* Endpoint for deleting a team */

router.delete("/team", async (req, res) => {
    
        const {token, teamID} = req.body;
    
        if(!token) {
            return res.status(400).json({code:400, error: "Missing token"});
        }
    
        if(!teamID) {
            return res.status(400).json({code:400, error: "Missing team ID"});
        }
    
        // verfiy token
        let user = await fb.verifyUser(token);
        if(!user){
            return res.status(400).json({code:400, error: "Invalid token"});
        }
    
        // get database references
        let db = fb.admin.firestore();
        let teamsRef = db.collection("teams");
    
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

        // delete team
        let deletion = await teamsRef.doc(teamID).delete();
        if(!deletion){
            return res.status(400).json({code:400, error: "Team deletion failed"});
        }

        return res.status(200).json({code:200, message: "Team deleted"});
    
    });


/************************************************************/
/*                   Members CRUD Operations                */
/************************************************************/


/* Endpoint for adding a member to a team*/

router.post("/member", async (req, res) => {
    
    const {token, teamID, memberID, role, fName,lName,email} = req.body;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!memberID) {
        return res.status(400).json({code:400, error: "Missing member ID"});
    }

    if(!role) {
        return res.status(400).json({code:400, error: "Missing role"});
    }

    if(!fName) {
        return res.status(400).json({code:400, error: "Missing first name"});
    }

    if(!lName) {
        return res.status(400).json({code:400, error: "Missing last name"});
    }

    if(!email) {
        return res.status(400).json({code:400, error: "Missing email"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

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

    // check if member is already a member of the team
    if(teamData.members[memberID]){
        return res.status(400).json({code:400, error: "User is already a member of the team"});
    }

    // add member to team
    teamData.members[memberID] = {
        fname: fName,
        lname: lName,
        role: role,
        status: "active",
        email: email
    }

    let update = await teamsRef.doc(teamID).update(teamData);
    if(!update){
        return res.status(400).json({code:400, error: "Member addition failed"});
    }

    return res.status(200).json({code:200, message: "Member added"});

});


/* Endpoint for getting a team's members */

router.get("/members", async (req, res) => {
        
            const {token, teamID} = req.query;
        
            if(!token) {
                return res.status(400).json({code:400, error: "Missing token"});
            }
        
            if(!teamID) {
                return res.status(400).json({code:400, error: "Missing team ID"});
            }
        
            // verfiy token
            let user = await fb.verifyUser(token);
            if(!user){
                return res.status(400).json({code:400, error: "Invalid token"});
            }
        
            // get database references
            let db = fb.admin.firestore();
            let teamsRef = db.collection("teams");
        
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
    
            // get team members
            let members = [];
            for(let member in teamData.members){
                members.push(teamData.members[member]);
            }
    
            return res.status(200).json({code:200, data: members});
        
        });

/*

Endpoint for updating a member's data

Updates: Role or Status of the user

*/

router.put("/member", async (req, res) => {
        
            const {token, teamID, memberID, role, status} = req.body;
        
            if(!token) {
                return res.status(400).json({code:400, error: "Missing token"});
            }
        
            if(!teamID) {
                return res.status(400).json({code:400, error: "Missing team ID"});
            }
    
            if(!memberID) {
                return res.status(400).json({code:400, error: "Missing member ID"});
            }
    
            if(!role && !status) {
                return res.status(400).json({code:400, error: "Missing update data"});
            }
        
            // verify token
            let user = await fb.verifyUser(token);
            if(!user){
                return res.status(400).json({code:400, error: "Invalid token"});
            }
        
            // get database references
            let db = fb.admin.firestore();
            let teamsRef = db.collection("teams");
        
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
    
            // check if member is a member of the team
            if(!teamData.members[memberID]){
                return res.status(400).json({code:400, error: "User is not a member of the team"});
            }
    
            // update member data
            if(role){
                teamData.members[memberID].role = role;
            }
    
            if(status){
                teamData.members[memberID].status = status;
            }
    
            let update = await teamsRef.doc(teamID).update(teamData);
            if(!update){
                return res.status(400).json({code:400, error: "Member update failed"});
            }
    
            return res.status(200).json({code:200, message: "Member updated"});
        
        });


/* Endpoint for deleting a member from a team */

router.delete("/member", async (req, res) => {

    const {token, teamID, memberID} = req.body;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamID) {
        return res.status(400).json({code:400, error: "Missing team ID"});
    }

    if(!memberID) {
        return res.status(400).json({code:400, error: "Missing member ID"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

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

    // check if member is a member of the team
    if(!teamData.members[memberID]){
        return res.status(400).json({code:400, error: "User is not a member of the team"});
    }

    // delete member from team
    delete teamData.members[memberID];

    let update = await teamsRef.doc(teamID).update(teamData);
    if(!update){
        return res.status(400).json({code:400, error: "Member deletion failed"});
    }

    return res.status(200).json({code:200, message: "Member deleted"});

});


/************************************************************/
/*                   Users associated teams                 */
/************************************************************/


/* Get all teams that a user is a member of */

router.get("/memberof", async (req, res) => {
    const {token} = req.query;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

    // get all teams that the user is a member of
    let query = await teamsRef.where(`members.${user.uid}.status`, "==", "active").get();
    if(query.empty){
        return res.status(400).json({code:400, error: "User is not a member of any teams"});
    }

    let teams = [];
    query.forEach(team => {
        teams.push(team.data());
    });

    return res.status(200).json({code:200, data: teams});

});

/* Get all teams that a user owns */

router.get("/owned", async (req, res) => {
    const {token} = req.query;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

    // get all teams that the user owns
    let query = await teamsRef.where("owner.uid", "==", user.uid).get();
    if(query.empty){
        return res.status(400).json({code:400, error: "User does not own any teams"});
    }

    let teams = [];
    query.forEach(team => {
        teams.push(team.data());
    });

    return res.status(200).json({code:200, data: teams});

});

/* Get all the teams user is a administator of */

router.get("/adminof", async (req, res) => {
    const {token} = req.query;

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    // verify token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

    // get all teams that the user owns
    let query = await teamsRef.where(`members.${user.uid}.role`, "==", "administator").get();
    if(query.empty){
        return res.status(400).json({code:400, error: "User is not a administator of any teams"});
    }

    let teams = [];
    query.forEach(team => {
        teams.push(team.data());
    });

    return res.status(200).json({code:200, data: teams});

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

module.exports = {
	router
};