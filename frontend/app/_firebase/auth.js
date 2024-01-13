const { app: firebase } = require("_firebase/cli"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, linkWithPopup, onAuthStateChanged } = require("firebase/auth");
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

	}

}

async function emailSignUp(email, password, confirmPassword, username, firstname, lastname){

	if(!email || !password || !confirmPassword || !username || !firstname || !lastname)
		return {error: "Please fill out all fields", success: false};

	if(password !== confirmPassword)
		return {error: "Passwords do not match", success: false};

	let result;
	try
	{
		result = await createUserWithEmailAndPassword(auth,email,password);
		console.log("Result: "+result.code);
		// TODO: Add user to database here

		return {error: null, success: true};
	}
	catch (err)
	{
		// email already in use / invalid email / invalid password then return error
		if ( err.code === "auth/invalid-email" || err.code === "auth/weak-password")
		{
			return {error: "Incorrect email or password", success: false};
		} 
		else if( err.code === "auth/email-already-in-use"){

			return {error: "A user already exists with this email, consider signing up", success:false , route:"/"}
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

	return auth?.currentUser?.getIdToken(true)
}

module.exports = {
	getToken,
	signOut,
	isAuth,
	emailSignIn,
	serviceSignIn,
	emailSignUp
}