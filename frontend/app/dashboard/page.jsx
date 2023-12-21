"use client"
const { getAuth } = require("firebase/auth");
const { useAuthState } = require("react-firebase-hooks/auth"); 
const { useRouter } = require('next/navigation');

export default function Dashboard()
{
	const auth = getAuth();

	// Get user auth state (signed in or not)
	const [user, loading] = useAuthState(auth);
	
	const router = useRouter();

	if (loading)
		return <h1 className="text-xl font-bold">Loading...</h1>

	if (!user)
	{
		router.push('/'); // Redirect to home page
		return <h1 className="text-xl font-bold">Please sign in</h1>
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Dashboard</h1>
			<p>This is your dashboard</p>
			<p>There should be something here</p>
			<button onClick={() => auth.signOut()}>Sign Out</button>
		</div>
	)
}
