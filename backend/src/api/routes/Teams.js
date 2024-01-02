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

    const {token, teamName, teamImage, MIMEtype} = req.body;

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
        channels: { [channelID]: "General" },
        Visibility: "public"
    }

    let creation = await teamRef.set(teamData);
    if(!creation){
        return res.status(400).json({code:400, error: "Team creation failed"});
    }

    return res.status(200).json({code:200, message: "Team created", teamID: teamID});
    
    
});

/* Endpoint for getting a team's data */

router.get("/team", async (req, res) => {
    
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

        return res.status(200).json({code:200, data: teamData});
    
    });




/* Endpoint for updating a team's data */

router.put("/team", async (req, res) => {
    
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



module.exports = router;