"use client"

const { app: firebase } = require('./firebaseCli.js');
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { useAuthState } = require("react-firebase-hooks/auth");
const { useRouter } = require('next/navigation');

export default function Home()
{
	const auth = getAuth(firebase);
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		prompt: 'select_account'
	});

	const microsoftProvider = new OAuthProvider('microsoft.com');
	provider.setCustomParameters({
		prompt: 'consent'
	});

	// Get user auth state (signed in or not)
	const [user, loading] = useAuthState(auth);

	const router = useRouter();

	if (loading)
		return <h1 className="text-xl font-bold">Loading...</h1>

	if (user)
	{
		router.push('/dashboard'); // Redirect to dashboard
		return <h1 className="text-xl font-bold">Loading...</h1>
	}

	const emailSignIn = async (e) =>
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
			alert("User doesnt exist, creating new user");
			result = await createUserWithEmailAndPassword(auth, email.value, password.value);
		}

	}

	const serviceSignIn = async (service) =>
	{
		/** 
		 * When signing in with a service, if the user doesn't exist, 
		 * a new user is automatically created and signed in
		*/ 

		let result;
		switch (service)
		{
			case "microsoft":
				result = await signInWithPopup(auth, microsoftProvider)
				break;

			default: // Google
				result = await signInWithPopup(auth, provider)
				break;
		}

		// const result = await signInWithPopup(auth, provider)
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Hello World</h1>
			<p>Welcome to collabrain</p>
			<p>Lets build this collobaration platform</p>

			{/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

			<br />
			<form onSubmit={emailSignIn} style={{textAlign: "center"}}>
				<input style={{margin: 10, padding: 5, color: "black"}} type="email" name="email"/> <br/>
				<input style={{margin: 10, padding: 5, color: "black"}} type="password" name="password"/> <br/>
				<button style={{backgroundColor: "white", borderRadius: 5, color: "black", padding: "5px", margin: 10}} type="submit">Submit</button>
			</form>

			<button onClick={() => serviceSignIn("microsoft")}>Sign In with microsoft</button>
			<button onClick={() => serviceSignIn("google")}>Sign In with google</button>
		</div>
	)
}
