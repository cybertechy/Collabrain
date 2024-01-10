const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");
const storage = require("../helpers/oracle.js");
const uuid = require("uuid");


/************************************************************/
/*                   Teams CRUD Operations                 */
/************************************************************/

/* Endpoint for creating a new team */

router.post("/team", async (req, res) => {

    const auth = req.headers.authorization;

    const {teamName, teamImage, MIMEtype, Visibility} = req.body;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

    if(!token) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    if(!teamName) {
        return res.status(400).json({code:400, error: "Missing team name"});
    }

    // check if team image and MIME type are both present
    if(teamImage && !MIMEtype) {
        return res.status(400).json({code:400, error: "Missing MIME type"});
    }

    if(!teamImage && MIMEtype) {
        return res.status(400).json({code:400, error: "Missing team image"});
    }

    if(Visibility && Visibility != "public" && Visibility != "private") {
        return res.status(400).json({code:400, error: "Invalid visibility"});
    }

    if(!Visibility) {
        Visibility = "public";
    }

    // verfiy token
    let user = await fb.verifyUser(token);
    if(!user){
        return res.status(400).json({code:400, error: "Invalid token"});
    }

    // get user data
    let uid = user.uid;
    let fname = user.name.split(" ")[0];
    let lname = user.name.split(" ")[1];
    let email = user.email;

    //generate a unique ImageID uuid
    let ImageID = uuid.v4();

    // upload the image to oracle if it exists
    if(teamImage && MIMEtype){
        let imageID = await storage.AddData("B2",ImageID,MIMEtype,teamImage,null)
        if(!imageID){
            return res.status(400).json({code:400, error: "Image upload failed"});
        }
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");
    let channelsRef = db.collection("channels");

    // check if team name is already taken
    let query = await teamsRef.where("teamName", "==", teamName).get();
    if(!query.empty){

        //delete the image from oracle if it exists
        if(teamImage && MIMEtype){
            let deletion = await storage.DeleteData("B2",ImageID);
            if(!deletion){
                return res.status(400).json({code:400, error: "Image deletion failed"});
            }
        }

        return res.status(400).json({code:400, error: "Team name already taken"});
    }
    
    

    // add team to database
    let teamRef = teamsRef.doc();
    let teamID = teamRef.id;

    //create a general channel for the team
    let channelRef = channelsRef.doc();
    let channelID = channelRef.id;
    let channelData = {
        channelName: "General",
        channelID: channelID,
        teamID: teamID,
        message: []
    }
    let channelCreation = await channelRef.set(channelData);

    if(!channelCreation){

        //delete the image from oracle if it exists
        if(teamImage && MIMEtype){
            let deletion = await storage.DeleteData("B2",ImageID);
            if(!deletion){
                return res.status(400).json({code:400, error: "Image deletion failed"});
            }
        }

        return res.status(400).json({code:400, error: "Channel creation failed"});
    }

    // create team data
    let teamData = {
        teamName: teamName,
        teamImageID: (teamImage && MIMEtype) ? ImageID : null,
        MIMEtype: (teamImage && MIMEtype) ? MIMEtype : null,
        teamID: teamID,
        owner: { uid: uid, fname: fname, lname: lname },
        members: { [uid]: {
            fname: fname,
            lname: lname,
            role: "administator",
            status: "active",
            email: email
        } },
        channels: { [channelData.channelName]: {
            channelName: channelData.channelName,
            channelID: channelData.channelID
        } },
        Visibility: Visibility,
        creationDate: Date.now(),
        lastUpdated: Date.now(),
        Score: 0
    }
    

    let creation = await teamRef.set(teamData);
    if(!creation){

        //delete the image from oracle if it exists
        if(teamImage && MIMEtype){
            let deletion = await storage.DeleteData("B2",ImageID);
            if(!deletion){
                return res.status(400).json({code:400, error: "Image deletion failed"});
            }
        }

        return res.status(400).json({code:400, error: "Team creation failed"});
    }

    //create collection associated with the team for channels
    let collectionCreation = await db.collection(teamID).doc("channels").set({});
    if(!collectionCreation){
            
            //delete the image from oracle if it exists
            if(teamImage && MIMEtype){
                let deletion = await storage.DeleteData("B2",ImageID);
                if(!deletion){
                    return res.status(400).json({code:400, error: "Image deletion failed"});
                }
            }
    
            return res.status(400).json({code:400, error: "Team creation failed"});
    }

    return res.status(200).json({code:200, message: "Team created", teamID: teamID});
    
    
});

/* Endpoint for getting a team's data */

router.get("/team", async (req, res) => {
    
        const {teamID} = req.query;

        const headers = req.headers.authorization;  

        if(!headers) {
            return res.status(400).json({code:400, error: "Missing token"});
        }

        const token = headers.split(" ")[1];
    
        if(!token) {
            return res.status(400).json({code:400, error: "Missing token"});
        }
    
        if(!teamID) {
            return res.status(400).json({code:400, error: "Missing team ID"});
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

        return res.status(200).json({code:200, data: teamData});
    
    });




/* Endpoint for updating a team's data */

router.put("/team", async (req, res) => {
    
        const { teamID, teamName, teamImage, MIMEtype, Visibility, Score} = req.body;
        const auth = req.headers.authorization;

        if(!auth) {
            return res.status(400).json({code:400, error: "Missing token"});
        }

        const token = auth.split(" ")[1];
    
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
        let BackupTeamData = teamData;

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
            } else {
                teamData.teamName = BackupTeamData.teamName;
            }

        }

        if(teamImage && MIMEtype){
            teamData.teamImageID = uuid.v4();
            teamData.MIMEtype = MIMEtype;

            // upload the image to oracle
            let imageID = await storage.AddData("B2",teamData.teamImageID,MIMEtype,teamImage,null)

            if(!imageID){
                return res.status(400).json({code:400, error: "Image upload failed"});
            } else {
                teamData.teamImageID = BackupTeamData.teamImageID;
                teamData.MIMEtype = BackupTeamData.MIMEtype;
            }
        }

        if(Visibility){
            teamData.Visibility = Visibility;
        }

        if(Score){
            teamData.Score = Score;
        }

        teamData.lastUpdated = Date.now();

        let update = await teamsRef.doc(teamID).update(teamData);
        if(!update){
            return res.status(400).json({code:400, error: "Team update failed"});
        }

        return res.status(200).json({code:200, message: "Team updated"});
    
    });

