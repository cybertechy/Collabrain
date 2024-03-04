const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

// Initialize Firebase admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://collabrain-group-project-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

async function verifyUser(token)
{
	return admin.auth().verifyIdToken(token).catch((error) => { return null; });
}

async function deleteUser(uid){
	return admin.auth().deleteUser(uid).catch((error) => { console.log("Error deleting user:", error); });

}

async function updateUser(uid, data){
	return admin.auth().updateUser(uid, data).catch((error) => { console.log("Error updating user:", error); });
}

async function getUser(uid){
	return admin.auth().getUser(uid).catch((error) => { console.log("Error getting user:", error); });
}


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

async function getTeamMembers(teamID) {
    try {
        const teamDoc = await db.doc(`teams/${teamID}`).get();
        if (!teamDoc.exists) {
            console.error(`No such team with ID ${teamID}`);
            return []; // Return an empty array or null if the team doesn't exist
        }
        const teamData = teamDoc.data();
        return teamData.members || []; // Return members or an empty array if members field is missing
    } catch (error) {
        console.error("Error getting team members:", error);
        return []; // Return an empty array in case of error
    }
}

async function getChatMembers(chatID) {
    try {
        const chatDoc = await db.doc(`chats/${chatID}`).get();
        if (!chatDoc.exists) {
            console.error(`No such chat with ID ${chatID}`);
            return []; // Return an empty array if the chat doesn't exist
        }
        const chatData = chatDoc.data();
        return chatData.members || []; // Return members array or an empty array if members field is missing
    } catch (error) {
        console.error("Error getting chat members:", error);
        return []; // Return an empty array in case of error
    }
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
// Untested after modification
async function saveTeamMsg(data)
{
	let channels = (await db.collection(`teams/${data.team}/channels/`).where("name", "==", data.channel).get());
	let channelID = channels.docs[0].id;
	db.collection(`teams/${data.team}/channels/${channelID}/messages`)
		.add({
			"message": data.msg,
			"sender": data.senderID,
			"username": data.sender,
			"sentAt": data.sentAt,
			"reactions": (data.reactions) ? data.reactions : []
		});

	let teamData = (await db.doc(`teams/${data.team}`).get()).data();

	// Increase member score
	let members = teamData.members;
	members[data.senderID].score ? members[data.senderID].score++ : members[data.senderID].score = 1; 
	

	//Increase team score
	
	let score = teamData.score+=1;

	db.doc(`teams/${data.team}`).update({
		members,
		score
	}).catch(err => console.log(err));
}

// Untested after modification
async function saveDirectMsg(data)
{
	// convert sent at to firebase timestamp seconds and nanoseconds
	let sentAt = admin.firestore.Timestamp.fromDate(new Date(data.sentAt));

	// Save message to chat
	db.collection(`chats/${data.chat}/messages`)
		.add({
			"message": data.msg,
			"sender": data.sender,
			"sentAt": sentAt,
			"reactions": (data.reactions) ? data.reactions : []
		});
	
	// This part is for Points (Check no.of messages)
	// let userData = (await db.doc(`users/${data.sender}`).get()).data();

	
	// let score = userData.score+=1;

	// db.doc(`users/${data.sender}`).update({
	// 	score
	// }).catch(err => console.log(err));
}

const realtimeDB = admin.database();


// add object to realtime database
async function addObjectToRealtimeDB(path, object)
{
	return realtimeDB.ref(path).set(object);
}

// get object from realtime database
async function getObjectFromRealtimeDB(path)
{
	return realtimeDB.ref(path).once("value");
}

// update object in realtime database
async function updateObjectInRealtimeDB(path, object)
{
	return realtimeDB.ref(path).update(object);
}

// remove object from realtime database
async function removeObjectFromRealtimeDB(path)
{
	return realtimeDB.ref(path).remove();
}

// Database event listeners
async function listenToRealtimeDB(path, callback)
{
	realtimeDB.ref(path).on("value", (snapshot) => callback(snapshot.val()));
}


module.exports = {
	db,
	admin,
	verifyUser,
	createDoc,
	removeDoc,
	updateDoc,
	getTeamMembers,
	getChatMembers,
	deleteCollection,
	saveTeamMsg,
	saveDirectMsg,
	deleteUser,
	updateUser,
	getUser,
	addObjectToRealtimeDB,
	getObjectFromRealtimeDB,
	updateObjectInRealtimeDB,
	removeObjectFromRealtimeDB,
	listenToRealtimeDB
};