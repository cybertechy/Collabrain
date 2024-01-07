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

const db = admin.firestore();

// Functions to manipulate docs in Firestore
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

async function getTeamMembers(team, msg)
{
	console.log(team);
	// Get all users in the same team
	// Users are stored as a map named members in teams/teamname
	let teamRef = db.collection('teams').doc(team);
	let teamDoc = await teamRef.get()
		.then(doc =>
		{
			if (!doc.exists)
			{
				console.log('No such document!');
			} else
			{
				console.log('Document data:', doc.data());
			}
		});
}

module.exports = {
	admin,
	verifyUser,
	createDoc,
	removeDoc,
	updateDoc,
	getTeamMembers
};