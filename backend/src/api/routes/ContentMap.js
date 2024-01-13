const { Router } = require('express');
const { verifyUser } = require("../helpers/firebase");
const fb = require("../helpers/firebase");

const router = Router();


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
    if (!data || !name )
    {
        return res.status(400).json({ code: "AM104", error: "Missing data or name of the content map" });
    }

    //verify user
    const user = await verifyUser(token);
    if (!user)
    {
        return res.status(403).json({ code: "AM102", error: "Invalid token" });
    }

    // create a new content map as collection inside user's doc

    const contentMap = {
        name: name,
        data: data,
        createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: fb.admin.firestore.FieldValue.serverTimestamp()
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

router.get("/:id", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    const id = req.params.id;

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
    const contentMapRef = contentMapsRef.doc(id);

    const contentMap = await contentMapRef.get();

    if (!contentMap.exists)
    {
        return res.status(404).json({ code: "AM108", error: "Content map not found" });
    }

    const contentMapData = contentMap.data();

    return res.status(200).json(contentMapData);
});


// untested
router.put("/:id", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];
    const id = req.params.id;

    const { name, data , share } = req.body;

    // Check if the token exists
    if (!token)
    {
        return res.status(400).json({ code: 400, error: "Missing token" });
    }

    // Check if the request has the required data
    if (!data || !name )
    {
        return res.status(400).json({ code: 400, error: "Missing data or name of the content map" });
    }

    if(share && (share!=="r" || share!=="rw")){
        return res.status(400).json({ code: 400, error: "Wrong share value" });
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

    const updatedContentMap = {
        name: name,
        data: JSON.stringify(data),
        updatedAt: fb.admin.firestore.FieldValue.serverTimestamp(),
    }

    if(share){
        updatedContentMap.share = share;
    }

    await contentMapRef.update(updatedContentMap);

    

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





module.exports = router;
   



