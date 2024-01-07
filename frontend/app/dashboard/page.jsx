"use client";

const { useRouter } = require('next/navigation');
const { useEffect } = require("react");
const axios = require('axios');
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");

let currentDoc;

async function createDoc() 
{
	// Create a new document
	const title = document.querySelector("#doc-title").value;
	const content = document.querySelector("#doc-text").value;
	const token = await fb.getToken();

	let res = await axios.post('http://localhost:8080/api/doc/new', {
		"token": token
	}).catch(err => console.log(err));

	if (res.status == 200)
	{
		currentDoc = res.data.id;
		res = await axios.post(`http://localhost:8080/api/doc/${currentDoc}`, {
			"token": token,
			"title": title,
			"content": content,
		}).catch(err => console.log(err));
	}
};

async function deleteDoc()
{
	const token = await getToken();
	let res = await axios.post(`http://localhost:8080/api/doc/delete/${currentDoc}`, {
		"token": token
	}).catch(err => console.log(err));
};

async function joinTeamChat()
{
	
};

export default function Dashboard()
{
	useEffect(() =>
	{
		socket.init('http://localhost:8080');
	}, []);

	const router = useRouter();
	if (!fb.useIsAuth())
	{
		router.push('/'); // Redirect to home page
		return <h1 className="text-xl font-bold">Please sign in</h1>;
	}

	router.push('/chat'); // temp for testing

	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Dashboard</h1>
			<p>This is your dashboard</p>
			<p>There should be something here</p>
			<div className="grid grid-cols-2 gap-5 my-5">
				<button onClick={() => { router.push("/chat"); }} className="bg-sky-500 text-white font-semibold p-3 rounded-lg">Chat</button>
				<button onClick={fb.signOut} className="bg-red-400 text-white font-semibold p-3 rounded-lg">Sign Out</button>
			</div>
		</div>
	);
}
