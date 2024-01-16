const { app: firebase } = require("_firebase/cli"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, getAdditionalUserInfo } = require("firebase/auth");
const { useAuthState } = require("react-firebase-hooks/auth"); // Required for all pages
const axios = require("axios");

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: 'select_account'
});

const microsoftProvider = new OAuthProvider('microsoft.com');

const auth = getAuth(firebase);
const signOut = () => auth.signOut();

/**
 * Check user auth state
 * @return {boolean} - true if signed in, false if not
*/
function isAuth()
{
	const [user, loading] = useAuthState(auth);
	return (user) ? true : false;
}

async function emailSignIn(email, password)
{
	// This fucntion should be adjusted to seperate log in and sign up

	if(!email || !password)
		return {error: "Please enter an email and password", success: false};
	
	let result;
	try
	{
		result = await signInWithEmailAndPassword(auth, email, password);

		return {error: null, success: true};
	}
	catch (err)
	{
		if (err.code === "auth/wrong-password" || err.code === "auth/invalid-email"|| err.code === "auth/invalid-credential")
		{
			return {error: "Incorrect email or password", success: false};
		}
		else // Other errors
		{
			console.log(err);
			return {error: "Something went wrong, Please try again later", success: false};
		}

		if (err.code === "auth/user-not-found")
		{
			alert("User doesnt exist, creating new user");
			result = await createUserWithEmailAndPassword(auth, email.value, password.value);
			axios.post("/api/user", {
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
			console.log("Error: "+err);
			return {error: "Something went wrong, Please try again later", success: false};
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

async function getToken()
{
	return auth.currentUser.getIdToken(true);
}

module.exports = {
	getToken,
	signOut,
	isAuth,
	emailSignIn,
	serviceSignIn
};