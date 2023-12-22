import { initializeApp } from "firebase/app";

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

module.exports = {
	app
};