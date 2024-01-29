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

async function getTeamMembers(teamID)
{
	let doc = await db.doc(`teams/${teamID}`).get();
	return doc.data().members;
}

async function deleteCollection(collectionPath, batchSize = 5)
{
	const collectionRef = db.collection(collectionPath);
	const query = collectionRef.orderBy('__name__').limit(batchSize);

	return new Promise((resolve, reject) =>
	{
		deleteQueryBatch(query, resolve).catch(reject);
	});
}

async function deleteQueryBatch(query, resolve)
{
	const snapshot = await query.get();

	const batchSize = snapshot.size;
	if (batchSize === 0)
	{
		// When there are no documents left, we are done
		resolve();
		return;
	}

	// Delete documents in a batch
	const batch = db.batch();
	snapshot.docs.forEach((doc) =>
	{
		batch.delete(doc.ref);
	});
	await batch.commit();

	// Recurse on the next process tick, to avoid
	// exploding the stack.
	process.nextTick(() =>
	{
		deleteQueryBatch(db, query, resolve);
	});
}

// Untested after modification
async function saveTeamMsg(data)
{
	let channels = (await db.collection(`teams/${data.team}/channels/`).where("name", "==", data.channel).get());
	let channelID = channels.docs[0].id;
	db.collection(`teams/${data.team}/channels/${channelID}/messages`)
		.add({
			"message": data.msg,
			"sender": data.sender,
			"sentAt": data.sentAt,
		});

	let teamData = (await db.doc(`teams/${data.team}`).get()).data();

	// Increase member score
	let members = teamData.members;
	members[data.sender].score++;

	//Increase team score
	let score = teamData.score++;

	db.doc(`team/${data.team}`).update({
		members,
		score
	}).catch(err => console.log(err));
}

// Untested after modification
async function saveDirectMsg(data)
{
	db.collection(`chats/${data.chat}/messages`)
		.add({
			"message": data.msg,
			"sender": data.sender,
			"sentAt": data.sentAt,
		});
	
	let userData = (await db.doc(`users/${data.sender}`).get()).data();

	// Increase member score
	let score = userData.score++;

	db.doc(`users/${data.sender}`).update({
		score
	}).catch(err => console.log(err));
}

module.exports = {
	db,
	admin,
	verifyUser,
	createDoc,
	removeDoc,
	updateDoc,
	getTeamMembers,
	deleteCollection,
	saveTeamMsg,
	saveDirectMsg
};