/* Endpoint for deleting a team */

router.delete("/team", async (req, res) => {
    
        const { teamID} = req.body;
        const auth = req.headers.authorization;

        if(!auth) {
            return res.status(400).json({code:400, error: "Missing token"});
        }

        const token = auth.split(" ")[1];
    
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
    
    const { teamID, memberID, role, fName,lName,email} = req.body;
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

    teamData.lastUpdated = Date.now();

    let update = await teamsRef.doc(teamID).update(teamData);
    if(!update){
        return res.status(400).json({code:400, error: "Member addition failed"});
    }

    return res.status(200).json({code:200, message: "Member added"});

});




/* Endpoint for getting a team's members */

router.get("/members", async (req, res) => {
        
            const {teamID} = req.query;
            const auth = req.headers.authorization;

            if(!auth) {
                return res.status(400).json({code:400, error: "Missing token"});
            }

            const token = auth.split(" ")[1];
        
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
        
            const {teamID, memberID, role, status} = req.body;

            const auth = req.headers.authorization;

            if(!auth) {
                return res.status(400).json({code:400, error: "Missing token"});
            }

            const token = auth.split(" ")[1];
        
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

            teamData.lastUpdated = Date.now();
    
            let update = await teamsRef.doc(teamID).update(teamData);
            if(!update){
                return res.status(400).json({code:400, error: "Member update failed"});
            }
    
            return res.status(200).json({code:200, message: "Member updated"});
        
        });


/* Endpoint for deleting a member from a team */

router.delete("/member", async (req, res) => {

    const { teamID, memberID} = req.body;

    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

    teamData.lastUpdated = Date.now();

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

    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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
    // insert only teamID, teamName, teamImageID, MIMEtype, Visibility, role of the user, and status of the user

    query.forEach(team => {
        let teamData = team.data();
        let teamMembers = teamData.members;
        let teamMember = teamMembers[user.uid];
        let teamMemberData = {
            teamID: teamData.teamID,
            teamName: teamData.teamName,
            teamImageID: teamData.teamImageID,
            MIMEtype: teamData.MIMEtype,
            Visibility: teamData.Visibility,
            role: teamMember.role,
            status: teamMember.status
        }
        teams.push(teamMemberData);
    }
    );


    return res.status(200).json({code:200, data: teams});

});

/* Get all teams that a user owns */

router.get("/owned", async (req, res) => {
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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
    // insert only teamID, teamName, teamImageID, MIMEtype, Visibility, role of the user, and status of the user

    query.forEach(team => {
        let teamData = team.data();
        let teamMembers = teamData.members;
        let teamMember = teamMembers[user.uid];
        let teamMemberData = {
            teamID: teamData.teamID,
            teamName: teamData.teamName,
            teamImageID: teamData.teamImageID,
            MIMEtype: teamData.MIMEtype,
            Visibility: teamData.Visibility,
            role: teamMember.role,
            status: teamMember.status
        }
        teams.push(teamMemberData);
    });

    return res.status(200).json({code:200, data: teams});

});

