const { Router } = require('express');
const { verifyUser } = require("../helpers/firebase");
const fb = require("../helpers/firebase");
const uuid = require("uuid");
const oci = require("../helpers/oracle");

const router = Router();


/* Create a New content map */
// @RequestBody: { name: string, data: any, path: string }
router.post("/", async (req, res) => {

    if (!req.headers.authorization || !req.body.name) return res.status(400).json({ code: 400, error: "Missing token or name" });

    //verify user
    const token = req.headers.authorization.split(' ')[1];
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: "AM102", error: "Invalid token" });


    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ code: "AM107", error: "User not found" });

    const contentMapsRef = db.collection("contentMaps")
    let DataId = uuid.v4();

    // upload data to oracle cloud
    const uploadData = await oci.addData("B3", DataId, "application/json", JSON.stringify(req.body.data));
    if (!uploadData.eTag) return res.status(500).json({ code: 500, error: "Uploading data failed" });

    // get the user's name from the database
    if (!user.name) {
        await db.doc(`users/${user.uid}`).get().then(doc => {
            if (doc.exists) {
                user.name = doc.data().fname + " " + doc.data().lname;
            }
        })

        console.log(user.name);
    }
    // create a new content map as collection inside user's doc
    const contentMap = {
        name: req.body.name,
        data: DataId,
        createdAt: fb.admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: fb.admin.firestore.FieldValue.serverTimestamp(),
        Access: { [user.uid]: { role: "owner", email: user.email, name: user.name, type: "users" } },
        path: (req.body.path) ? req.body.path : "/"
    }

    const contentMapRef = await contentMapsRef.add(contentMap);
    const contentMapId = contentMapRef.id;

    // add the content map to users content maps array
    await userRef.update({
        contentMaps: fb.admin.firestore.FieldValue.arrayUnion(contentMapId)
    });

    return res.status(200).json({ id: contentMapId });
});


/* Get all content maps of a user */
router.get("/", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];

    // Check if the token exists
    if (!token) return res.status(400).json({ code: "AM101", error: "Missing token" });

    //verify user
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: "AM102", error: "Invalid token" });


    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ code: "AM107", error: "User not found" });

    //get the content maps array of the user
    const contentMaps = doc.data().contentMaps;

    // get the content maps data
    const contentMapsData = await Promise.all(contentMaps.map(async contentMapId => {
        const contentMapRef = db.collection("contentMaps").doc(contentMapId);
        const contentMap = await contentMapRef.get();
        const contentMapData = contentMap.data();
        return { id: contentMapId, name: contentMapData.name, path: contentMapData.path, createdAt: contentMapData.createdAt.toDate(), updatedAt: contentMapData.updatedAt.toDate() };
    }));

    return res.status(200).json(contentMapsData);
});


/* Get a content map of a user*/
router.get("/:id", async (req, res) => {

    const token = req.headers?.authorization?.split(' ')[1];
    const id = req.params.id;

    // Check if the token exists
    if (!token) return res.status(400).json({ code: "AM101", error: "Missing token" });

    //verify user
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: "AM102", error: "Invalid token" });

    const db = fb.admin.firestore();
    const contentMap = await db.collection("contentMaps").doc(id).get();
    if (!contentMap.exists) return res.status(404).json({ code: "AM108", error: "Content map not found" });
    const contentMapData = contentMap.data();

    //check if user has access to the content map
    if (!contentMapData.Access[user.uid]) return res.status(403).json({ code: "AM109", error: "User does not have access to the content map" });

    // get the data from oracle cloud
    const getData = await oci.getData("B3", contentMapData.data);

    // Add Here: console.log(getData)

    if (!getData) return res.status(500).json({ code: 500, error: "Getting data failed" });

    contentMapData.data = await oci.generateStringFromStream(getData.value);

    contentMapData.createdAt = contentMapData.createdAt.toDate();
    contentMapData.updatedAt = contentMapData.updatedAt.toDate();

    return res.status(200).json({ ...contentMapData, userAccess: contentMapData.Access[user.uid]?.role });
});

