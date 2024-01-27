"use client";

const { useRouter } = require('next/navigation');
const { useEffect } = require("react");
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");

export default function Dashboard()
{
	const router = useRouter();
	const [user, loading] = fb.useAuthState();
	let sock_cli;
	useEffect(() =>
	{
		if (user)
			sock_cli = socket.init('http://localhost:8080');
	}, [user]);

	if (loading)
		return <h1 className="text-xl font-bold  text-black">Please sign in</h1>;

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold text-black">Dashboard</h1>
			<p className='text-black'>This is your dashboard</p>
			<p className='text-black'>There should be something here</p>
			<div className="grid grid-cols-2 gap-5 my-5">
				<button onClick={() => { router.push("/chat"); }} className="bg-sky-500 text-white font-semibold p-3 rounded-lg">Chat</button>
				<button onClick={fb.signOut} className="bg-red-400 text-white font-semibold p-3 rounded-lg">Sign Out</button>
			</div>
		</div>
	);
}
