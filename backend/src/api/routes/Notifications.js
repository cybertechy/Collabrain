const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase.js");

// create a new notification
router.post("/:user", async (req, res) => {
    if(!req.headers.authorization ||!req.body.message || !req.body.timestamp){
        return res.status(400).json({message:"Missing fields"});
    }

    //verify user
    let auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    if(!token) return res.status(401).json({message:"Unauthorised Request"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({message:"Unauthorised Request"});

   //get user profile
   let userRef = fb.admin.firestore().collection("users").doc(req.params.user);
   let userProfile = await userRef.get();
    if(!userProfile.exists) return res.status(404).json({message:"Profile not found"});


    //create notification
    let notification = {
        message: req.body.message,
        timestamp: req.body.timestamp,
        meta: (req.body.meta) ? req.body.meta : null
    }

    //add to notifications collection
    let notificationRef = userRef.collection("notifications");
    let status = await notificationRef.add(notification);
    if(!status) return res.status(500).json({message:"Error creating notification"});

    return res.json(notification);
})

// delete a notification
router.delete("/:id", async (req, res) => {
    if(!req.headers.authorization){
        return res.status(400).json({message:"Missing fields"});
    }

    //verify user
    let auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    if(!token) return res.status(401).json({message:"Unauthorised Request"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({message:"Unauthorised Request"});

    //delete notification
    let notificationRef = fb.db.doc(`users/${user.uid}/notifications/${req.params.id}`);
    await notificationRef.delete();

    return res.json({message:"Notification deleted"});
})

// get all notifications
router.get("/", async (req, res) => {
    if(!req.headers.authorization){
        return res.status(400).json({message:"Missing fields"});
    }

    //verify user
    let auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    if(!token) return res.status(401).json({message:"Unauthorised Request"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({message:"Unauthorised Request"});

    //get notifications
    let notificationsRef = fb.admin.firestore().collection(`users/${user.uid}/notifications`);
    let notifications = await notificationsRef.get();

    let notificationsList = [];
    notifications.forEach(notification => {
        let data = notification.data();
        // add id to data
        data.id = notification.id;
        notificationsList.push(data);
    });

    return res.json(notificationsList);
});


module.exports = router;