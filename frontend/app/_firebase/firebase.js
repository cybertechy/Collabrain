const { app: firebase } = require("_firebase/cli"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, getAdditionalUserInfo } = require("firebase/auth");
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
const getToken = () => auth.currentUser.getIdToken(true);
const getUserID = () => auth.currentUser.uid;
const toFbTimestamp = (date) => Timestamp.fromDate(date);
const fromFbTimestamp = (timestamp) => timestamp.toDate();
const useAuthState = () => authHook.useAuthState(auth);

async function emailSignIn(e)
{
	// This function should be adjusted to seperate log in and sign up
	e.preventDefault();
	const { email, password } = e.target.elements;

	let result;
	try
	{
		result = await signInWithEmailAndPassword(auth, email.value, password.value);
	}
	catch (err)
	{
		if (err.code === "auth/wrong-password" || err.code === "auth/invalid-email")
		{
			alert("Inccorect email or password");
			return;
		}

		else if (err.code === "auth/user-not-found")
		{
			alert("User doesnt exist, creating new user");
			result = await createUserWithEmailAndPassword(auth, email.value, password.value);
			axios.post("http://localhost:8080/api/user", {
				email: email.value,
				fname: fname.value,
				lname: lname.value,
				username: null,
				photo: null,
				uid: result.user.uid
			})
				.catch(err =>
				{
					alert(err.message);
				});
		}

		else // Other errors
		{
			alert(err.message);
		}

	}

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
		axios.post("http://localhost:8080/api/user", {
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
	serviceSignIn,
	toFbTimestamp,
	fromFbTimestamp
};