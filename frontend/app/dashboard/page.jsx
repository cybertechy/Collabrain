"use client"

const { signOut, isAuth, getToken } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require('next/navigation');

export default function Dashboard()
{
	const router = useRouter();
	if (!isAuth())
	{
		router.push('/'); // Redirect to home page
		return <h1 className="text-xl font-bold">Please sign in</h1>
	}

	// NOTE: Not finished
	// Needs to be tested with backend

	const createDoc = async () =>
	{
		// Create a new document
		const title = document.querySelector("#doc-title").value;
		const content = document.querySelector("#doc-text").value;
		const token = getToken();

		const res = await fetch("localhost:8080/api/doc/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: {
				token: token,
				title: title,
				content: content
			}
		});

		alert(res);
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Dashboard</h1>
			<p>This is your dashboard</p>
			<p>There should be something here</p>
			<button onClick={signOut}>Sign Out</button>
			<input id="doc-title" style={{ color: "black", padding: 10, marginTop: 10 }} type="text" />
			<textarea id="doc-text" style={{ color: "black", padding: 10, marginTop: 10 }} name="text" cols="30" rows="10"></textarea>
			<button onClick={createDoc} style={{ color: "black", backgroundColor: "white", padding: 10, borderRadius: 5, margin: 10 }}>Save doc</button>
		</div>
	)
}
