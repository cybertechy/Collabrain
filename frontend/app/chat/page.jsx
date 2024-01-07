"use client";

import { useState, useEffect } from "react";
import InfoBar from "./infoBar";
import MessageBox from "./messageBox";
import Sidebar from "./sidebar";
import Toolbar from '@mui/material/Toolbar';

const { useRouter } = require('next/navigation');
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");

export default function ChatRoom()
{
	const router = useRouter();

	if (!fb.useIsAuth())
	{
		router.push('/'); // Redirect to dashboard
		return <h1 className="text-xl font-bold">Please sign in</h1>;
	}

	const [text, setText] = useState([]);

	async function sendTeamMsg(msg)
	{
		let data = {
			sender: fb.getUserID(),
			team: "MyTeam",
			channel: "General",
			msg: msg,
			sentAt: fb.toFbTimestamp(new Date()),
		};

		setText((prevText) => [
			...prevText,
			<h1 key={prevText.length} className="text-white">{`${data.sender}: ${data.msg}`}</h1>,
		]);

		socket.emit('teamMsg', data);
	};

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