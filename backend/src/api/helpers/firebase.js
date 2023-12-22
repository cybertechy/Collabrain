const admin = require("firebase-admin");
const { getFirestore }  = require("firebase-admin/firestore");
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
const db = getFirestore();
async function createDoc(collectionName, data)
{
	const ref = db.collection(collectionName).add(data).catch((error) => { console.log(error); })
	console.log(`Document created: ${ref.id}`);
}

async function removeDoc(collectionName, docID)
{
	db.collection(collectionName).doc(docID).delete().catch((error) => { console.log(error); })
	console.log(`Document deleted`);
}

async function updateDoc(collectionName, docID, data)
{
	db.collection(collectionName).doc(docID).update(data).catch((error) => { console.log(error); })
	console.log(`Document updated`);
}

async function getDoc(collectionName, docID)
{
	const doc = await db.collection(collectionName).doc(docID).get().catch((error) => { console.log(error); })
	console.log(`Document retrieved`);
	return doc.data();
}

module.exports = {
	admin,
	verifyUser,
	createDoc,
	removeDoc,
	updateDoc,
	getDoc
};