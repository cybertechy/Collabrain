const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

// Initialize Firebase admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),

});

function verifyUser(token)
{
	return admin.auth().verifyIdToken(token).catch((error) => { return null; });
}

// Functions to manipulate docs in Firestore
const db = admin.firestore();
async function createDoc(user)
{
	// Create new doc with generated ID
	let ref = await db.collection(`users/${user}/docs`).add({});
	return ref;
}

async function removeDoc(user, docID)
{
	// Delete doc with given ID
	db.collection(`users/${user}/docs`).doc(docID).delete();
}

async function updateDoc(user, docID, title, content)
{
	// Update doc with given ID
	db.collection(`users/${user}/docs`).doc(docID).update({ "title": title, "content": content });
}

module.exports = {
	db,
	admin,
	verifyUser,
	createDoc,
	removeDoc,
	updateDoc,
};