/* Get all the teams user is a administator of */

router.get("/adminof", async (req, res) => {
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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
    // insert only teamID, teamName, teamImageID, MIMEtype, Visibility, role of the user, and status of the user
    query.forEach(team => {
        let teamData = team.data();
        let teamMembers = teamData.members;
        let teamMember = teamMembers[user.uid];
        let teamMemberData = {
            teamID: teamData.teamID,
            teamName: teamData.teamName,
            teamImageID: teamData.teamImageID,
            MIMEtype: teamData.MIMEtype,
            Visibility: teamData.Visibility,
            role: teamMember.role,
            status: teamMember.status
        }
        teams.push(teamMemberData);
    });


    return res.status(200).json({code:200, data: teams});

});

/************************************************************/
/*                   Channel CRUD operations                */
/************************************************************/

/* Endpoint for creating a new channel */
router.post("/channel", async (req, res) => {
    const { teamID, channelName} = req.body;
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

    teamData.lastUpdated = Date.now();

    let update = await teamsRef.doc(teamID).update(teamData);

    if(!update){
        return res.status(400).json({code:400, error: "Channel addition failed"});
    }

    return res.status(200).json({code:200, message: "Channel created", channelID: channelID});

});

/* Endpoint for getting a channel's data */
router.get("/channel", async (req, res) => {
    const { teamID, channelID} = req.query;

    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

    const { teamID, channelID, channelName} = req.body;

    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

     // get channel data
     let channelQuery = await channelsRef.doc(channelID).get();
     if(!channelQuery.exists){
         return res.status(400).json({code:400, error: "Channel does not exist"});
     }

    // check if channel name is already taken
    if(teamData.channels[channelName]){
        return res.status(400).json({code:400, error: "Channel name already taken"});
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

    teamData.lastUpdated = Date.now();

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

    const { teamID, channelID} = req.body;

    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).json({code:400, error: "Missing token"});
    }

    const token = auth.split(" ")[1];

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

    teamData.lastUpdated = Date.now();

    let update = await teamsRef.doc(teamID).update(teamData);

    if(!update){

        return res.status(400).json({code:400, error: "Channel deletion failed"});

    }

    return res.status(200).json({code:200, message: "Channel deleted"});

});

/************************************************************/
/*                     General operations                   */
/************************************************************/

/* Endpoint for getting all teams using index and no.of teams, also toggle of sort, to sort by Score of team */

router.get("/", async (req, res) => {
    
        let { index, noOfTeams, sort} = req.query;
        const auth = req.headers.authorization;

        if(!auth) {
            return res.status(400).json({code:400, error: "Missing token"});
        }

        const token = auth.split(" ")[1];
    
        if(!token) {
            return res.status(400).json({code:400, error: "Missing token"});
        }
    
        if(!index) {
            return res.status(400).json({code:400, error: "Missing index"});
        }
    
        if(!noOfTeams) {
            return res.status(400).json({code:400, error: "Missing no.of teams"});
        }
    
        if(!sort) {
            sort = "false";
        }
    
        // verify token
        let user = await fb.verifyUser(token);
    
        if(!user){
            return res.status(400).json({code:400, error: "Invalid token"});
        }
    
        // get database references
        let db = fb.admin.firestore();
    
        let teamsRef = db.collection("teams");
    
        // get all teams
        let query = null;

        //Get only public teams
        if(sort==="true"){
            query = await teamsRef.where("Visibility","==","Public").orderBy("Score","desc").offset(parseInt(index)).limit(parseInt(noOfTeams)).get();
        }else{
            query = await teamsRef.offset(parseInt(index)).limit(parseInt(noOfTeams)).get();
        }
    
        if(query.empty){
            return res.status(400).json({code:400, error: "No teams found"});
        }
    
        let teams = [];
        query.forEach(team => {
            teams.push(team.data());
        });

        // Show only public teams, and only its name, image and score
        teams = teams.filter(team => team.Visibility === "public");

        teams = teams.map(team => {
            return {
                teamName: team.teamName,
                teamImageID: team.teamImageID,
                MIMEtype: team.MIMEtype,
                Score: team.Score,
                teamID: team.teamID
            }
        });
    
        return res.status(200).json({code:200, data: teams});
    
    });






module.exports = router;