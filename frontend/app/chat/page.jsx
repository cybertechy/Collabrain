"use client";

import { useState, useEffect, useRef } from "react";
import InfoBar from "./infoBar";
import MessageBox from "./messageBox";
import Sidebar from "./sidebar";
import Toolbar from '@mui/material/Toolbar';

const { useRouter } = require('next/navigation');
const axios = require("axios");
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");

export default function ChatRoom()
{
	const router = useRouter();
	const [user, loading] = fb.useAuthState();

	// Setup listener for new messages
	// Only listen when on chat page
	let sockCli = useRef(null);
	useEffect(() =>
	{
		if (!user)
			return;

		sockCli.current = socket.init('http://localhost:8080');
		sockCli.current.on('teamMsg', (data) =>
		{
			console.log("Received message from server");
			setText((prevText) => [
				...prevText,
				<h1 key={prevText.length} className="text-white">{`${data.sender}: ${data.msg}`}</h1>,
			]);
		});

		return () => sockCli.current.off('teamMsg');
	}, [user]);

	// Get previous messages
	useEffect(() =>
	{
		if (!user)
			return;

		fb.getToken().then((token) =>
		{
			// Get the messages from the server
			axios.get(`http://localhost:8080/api/team/LoH1iHOGowBzcYDXEqnu/channel/General/messages`,
				{ headers: { "Authorization": "Bearer " + token } })
				.then((res) =>
				{
					let data = res.data;
					let msgs = [];
					for (let i = 0; i < data.length; i++)
					{
						msgs.push(<h1 key={i} className="text-white">{`${data[i].sender}: ${data[i].message}`}</h1>);
					}
					setText(msgs);
				})
				.catch((err) => console.log(err));
		});
	}, [user]);

	const [text, setText] = useState([]);

	const sendTeamMsg = async (msg) =>
	{
		if (!sockCli.current)
		{
			console.log('Socket is not initialized yet.');
			return;
		}

		let data = {
			sender: fb.getUserID(),
			team: "LoH1iHOGowBzcYDXEqnu",
			channel: "General",
			msg: msg,
			sentAt: fb.toFbTimestamp(new Date()),
		};

		// Add the message to the real-time socket chat
		setText((prevText) => [
			...prevText,
			<h1 key={prevText.length} className="text-white">{`${data.sender}: ${data.msg}`}</h1>,
		]);

		sockCli.current.emit('teamMsg', data); // Send the message to the server
	};

	if (loading)
		return <h1 className="text-xl font-bold  text-black">Please sign in</h1>;

	return (
		<div className="flex h-full w-full">
			<Sidebar />
			<div className="relative h-full w-full bg-[#282b30] overflow-y-auto"> {/* Chat room */}
				<Toolbar>
					<h1 className='text-2xl font-semibold text-white'>#General</h1>
				</Toolbar>

				<div className="p-5">
					{text}
				</div>

				<div className="absolute z-10 inset-x-0 bottom-5 mx-5 drop-shadow-lg shadow-slate-950">
					<MessageBox callback={sendTeamMsg} />
				</div>

			</div>
			<InfoBar />
		</div>
	);
}