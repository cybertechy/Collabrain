const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

// Initialize Firebase admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),

});

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return [d.getUTCFullYear(), weekNo];
}

function getCurrentMonth() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
}

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

	// Increment the user's score in the "users" collection
    await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').where("username", "==", data.sender);
        const snapshot = await userRef.get();

        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0]; // Assuming 'username' is unique and only gets one document
            const userData = userDoc.data();
            const newScore = (userData.score || 0) + 1; // Increment score or initialize to 1 if undefined

            // Update the user's score
            transaction.update(userDoc.ref, { score: newScore });
        } else {
            console.log("User not found");
            // Handle case where user is not found, if necessary
        }
    }).catch(err => console.log(err));

	// Increment the user's monthly message count in the "users" collection
    const userRef = db.collection('users').doc(data.senderID);
    const month = getCurrentMonth();
    const messageCountField = `monthlyMessageCount.${month}`; // Construct the field name for the monthly message count

    await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
            console.log("User document does not exist");
            return;
        }

        // Increment the message count for the current month
        transaction.update(userRef, {
            [messageCountField]: admin.firestore.FieldValue.increment(1)
        });
    }).catch(err => console.log(err));

	// Adds an active user to the "stats" collection.
	// Generates identifiers for docs that will hold weekly/ monthly stats
    const senderID = data.senderID;
    const [year, weekNumber] = getWeekNumber(new Date());
    const weekDocId = `week-${year}-${weekNumber}`;
    const monthDocId = `month-${month}`;

    // Check and update weekly stats
    const weekRef = db.collection('stats').doc(weekDocId);
    weekRef.get().then(doc => {
        if (!doc.exists) {
            weekRef.set({ activeUsers: 1, activeUserIDs: [senderID] });
        } else {
            let data = doc.data();
            if (!data.activeUserIDs.includes(senderID)) {
                weekRef.update({
                    activeUsers: admin.firestore.FieldValue.increment(1),
                    activeUserIDs: admin.firestore.FieldValue.arrayUnion(senderID)
                });
            }
        }
    });

    // Check and update monthly stats
    const monthRef = db.collection('stats').doc(monthDocId);
    monthRef.get().then(doc => {
        if (!doc.exists) {
            monthRef.set({ activeUsers: 1, activeUserIDs: [senderID] });
        } else {
            let data = doc.data();
            if (!data.activeUserIDs.includes(senderID)) {
                monthRef.update({
                    activeUsers: admin.firestore.FieldValue.increment(1),
                    activeUserIDs: admin.firestore.FieldValue.arrayUnion(senderID)
                });
            }
        }
    });

	// Updates active users in a team's document
	const teamRef = db.collection('teams').doc(data.team);
    await db.runTransaction(async (transaction) => {
        const teamDoc = await transaction.get(teamRef);
        if (!teamDoc.exists) {
            console.log("Team not found");
            return;
        }
        let teamData = teamDoc.data();
        teamData.activeUserIDs = teamData.activeUserIDs || [];

        if (!teamData.activeUserIDs.includes(data.senderID)) {
            teamData.activeUserIDs.push(data.senderID);
            teamData.activeUsers = (teamData.activeUsers || 0) + 1;
            transaction.update(teamRef, {
                activeUserIDs: teamData.activeUserIDs,
                activeUsers: teamData.activeUsers
            });
        }
    }).catch(err => console.log(err));
}

// Untested after modification
async function saveDirectMsg(data) {
    // convert sent at to firebase timestamp seconds and nanoseconds
    let sentAt = admin.firestore.Timestamp.fromDate(new Date(data.sentAt));

    // Save message to chat
    await db.collection(`chats/${data.chat}/messages`)
        .add({
            "message": data.msg,
            "sender": data.sender,
            "sentAt": sentAt,
            "reactions": (data.reactions) ? data.reactions : []
        });

	// Update the user's message count for the month
    await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(data.senderID);
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists) {
            const month = getCurrentMonth();
            // Create or update the field for the current month's message count
            const messageCountField = `monthlyMessageCount.${month}`;
            const increment = admin.firestore.FieldValue.increment(1);

            transaction.update(userRef, { [messageCountField]: increment });
        } else {
            console.log("User not found");
        }
    }).catch(err => console.log(err));

	// Increment the user's score in the "users" collection
	await db.runTransaction(async (transaction) => {
		const userRef = db.collection('users').where("username", "==", data.sender);
        const snapshot = await userRef.get();

        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0]; // Assuming 'username' is unique and only gets one document
            const userData = userDoc.data();
            const newScore = (userData.score || 0) + 1; // Increment score or initialize to 1 if undefined

            // Update the user's score
            transaction.update(userDoc.ref, { score: newScore });
        } else {
            console.log("User not found");
        }
    }).catch(err => console.log(err));

    // Identifiers for weekly/monthly stats
    const senderID = data.senderID; // Assuming 'senderID' represents the unique ID of the sender
    const [year, weekNumber] = getWeekNumber(new Date());
    const month = getCurrentMonth();
    const weekDocId = `week-${year}-${weekNumber}`;
    const monthDocId = `month-${month}`;

    // Update weekly stats
    const weekRef = db.collection('stats').doc(weekDocId);
    weekRef.get().then(doc => {
        if (!doc.exists) {
            weekRef.set({ activeUsers: 1, activeUserIDs: [senderID] });
        } else {
            let data = doc.data();
            if (!data.activeUserIDs.includes(senderID)) {
                weekRef.update({
                    activeUsers: admin.firestore.FieldValue.increment(1),
                    activeUserIDs: admin.firestore.FieldValue.arrayUnion(senderID)
                });
            }
        }
    });

    // Update monthly stats
    const monthRef = db.collection('stats').doc(monthDocId);
    monthRef.get().then(doc => {
        if (!doc.exists) {
            monthRef.set({ activeUsers: 1, activeUserIDs: [senderID] });
        } else {
            let data = doc.data();
            if (!data.activeUserIDs.includes(senderID)) {
                monthRef.update({
                    activeUsers: admin.firestore.FieldValue.increment(1),
                    activeUserIDs: admin.firestore.FieldValue.arrayUnion(senderID)
                });
            }
        }
    });
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
	saveDirectMsg
};