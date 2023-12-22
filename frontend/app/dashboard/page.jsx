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

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Dashboard</h1>
			<p>This is your dashboard</p>
			<p>There should be something here</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	)
}