/* Get a content map of a user , Public Access  */
router.get("/public/:id", async (req, res) => {
    const id = req.params.id;

   
    const db = fb.admin.firestore();
    const contentMap = await db.collection("contentMaps").doc(id).get();
    if (!contentMap.exists) return res.status(404).json({ code: "AM108", error: "Content map not found" });

    const contentMapData = contentMap.data();

    //check if Public Access is enabled
    if (!contentMapData.Access["public"]) return res.status(403).json({ code: "AM109", error: "Access Denied" });

    // get the data from oracle cloud
    const getData = await oci.getData("B3", contentMapData.data);

    if (!getData) return res.status(500).json({ code: 500, error: "Getting data failed" });

    contentMapData.data = await oci.generateStringFromStream(getData.value);

    contentMapData.createdAt = contentMapData.createdAt.toDate();
    contentMapData.updatedAt = contentMapData.updatedAt.toDate();

    return res.status(200).json({ ...contentMapData, userAccess: "view" });
});

/* Update a content map of a user */
router.put("/:id", async (req, res) => {

    if (!req.headers.authorization || !req.body) return res.status(400).json({ code: 400, error: "Missing token or data" });

    // Check if the data exists
    let token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(400).json({ code: 400, error: "Missing token" });


    //verify user
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: 403, error: "Invalid token" });

    const db = fb.admin.firestore();

    const contentMap = await db.collection("contentMaps").doc(req.params.id).get();
    if (!contentMap.exists) return res.status(404).json({ code: 404, error: "Content map not found" });


    let contentMapData = contentMap.data();
    if (!contentMapData.Access[user.uid]) {
        return res.status(403).json({ code: 403, error: "User does not have access to the content map" });
    }

    let userRole = contentMapData.Access[user.uid].role;
    let updatedContentMap = { ...contentMapData };

    if (userRole === "read") return res.status(403).json({ code: 403, error: "User does not have access to the operation" });

    if (req.body.data && (userRole === "owner" || userRole === "edit")) {


        // check if the data is uuid else generate new uuid
        if (uuid.validate(contentMapData.data)) updatedContentMap.data = contentMapData.data;
        else updatedContentMap.data = uuid.v4();

        // upload data to oracle cloud
        const uploadData = await oci.addData("B3", contentMapData.data, "application/json", JSON.stringify(req.body.data));


        if (!uploadData.eTag) {
            return res.status(500).json({ code: 500, error: "Uploading data failed" });
        }
    }

    if (userRole === "owner") {

        if (req.body.name) updatedContentMap.name = req.body.name;
    
        if (req.body.path) updatedContentMap.path = req.body.path;

        // TODO: Revoke access Incomplete
        if (req.body.access && req.body.user || req.body.revokeAccess) {
            updatedContentMap.Access = req.body.access;

            if(req.body.revokeAccess) {
                fb.db.collection("users").doc(req.body.user).update({
                    AccessContentMaps: fb.admin.firestore.FieldValue.arrayRemove(req.params.id)
                });
            } else {
                fb.db.collection("users").doc(req.body.user).update({
                    AccessContentMaps: fb.admin.firestore.FieldValue.arrayUnion(req.params.id)
                });
            }
        }
    }

    // async update the users who access and the content map to AccessContentMaps array of user
    await Promise.all(Object.keys(updatedContentMap.Access).map(async userId => {
        const userRef = db.collection("users").doc(userId);
        const user = await userRef.get();
        if (!user.exists) return res.status(404).json({ code: 404, error: "User not found" });

        let userContentMaps = user.data().AccessContentMaps;
        if (!userContentMaps) userContentMaps = [];

        userContentMaps.push(req.params.id);
        await userRef.update({
            AccessContentMaps: userContentMaps
        });
    }));

    updatedContentMap.updatedAt = fb.admin.firestore.FieldValue.serverTimestamp();

    //set updated content map
    await db.collection("contentMaps").doc(req.params.id).set(updatedContentMap);

    return res.status(200).json({ code: 200, id: req.params.id });
});

