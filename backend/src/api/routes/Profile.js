const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");


router.get("/",async (req, res) => {

    let auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    if(!token) return res.status(401).json({message:"Unauthorised Request"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({message:"Unauthorised Request"});

    console.log(user);

    let firestore = fb.admin.firestore();
    let profile = await firestore.collection("users").doc(user.uid).get();

    if(!profile.exists) return res.status(404).json({message:"Profile not found"});

    let data = profile.data();

    return res.json(data);
});


router.put("/",async (req, res) => {

    let auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    if(!token) return res.status(401).json({message:"Unauthorised Request"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({message:"Unauthorised Request"});

    const {
        fname,
        lname,
        email,
        uid,
        twoFA,
        TTS,
        theme,
        blocked,
        ReplaceBlocked = false,
        friends,
        RepaceFriends = false,
        teams,
        ReplaceTeams = false,
        fontSize,
        colorBlindFilter,
        language,
        bio
    } = req.body;

    let firestore = fb.admin.firestore();
    let profile = await firestore.collection("users").doc(user.uid).get();

    if(!profile.exists) return res.status(404).json({message:"Profile not found"});

    let data = profile.data();

    if(fname && typeof(fname)==="string") data.fname = fname;
    if(lname && typeof(lname)==="string") data.lname = lname;

    if(email && typeof(email)==="string") data.email = email;
    if(uid && typeof(uid)==="string") data.uid = uid;

    if(twoFA!==null) data.twoFA = Boolean(twoFA);
    if(TTS) data.TTS = TTS;

    if(theme && typeof(theme)==="string" ) data.theme = theme;

    //ensure blocked, friends and teams do exist

    if(blocked) {
        let blockedUser = await firestore.collection("users").doc(blocked).get();
        if(!blockedUser.exists) return res.status(404).json({message:"Blocked user not found"});

        if(ReplaceBlocked) data.blocked = blocked;
        else data.blocked.push(blocked);
    }

    if(friends) {
        let friendUser = await firestore.collection("users").doc(friends).get();
        if(!friendUser.exists) return res.status(404).json({message:"Friend user not found"});

        if(RepaceFriends) data.friends = friends;
        else data.friends.push(friends);
    }

    if(teams) {
        let team = await firestore.collection("teams").doc(teams).get();
        if(!team.exists) return res.status(404).json({message:"Team not found"});

        if(ReplaceTeams) data.teams = teams;
        else data.teams.push(teams);
    }

    if(fontSize && typeof(fontSize)==="string" ) data.fontSize = fontSize;
    if(colorBlindFilter ) data.colorBlindFilter = colorBlindFilter;

    if(language && typeof(language)==="string") data.language = language;

    if(bio && typeof(bio)==="string") data.bio = bio;

    data.lastUpdated = new Date().toISOString();

    await firestore.collection("users").doc(user.uid).set(data);

    return res.json(data);

});

router.delete("/",async (req, res) => {
    
        let auth = req.headers.authorization;
        let token = auth.split(" ")[1];
    
        if(!token) return res.status(401).json({message:"Unauthorised Request"});
    
        let user = await fb.verifyUser(token);
        if(!user) return res.status(401).json({message:"Unauthorised Request"});
    
        let firestore = fb.admin.firestore();
        let profile = await firestore.collection("users").doc(user.uid).get();
    
        if(!profile.exists) return res.status(404).json({message:"Profile not found"});
    
        await firestore.collection("users").doc(user.uid).delete();
    
        return res.json({message:"Profile deleted"});
    
    });


    






module.exports = router;