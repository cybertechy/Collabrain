const { Router } = require('express');
const { verifyUser } = require("../helpers/firebase");
const fb = require("../helpers/firebase");


const router = Router();


/* Create a Ne content map */
router.post("/", async (req, res) =>
{
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];

    const { name, data } = req.body;

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: "AM101", error: "Missing token" });
    }

    // Check if the request has the required data
    if ( !name )
    {
        return res.status(400).json({ code: "AM104", error: "Missing name of the content map" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: "AM102", error: "Invalid token" });
    }

    // create a new content map as collection inside user's doc
    console.log(user)

    const contentMap = {
        name: name,
        data: data ? JSON.stringify(data):"",
        createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: fb.admin.firestore.FieldValue.serverTimestamp(),
        Access: {[user.uid]: {role:"owner",email:user.email, name:user.name}}
    }

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    const doc = await userRef.get();
    if (!doc.exists)
    {
        return res.status(404).json({ code: "AM107", error: "User not found" });
    }

    const contentMapsRef = userRef.collection("contentMaps");

    const contentMapRef = await contentMapsRef.add(contentMap);
    const contentMapId = contentMapRef.id;

    return res.status(200).json({ id: contentMapId });

});


/* Get all content maps of a user */
router.get("/", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: "AM101", error: "Missing token" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: "AM102", error: "Invalid token" });
    }

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    const doc = await userRef.get();
    if (!doc.exists)
    {
        return res.status(404).json({ code: "AM107", error: "User not found" });
    }

    const contentMapsRef = userRef.collection("contentMaps");
    const contentMaps = await contentMapsRef.get();

    // Return an array of objects containing Id of content map and name of content map
    const contentMapsData = contentMaps.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

    return res.status(200).json(contentMapsData);

});



router.get("/:user/:id", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    const id = req.params.id;
    const ResourceUser = req.params.user;

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: "AM101", error: "Missing token" });
    }

    if(!ResourceUser)
    {
        return res.status(400).json({ code: "AM101", error: "Missing user" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: "AM102", error: "Invalid token" });
    }

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(ResourceUser);

    const doc = await userRef.get();
    if (!doc.exists)
    {
        return res.status(404).json({ code: "AM107", error: "User not found" });
    }

    const contentMapsRef = userRef.collection("contentMaps");
    const contentMapRef = contentMapsRef.doc(id);

    const contentMap = await contentMapRef.get();

    if (!contentMap.exists)
    {
        return res.status(404).json({ code: "AM108", error: "Content map not found" });
    }

    const contentMapData = contentMap.data();

    //check if user has access to the content map
    if(!contentMapData.Access[user.uid]){
        return res.status(403).json({ code: "AM109", error: "User does not have access to the content map" });
    }
    

    return res.status(200).json({...contentMapData,userAccess:contentMapData.Access[user.uid]?.role});
});

// untested
router.put("/:user/:id", async (req, res) => {

    const auth = req.headers.authorization;
    let resourceUser = req.params.user;
    const token = auth?.split(' ')[1];
    const id = req.params.id;

    const { name, data , share , access } = req.body;

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: 400, error: "Missing token" });
    }

    if(!resourceUser)
    {
        return res.status(400).json({ code: 400, error: "Missing user" });
    }

    if(share && (share!=="view" || share!=="edit")){
        return res.status(400).json({ code: 400, error: "Wrong share value" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: 403, error: "Invalid token" });
    }

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(resourceUser);

    const doc = await userRef.get();
    if (!doc.exists)
    {
        return res.status(404).json({ code: 404, error: "User not found" });
    }

    const contentMapsRef = userRef.collection("contentMaps");
    const contentMapRef = contentMapsRef.doc(id);

    const contentMap = await contentMapRef.get();

    if (!contentMap.exists)
    {
        return res.status(404).json({ code: 404, error: "Content map not found" });
    }

    let contentMapData = contentMap.data();

    if(!contentMapData.Access[user.uid]){
        return res.status(403).json({ code: 403, error: "User does not have access to the content map" });
    }

    let userRole = contentMapData.Access[user.uid].role;
    
    let updatedContentMap = {
        ...contentMapData
    };

    if(data && (userRole==="owner"|| userRole==="edit")){
        updatedContentMap.data = JSON.stringify(data);
    }

    if(share && userRole==="owner"){
        updatedContentMap.share = share;
    }

    if(access && userRole==="owner"){
        updatedContentMap.Access = access;
    }

    if(name && userRole==="owner"){
        updatedContentMap.name = name;
    }


    //set updated content map
    await contentMapRef.set(updatedContentMap);

    return res.status(200).json({ code:200, id: id });
});

// untested
router.delete("/:id", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    const id = req.params.id;

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: 400, error: "Missing token" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: 403, error: "Invalid token" });
    }

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    const doc = await userRef.get();
    if (!doc.exists)
    {
        return res.status(404).json({ code: 404, error: "User not found" });
    }

    const contentMapsRef = userRef.collection("contentMaps");
    const contentMapRef = contentMapsRef.doc(id);

    const contentMap = await contentMapRef.get();

    if (!contentMap.exists)
    {
        return res.status(404).json({ code: 404, error: "Content map not found" });
    }

    await contentMapRef.delete();

    return res.status(200).json({ code:200, id: id });
});


/* A search API that returns similar matching users or teams */

router.get("/search", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth?.split(' ')[1];
    const query = req.query.query;

    if(!query){
        return res.status(400).json({ code: 400, error: "Missing query" });
    }

    if(query.length<3){
        return res.status(400).json({ code: 400, error: "Query length should be greater than 3" });
    }

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: "AM101", error: "Missing token" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: "AM102", error: "Invalid token" });
    }

    const db = fb.admin.firestore();
    const usersRef = db.collection("users");
    const teamsRef = db.collection("teams");

    let users = []

    // get users based on email
    const usersBasedOnEmail = await usersRef.where("email", ">=", query).where("email", "<=", query + "\uf8ff").get();

    // get users based on userid
    const usersBasedOnUserId = await usersRef.where("uid", ">=", query).where("uid", "<=", query + "\uf8ff").get();

    //get teams based on name
    const teamsBasedOnName = await teamsRef.where("name", ">=", query).where("name", "<=", query + "\uf8ff").get();
    


    // add them to users array, remove duplicates
    users = [...usersBasedOnEmail.docs, ...usersBasedOnUserId.docs];
    const usersData = users.map(doc => ({ id: doc.id, email: doc.data().email, name: doc.data().fname+" "+doc.data().lname, type: "user" }));
    const teamsData = teamsBasedOnName.docs.map(doc => ({ id: doc.id, name: doc.data().name, type: "team" }));

    response = {
        users: usersData,
        teams: teamsData
    }

    return res.status(200).json(response);

});





module.exports = router;
   