/* Delete a content map of a user */
router.delete("/:id", async (req, res) => {

    if (!req.headers.authorization) return res.status(400).json({ code: 400, error: "Missing token" });
    const token = req.headers.authorization?.split(' ')[1];


    //verify user
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: 403, error: "Invalid token" });

    const db = fb.admin.firestore();
    const userRef = db.collection("users").doc(user.uid)
    const doc = await userRef.get();
    if (!doc.exists) return res.status(404).json({ code: 404, error: "User not found" });

    // get the content map
    const contentMapsRef = db.collection("contentMaps");
    const contentMapRef = contentMapsRef.doc(req.params.id);
    const contentMap = await contentMapRef.get();
    if (!contentMap.exists) return res.status(404).json({ code: 404, error: "Content map not found" });

    // Ensure user is owner of the content map
    let contentMapData = contentMap.data();
    if (!contentMapData.Access[user.uid] || contentMapData.Access[user.uid].role !== "owner") {
        return res.status(403).json({ code: 403, error: "User does not have access to the operation" });
    }

    


    // remove the content map from users content maps array, by filtering out the content map id

    if (contentMapData.path === "/") {
        let userContentMaps = doc.data().contentMaps;
        userContentMaps = userContentMaps.filter(contentMapId => contentMapId !== req.params.id);
        let updateStatus = await userRef.update({
            contentMaps: userContentMaps
        });

        // If fails, add the content map back to the with same id
        if (!updateStatus) {
            let status = await contentMapsRef.doc(req.params.id).set(contentMapData);
            if (!status)
                return res.status(500).json({ code: 500, error: "Critical Server Error" });


            return res.status(500).json({ code: 500, error: "Deleting content map failed" });
        }
    } else {
        // get the folder with same path
        let folderRef = await userRef.collection("folders").where("path", "==", contentMapData.path).get();
        if (!folderRef) return res.status(404).json({ code: 404, error: "Folder not found" });


        let folder = folderRef?.docs[0]?.data();
        if(!folder?.contentMaps) return res.status(500).json({ code: 500, error: "Critical Server Error" });

        let contentMaps = folder.contentMaps;
        contentMaps = contentMaps.filter(contentMapId => contentMapId !== req.params.id);
        let updateStatus = await fb.db.doc(`users/${user.uid}/folders/${folderRef.docs[0].id}`).update({
            contentMaps: contentMaps
        });

        // If fails, add the content map back to the with same id
        if (!updateStatus) {
            let status = await contentMapsRef.doc(req.params.id).set(contentMapData);
            if (!status)
                return res.status(500).json({ code: 500, error: "Critical Server Error" });
            return res.status(500).json({ code: 500, error: "Deleting content map failed" });
        }
    }

    // delete the data from oracle cloud
    const deleteData = await oci.deleteFile("B3", contentMapData.data);
    if (!deleteData.lastModified) return res.status(500).json({ code: 500, error: "Deleting data failed" });

    let status = await contentMapRef.delete();
    if (!status) return res.status(500).json({ code: 500, error: "Deleting content map failed" });

    return res.status(200).json({ code: 200, id: req.params.id });
});


/* A search API that returns similar matching users or teams */
router.get("/ut/search", async (req, res) => {

    const auth = req.headers.authorization;
    const token = auth?.split(' ')[1];
    const query = req.query.query;

    if (!query || query.length < 3 || !token) return res.status(400).json({ code: 400, error: "Missing token or query or query length should be greater than 3" });

    //verify user
    const user = await verifyUser(token);
    if (!user) return res.status(403).json({ code: "AM102", error: "Invalid token" });


    const db = fb.admin.firestore();
    const usersRef = db.collection("users");
    const teamsRef = db.collection("teams");

    let users = []

    const [usersBasedOnEmail, usersBasedOnUsername, teamsBasedOnName] = await Promise.all([
        usersRef.where("email", ">=", query).where("email", "<=", query + "\uf8ff").get(),
        usersRef.where("lowUsername", ">=", query).where("lowUsername", "<=", query + "\uf8ff").get(),
        teamsRef.where("name", ">=", query).where("name", "<=", query + "\uf8ff").get()
    ]);

    // add them to users array, remove duplicates
    users = [...usersBasedOnEmail.docs, ...usersBasedOnUsername.docs];

    users = users.filter((user, index, self) =>
        index === self.findIndex((t) => (
            t.id === user.id
        ))
    )
    const usersData = users.map(doc => ({ id: doc.id, email: doc.data().email, name: doc.data().fname + " " + doc.data().lname, type: "user" }));
    const teamsData = teamsBasedOnName.docs.map(doc => ({ id: doc.id, name: doc.data().name, type: "team" }));

    response = {
        users: usersData,
        teams: teamsData
    }

    return res.status(200).json(response);

});





module.exports = router;




