"use client"

const { app: firebase } = require("@app/firebaseCli.js"); // Required for all pages
const { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider,
	signInWithEmailAndPassword, createUserWithEmailAndPassword,
	EmailAuthProvider, linkWithPopup } = require("firebase/auth");
const { useAuthState } = require("react-firebase-hooks/auth"); // Required for all pages
const { useRouter } = require('next/navigation');

export default function Home()
{
	const googleProvider = new GoogleAuthProvider();
	googleProvider.setCustomParameters({
		prompt: 'select_account'
	});
	
	const microsoftProvider = new OAuthProvider('microsoft.com');
	
	// Get user auth state (signed in or not)
	// This is needed in every page
	const auth = getAuth(firebase);
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

	const serviceSignIn = async (service) =>
	{
		/** 
		 * When signing in with a service, if the user doesn't exist, 
		 * a new user is automatically created and signed in
		*/

		const providers = {
			"microsoft": microsoftProvider,
			"google": googleProvider
		}

		const result = await signInWithPopup(auth, providers[service]);
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Hello World</h1>
			<p>Welcome to collabrain</p>
			<p>Lets build this collobaration platform</p>

			{/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

			<br />
			<form onSubmit={emailSignIn} style={{ textAlign: "center" }}>
				<input style={{ margin: 10, padding: 5, color: "black" }} type="email" name="email" /> <br />
				<input style={{ margin: 10, padding: 5, color: "black" }} type="password" name="password" /> <br />
				<button style={{ backgroundColor: "white", borderRadius: 5, color: "black", padding: "5px", margin: 10 }} type="submit">Submit</button>
			</form>

			<button onClick={() => serviceSignIn("microsoft")}>Sign In with microsoft</button>
			<button onClick={() => serviceSignIn("google")}>Sign In with google</button>
		</div>
	)
}
