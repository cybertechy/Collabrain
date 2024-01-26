"use client";

import { useState, useEffect, useRef } from "react";
import ChannelBar from "./channelBar";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MessageBox from "./messageBox";
// import Sidebar from "./sidebar";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import Sidebar from "../../components/ui/sidebar/sidebar";
const { useRouter } = require('next/navigation');
const axios = require("axios");
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
import MessageItem from "./messageItem";
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
				<h1 key={prevText.length} className="text-black">{`${data.sender}: ${data.msg}`}</h1>,
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
					console.log(res.data);
					let data = res.data;
					let msgs = [];
  for (let i = 0; i < data.length; i++) {
    let msgDate = fb.fromFbTimestamp(new Timestamp(data[i].sentAt.seconds, data[i].sentAt.nanoseconds));
    msgs.push(
      <MessageItem 
        key={i} 
        sender={data[i].sender} 
        timestamp={msgDate.toLocaleTimeString()} 
        message={data[i].message} 
        reactions={{}} // Add reactions if you have them
      />
    );
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

		let token = await fb.getToken();
		let userData = axios.get(`http://localhost:8080/api/user/${user.uid}`,
			{ headers: { "Authorization": "Bearer " + token } });

			let sentAt = new Date();
			let messageData = {
			  senderID: fb.getUserID(),
			  sender: (userData.username) ? userData.username : user.email,
			  team: "LoH1iHOGowBzcYDXEqnu",
			  channel: "General",
			  msg: msg,
			  sentAt: fb.toFbTimestamp(sentAt),
			};

		// Add the message to the real-time socket chat
		setText((prevText) => [
			...prevText,
			<MessageItem 
			  key={prevText.length} 
			  sender={messageData.sender}
			  timestamp={sentAt.toLocaleTimeString()} 
			  message={messageData.msg} 
			  reactions={{}} // Add reactions if you have them
			/>,
		  ]);

		sockCli.current.emit('teamMsg', messageData); // Send the message to the server
	};
	if (loading|| !user )
    return (
        <div className="flex flex-col items-center justify-around min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold mb-5 text-primary">Trying to sign in</h1>
                <div className="loader mb-5"></div>

                <p className="text-lg font-bold text-primary mb-5 ">
                    If you're not signed in, sign in&nbsp;
                    <span className="underline cursor-pointer" onClick={() => router.push("/")}>
                        here
                    </span>
                </p>
            </div>
        </div>
    );

	return (
		<div className="flex h-full w-full">
			<Sidebar />
			<div className="relative h-full w-full bg-white overflow-y-auto"> {/* Chat room */}
				<Toolbar sx={{ backgroundColor: 'whitesmoke', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)' }}>
					<h1 className='text-xl font-semibold text-primary items-center justify-center flex-row'>Team Alpha {<ChevronRightIcon className = "mb-1" fontSize = "large"/>} General</h1>
				</Toolbar>

				<div className="p-5 h-5/6 scrollbar-thin scrollbar-thumb-primary  text-black overflow-y-scroll">
					{text}
				</div>

				<div className="absolute z-10 inset-x-0 bottom-5 mx-5  text-white">
					<MessageBox callback={sendTeamMsg} />
				</div>

				</div>
		{/* <ChannelBar /> */}
		</div>
	);
}