const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

// Initialize Firebase admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://collabrain-group-project-default-rtdb.asia-southeast1.firebasedatabase.app"
});

function getWeekNumber(d) {
	// Copy date so don't modify original
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	// Get first day of year
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	// Calculate full weeks to nearest Thursday
	const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	// Return array of year and week number
	return [d.getUTCFullYear(), weekNo];
}

function getCurrentMonth() {
	const now = new Date();
	return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
}

const db = admin.firestore();

async function verifyUser(token) {
	return admin.auth().verifyIdToken(token).catch((error) => { return null; });
}

async function deleteUser(uid) {
	return admin.auth().deleteUser(uid).catch((error) => { console.log("Error deleting user:", error); });

}

async function updateUser(uid, data) {
	return admin.auth().updateUser(uid, data).catch((error) => { console.log("Error updating user:", error); });
}

async function getUser(uid) {
	return admin.auth().getUser(uid).catch((error) => { console.log("Error getting user:", error); });
}


// Functions to manipulate docs in Firestore
async function createDoc(user) {
	// Create new doc with generated ID
	let ref = await db.collection(`users/${user}/docs`).add({});
	return ref;
}

async function removeDoc(user, docID) {
	// Delete doc with given ID
	db.collection(`users/${user}/docs`).doc(docID).delete();
}

async function updateDoc(user, docID, title, content) {
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


async function deleteCollection(collectionPath, batchSize = 5) {
	const collectionRef = db.collection(collectionPath);
	const query = collectionRef.orderBy('__name__').limit(batchSize);

	return new Promise((resolve, reject) => {
		deleteQueryBatch(query, resolve).catch(reject);
	});
}

async function deleteQueryBatch(query, resolve) {
	const snapshot = await query.get();

	const batchSize = snapshot.size;
	if (batchSize === 0) {
		// When there are no documents left, we are done
		resolve();
		return;
	}

	// Delete documents in a batch
	const batch = db.batch();
	snapshot.docs.forEach((doc) => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	// Recurse on the next process tick, to avoid
	// exploding the stack.
	process.nextTick(() => {
		deleteQueryBatch(db, query, resolve);
	});
}


async function saveTeamMsg(data, newMessage = false) {
	let channels = (await db.collection(`teams/${data.team}/channels/`).where("name", "==", data.channel).get());
	let channelID = channels.docs[0].id;
	db.collection(`teams/${data.team}/channels/${channelID}/messages`)
		.doc(data.msgID)
		.set({
			"message": data.msg,
			"sender": data.senderID,
			"username": data.sender,
			"sentAt": data.sentAt,
			"reactions": (data.reactions) ? data.reactions : []
		});

	if (newMessage) {

		let teamData = (await db.doc(`teams/${data.team}`).get()).data();

		// Increase member score
		let members = teamData.members;
		members[data.senderID].score ? members[data.senderID].score++ : members[data.senderID].score = 1;


		//Increase team score
		let score = teamData.score += 1;

		db.doc(`teams/${data.team}`).update({
			members,
			score
		}).catch(err => console.log(err));

		// Adds an active user to the "stats" collection.
		// Generates identifiers for docs that will hold weekly/ monthly stats
		// Score greater than 0 means that the user is active
		if (members[data.senderID].score > 0) {
			const [year, weekNumber] = getWeekNumber(new Date());
			const month = getCurrentMonth();
			const weekDocId = `week-${year}-${weekNumber}`;
			const monthDocId = `month-${month}`;

			// Update weekly stats
			const weekRef = db.collection('stats').doc(weekDocId);
			weekRef.get().then(doc => {
				if (!doc.exists) {
					weekRef.set({ activeUsers: 1 });
				} else {
					weekRef.update({ activeUsers: admin.firestore.FieldValue.increment(1) });
				}
			});

			// Update monthly stats
			const monthRef = db.collection('stats').doc(monthDocId);
			monthRef.get().then(doc => {
				if (!doc.exists) {
					monthRef.set({ activeUsers: 1 });
				} else {
					monthRef.update({ activeUsers: admin.firestore.FieldValue.increment(1) });
				}
			});
		}
	}
}

async function saveDirectMsg(data, newMessage = false) {
	// convert sent at to firebase timestamp seconds and nanoseconds
	let sentAt = admin.firestore.Timestamp.fromDate(new Date(data.sentAt));

	// Save message to chat
	db.collection(`chats/${data.chat}/messages`)
		.doc(data.msgID)
		.set({
			"message": data.msg,
			"sender": data.sender,
			"senderId": data.senderID,
			"sentAt": sentAt,
			"attachments": (data.attachments) ? data.attachments : null,
			"reactions": (data.reactions) ? data.reactions : []
		});

	if (newMessage) {
		// This part is for Points (Check no.of messages)
		let userData = (await db.doc(`users/${data.senderID}`).get()).data();

		// Increase user score
		let score = userData.score += 1;

		db.doc(`users/${data.senderID}`).update({
			score
		}).catch(err => console.log(err));

		// Adds an active user to the "stats" collection.
		// Generates identifiers for docs that will hold weekly/ monthly stats
		// Score greater than 0 means that the user is active
		if (score > 0) {
			const now = new Date();
			const [year, weekNumber] = getWeekNumber(now); // Assuming getWeekNumber returns [year, weekNumber]
			const month = now.getMonth() + 1; // Assuming getCurrentMonth is similar to this logic
			const weekDocId = `week-${year}-${weekNumber}`;
			const monthDocId = `month-${year}-${month}`;

			// Update weekly stats
			const weekRef = db.collection('stats').doc(weekDocId);
			weekRef.get().then(doc => {
				if (!doc.exists) {
					weekRef.set({ activeUsers: admin.firestore.FieldValue.increment(1) });
				} else {
					weekRef.update({ activeUsers: admin.firestore.FieldValue.increment(1) });
				}
			});

			// Update monthly stats
			const monthRef = db.collection('stats').doc(monthDocId);
			monthRef.get().then(doc => {
				if (!doc.exists) {
					monthRef.set({ activeUsers: admin.firestore.FieldValue.increment(1) });
				} else {
					monthRef.update({ activeUsers: admin.firestore.FieldValue.increment(1) });
				}
			});
		}
	}
}

// unTested
async function deleteChatMsg(chatID, msgID) {
	if(chatID && msgID) db.collection(`chats/${chatID}/messages`).doc(msgID).delete();
}

// unTested
async function deleteTeamMsg(teamID, channel, msgID) {
	if (!teamID || !channel || !msgID) return;
	let channels = (await db.collection(`teams/${teamID}/channels/`).where("name", "==", channel).get());
	let channelID = channels.docs[0].id;
	db.collection(`teams/${teamID}/channels/${channelID}/messages`).doc(msgID).delete();
}

const realtimeDB = admin.database();


// add object to realtime database
async function addObjectToRealtimeDB(path, object) {
	return realtimeDB.ref(path).set(object);
}

// get object from realtime database
async function getObjectFromRealtimeDB(path) {
	return realtimeDB.ref(path).once("value");
}

// update object in realtime database
async function updateObjectInRealtimeDB(path, object) {
	return realtimeDB.ref(path).update(object);
}

// remove object from realtime database
async function removeObjectFromRealtimeDB(path) {
	return realtimeDB.ref(path).remove();
}

// Database event listeners
async function listenToRealtimeDB(path, callback) {
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
	listenToRealtimeDB,
	deleteChatMsg,
	deleteTeamMsg
};