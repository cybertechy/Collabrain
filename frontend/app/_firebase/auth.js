const { app: firebase } = require("@firebase/cli"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, linkWithPopup } = require("firebase/auth");
const { useAuthState } = require("react-firebase-hooks/auth"); // Required for all pages

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

async function emailSignIn(e)
{
	// This fucntion should be adjusted to seperate log in and sign up
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
	}

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

}

async function getToken()
{
	return auth.currentUser.getIdToken(true)
}

module.exports = {
	getToken,
	signOut,
	isAuth,
	emailSignIn,
	serviceSignIn
}