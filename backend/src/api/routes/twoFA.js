const router = require('express').Router();
const fb = require("../helpers/firebase");
const sendMail = require("../helpers/mailer");

router.patch('/enable', async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({error: "Unauthorized"});

    let token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({error: "Unauthorized"});

    // update user doc with twoFA enabled
    await fb.db.collection("users").doc(user.uid).update({twoFA: true});

    return res.status(200).json({message: "Two-factor authentication enabled"});
});

router.patch('/disable', async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({error: "Unauthorized"});

    let token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({error: "Unauthorized"});

    // update user doc with twoFA disabled
    await fb.db.collection("users").doc(user.uid).update({twoFA: false});

    return res.status(200).json({message: "Two-factor authentication disabled"});
});

router.get('/status', async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({error: "Unauthorized"});

    let token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({error: "Unauthorized"});

    // get user doc
    let doc = await fb.db.collection("users").doc(user.uid).get();
    let data = doc.data();

    return res.status(200).json({twoFA: data.twoFA});
});

router.post("/sendCode", async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({error: "Unauthorized"});
    
    let token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({error: "Unauthorized"});

    // check if twoFA is enabled
    let doc = await fb.db.collection("users").doc(user.uid).get();
    let data = doc.data();
    if(!data.twoFA) return res.status(400).json({error: "Two-factor authentication is not enabled"});

    // send code to user's email
    // generate code
    let code = Math.floor(100000 + Math.random() * 900000);

    // send code to user's email
    let msg = `Your two-factor authentication code is: ${code}`;
    let mail_confirmation = await sendMail(user.email, "Two-factor authentication code", msg);
    console.log(mail_confirmation);

    // save code to user's doc
    await fb.db.collection("users").doc(user.uid).update({twoFACode: code});

    return res.status(200).json({message: "Code sent"});
});

router.post("/verifyCode", async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({error: "Unauthorized"});
    if (!req.body.code) return res.status(400).json({error: "Invalid code"});
    
    let token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    let user = await fb.verifyUser(token);
    if(!user) return res.status(401).json({error: "Unauthorized"});

    // verify code
    let doc = await fb.db.collection("users").doc(user.uid).get();
    let data = doc.data();
    if(data?.twoFACode !== req.body.code) return res.status(400).json({error: "Invalid code"});

    // delete code from user's doc
    await fb.db.collection("users").doc(user.uid).update({twoFACode: null});

    return res.status(200).json({message: "Code verified"});
});
    

module.exports = router;
