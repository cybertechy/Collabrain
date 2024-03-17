const { app: firebase } = require("_firebase/cli"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, getAdditionalUserInfo,sendPasswordResetEmail } = require("firebase/auth");
const { Timestamp } = require("firebase/firestore");
const authHook = require("react-firebase-hooks/auth"); // Required for all pages
const axios = require("axios");

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: 'select_account'
});

const microsoftProvider = new OAuthProvider('microsoft.com');

const auth = getAuth(firebase);
const signOut = () => auth.signOut();
const getToken = () => auth.currentUser?.getIdToken(true);
const getUserID = () => auth.currentUser?.uid;
const toFbTimestamp = (date) => Timestamp.fromDate(date);
const fromFbTimestamp = (timestamp) => timestamp.toDate();
const useAuthState = () => authHook.useAuthState(auth);

const sendPasswordReset = async (email) => {
	try {
	  await sendPasswordResetEmail(auth, email);
	  return null; // No error if password reset email is sent successfully
	} catch (error) {
	  return error.message; // Return error message if sending password reset email fails
	}
  };


async function emailSignIn(e)
{
	// This function should be adjusted to seperate log in and sign up
	e.preventDefault();
	const { email, password } = e.target.elements;

	let result;
	try { result = await signInWithEmailAndPassword(auth, email.value, password.value); }
	catch (err)
	{

		if (err.code === "auth/user-not-found") return {error: "User not found"};
		if(err.code === "auth/invalid-credential") return {error: "Invalid credentials"};
		if(err.code === "auth/wrong-password") return {error: "Invalid credentials"};
		if(err.code === "auth/too-many-requests") return {error: "Too many requests, please try again later"};
		if(err.code === "auth/user-disabled") return {error: "User account is disabled"};
		if(err.code === "auth/network-request-failed") return {error: "Network error, please try again later"};
		if(err.code === "auth/invalid-email") return {error: "Invalid email"};
		if(err.code === "auth/operation-not-allowed") return {error: "Operation not allowed"};
		if(err.code === "auth/internal-error") return {error: "Internal error"};
		return {error: err.message};
	}
}

async function emailSignUp(e)
{
	e.preventDefault();
	const { email, password, firstname, lastname } = e.target.elements;
	createUserWithEmailAndPassword(auth, email.value, password.value)
		.then(result =>
		{
			axios.post("https://collabrainbackend1-latest.onrender.com/api/users", {
				email: email.value,
				fname: firstname.value,
				lname: lastname.value,
				username: null,
				photo: null,
				uid: result.user.uid
			});
		})
		.catch(err => { return (err.code).slice(5); });
}

async function serviceSignIn(service)
{
	/** 
	 * When signing in with a service, if the user doesn't exist, 
	 * a new user is automatically created and signed in
	*/

	const providers = {
		"microsoft": microsoftProvider,
		"google": googleProvider
	};

	const result = await signInWithPopup(auth, providers[service])
		.catch(err =>
		{
			if (err.code === "auth/account-exists-with-different-credential")
			{
				alert("An account with this email exists using a different sign in method");
				return;
			}
			else
			{
				alert(err.message);
				return;
			}

		});

	const userInfo = getAdditionalUserInfo(result);
	// Add user to database if new user
	if (userInfo.isNewUser)
	{
		axios.post("https://collabrainbackend1-latest.onrender.com/api/users", {
			uid: result.user.uid,
			email: result.user.email,
			fname: userInfo.profile.given_name,
			lname: userInfo.profile.family_name,
			username: null,
			photo: (result.user.photoURL) ? result.user.photoURL : null
		})
			.catch(err =>
			{
				alert(err.message);
			});
	}
}

module.exports = {
	getToken,
	getUserID,
	signOut,
	useAuthState,
	emailSignIn,
	emailSignUp,
	serviceSignIn,
	toFbTimestamp,
	fromFbTimestamp,
	sendPasswordReset,
};
