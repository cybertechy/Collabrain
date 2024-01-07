"use client"

const { useRouter } = require('next/navigation');
const fb = require("_firebase/firebase"); // Import the authentication functions

export default function Home()
{
	const router = useRouter();

	if (fb.useIsAuth())
		router.push('/dashboard'); // Redirect to dashboard

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Hello World</h1>
			<p>Welcome to collabrain</p>
			<p>Lets build this collobaration platform</p>

			{/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

			<br />
			<form onSubmit={fb.emailSignIn} style={{ textAlign: "center" }}>
				<input style={{ margin: 10, padding: 5, color: "black" }} type="email" name="email" /> <br />
				<input style={{ margin: 10, padding: 5, color: "black" }} type="password" name="password" /> <br />
				<button style={{ backgroundColor: "white", borderRadius: 5, color: "black", padding: "5px", margin: 10 }} type="submit">Submit</button>
			</form>

			<button onClick={() => fb.serviceSignIn("microsoft")}>Sign In with microsoft</button>
			<button onClick={() => fb.serviceSignIn("google")}>Sign In with google</button>
		</div>
	);
}
