// Importing firebase features
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAHQgSkCbCxYyyBPS7wgnMQEi38HE86vJw",
	authDomain: "collabrain-group-project.firebaseapp.com",
	projectId: "collabrain-group-project",
	storageBucket: "collabrain-group-project.appspot.com",
	messagingSenderId: "185176302788",
	appId: "1:185176302788:web:c5aa92a9ddb41d4bfd1591",
	measurementId: "G-C4PW9JSYYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

async function addData(collectionName, data)
{
	try
	{
		const ref = await addDoc(collection(db, collectionName), data, { merge: true });
		console.log(`Document created: ${ref.id}`);
	}
	catch (e)
	{
		console.error("Error adding document: ", e);
	}
}

module.exports = { addData }