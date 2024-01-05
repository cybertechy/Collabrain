"use client"

const { useEffect } = require("react");
const { useIsAuth, emailSignIn, serviceSignIn } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require('next/navigation');
const { initializeSocket } = require('_socket/socket');

export default function Home()
{
	const router = useRouter();

	// if (useIsAuth())
	// 	router.push('/chat'); // Redirect to dashboard

	useEffect(() =>
	{
		initializeSocket('http://localhost:8080');
	}, []);

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
	);
}
