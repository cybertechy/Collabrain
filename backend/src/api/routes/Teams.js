const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");
const storage = require("../helpers/oracle.js");

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

    // upload the image to oracle if it exists
    if(teamImage && MIMEtype){
        let imageID = await storage.AddData("B2",teamName,MIMEtype,teamImage,null)
        if(!imageID){
            return res.status(400).json({code:400, error: "Image upload failed"});
        }
    }

    // get database references
    let db = fb.admin.firestore();
    let teamsRef = db.collection("teams");

    // check if team name is already taken
    let query = await teamsRef.where("teamName", "==", teamName).get();
    if(!query.empty){
        return res.status(400).json({code:400, error: "Team name already taken"});
    }

    // add team to database
    let teamRef = teamsRef.doc();
    let teamID = teamRef.id;
    let teamData = {
        teamName: teamName,
        teamImageID: (teamImage && MIMEtype) ? teamName : null,
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
        channels: ["General"],
        Visibility: "public"
    }

    let creation = await teamRef.set(teamData);
    if(!creation){
        return res.status(400).json({code:400, error: "Team creation failed"});
    }

    return res.status(200).json({code:200, message: "Team created"});
    
    
});

module.exports = router;