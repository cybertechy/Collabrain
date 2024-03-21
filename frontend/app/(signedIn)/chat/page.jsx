
"use client";

import { useState, useEffect, useRef } from "react";
import MessageBox from "@/components/ui/messagesComponents/messageBox";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import ChannelBar from "@/components/ui/chatsComponents/channelBar";
import MessageItem from "@/components/ui/messagesComponents/MessageItem";
const { useRouter, useSearchParams } = require('next/navigation');
const axios = require("axios");
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ShortTextIcon from '@mui/icons-material/ShortText'; 
import Lottie from "lottie-react";
import LoadingJSON from "@/public/assets/json/loading.json";
import enc from "crypto-js/enc-utf8";
import { AES } from "crypto-js";
const uuid = require("uuid");
import { maskProfanity, containsProfanity } from "@/app/utils/textmoderator";


const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

export default function ChatRoom() {

	const router = useRouter();
	const params = useSearchParams();
	const [user, loading] = fb.useAuthState();
	const [teamData, setTeamData] = useState({}); // This is the team name that will be displayed on the top of the chat
	const [channelsData, setChannelsData] = useState([]);
	const [channelBarTeamData, setChannelBarTeamData] = useState({});
	const [userInfo, setUserInfo] = useState({ data: { username: "User" } });
	const [teamId, setTeamId] = useState(params.get('teamId')); // This is the team name that will be displayed on the top of the chat
	const [channelName, setChannelName] = useState(params.get('channelName')); // This is the team name that will be displayed on the top of the chat
	const [channelsUpdated, setChannelsUpdated] = useState(0);

	const messagesEndRef = useRef(null); // Create a reference to the message container

	// Function to scroll to the bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	let sockCli = useRef(null);
	useEffect(() => {
		if (!user) return;

		sockCli.current = socket.init(SERVERLOCATION) || {};
		sockCli.current.on('teamMsg', (data) => {
			console.log("Received message from server");
			setText((prevText) => [
				...prevText,
				<h1 key={prevText.length} className="text-basicallydark">{`${data.sender}: ${data.msg}`}</h1>,
			]);
		});

		return () => sockCli.current.off('teamMsg');
	}, [user]);


	useEffect(() => {
		setTeamId(params.get('teamId'));
		setChannelName(params.get('channelName'));
	}, [params.get('teamId'), params.get('channelName')]);
	useEffect(() => {
		if (!user || !channelName) return;

		fb.getToken().then((token) => {
			axios.get(`${SERVERLOCATION}/api/teams/${teamId}/channels/${channelName}/messages`, {
				headers: { "Authorization": "Bearer " + token }
			}).then((res) => {
				console.log(res.data);
				let data = res.data;
				let msgs = data.map((messageData, i) => (
					<MessageItem
						key={i}
						sender={messageData.username}
						timestamp={fb.fromFbTimestamp(new Timestamp(messageData.sentAt.seconds, messageData.sentAt.nanoseconds)).toLocaleTimeString()}
						message={ (messageData.username !== "System") ? AES.decrypt(messageData.message, channelName).toString(enc) : messageData.message}
						reactions={{}}
						userId={messageData.senderID}
					/>
				));
				setText(msgs);
				console.log("Messages retrieved", msgs);
			}).catch((err) => console.log(err));
		});
	}, [user, teamId, channelName]);
	useEffect(() => {
		if (!user) return;

		const fetchUser = async () => {
			try {
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/users/${user.uid}`, {
					headers: { "Authorization": "Bearer " + token }
				});
				// Set user info with the data obtained from the response
				setUserInfo({ data: response.data });
			} catch (error) {
				console.error('Error fetching user data:', error);
				// Handle error, for example by setting a default user info
				setUserInfo({ data: { username: "User" } });
			}
		};

		fetchUser();
	}, [user]);
	useEffect(() => {
		if (!user) return;
		const fetchTeamInformation = async (teamId) => {
			try {
				// Make a GET request to retrieve information for the specified team
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Replace with the actual auth token
					},
				});

				// Check if the request was successful
				if (response.status === 200) {
					const teamData = {
						teamId,
						...response.data
					};

					// Update the userTeams state with the team information
					setTeamData(teamData);
					console.log("Team data:", teamData);
				} else {
					console.error('Failed to fetch team information:', response.statusText);
					// Handle the error and provide user feedback here
				}
			} catch (error) {
				console.error('Error fetching team information:', error);
				// Handle errors and provide user feedback here
			}
		};



		// Call the function to fetch team information when the component mounts
		fetchTeamInformation(teamId);
	}, [user, teamId, channelName, channelsUpdated]);

	const handleUpdated = () => {
		setChannelsUpdated(channelsUpdated + 1);
	}
	useEffect(() => {
		// Your update logic here, e.g., updating local state or refetching data
		console.log('Team data or user changed, update component:', teamData);
		// Update component state or perform actions based on the new props
		setChannelBarTeamData(teamData);
	}, [teamData]); // React to changes in these props

	const [text, setText] = useState([]);
	const sendTeamMsg = async (msg) => {
		if (!sockCli.current) {
			console.log('Socket is not initialized yet.');
			return;
		}

		 // Check and mask profanity in message
		 if (typeof msg === "string" && msg.trim() !== "") {
            msg = maskProfanity(msg, "*");
        } else if (
            typeof msg === "string" &&
            msg.trim() !== "" &&
            containsProfanity(msg, true)
        ) {
            console.error("Message contains profanity.");
            return;
        }

		let sentAt = new Date();
        let msgId = uuid.v4() + "D" + sentAt.getTime();


		const messageData = {
			id: msgId,
			senderID: user.uid,
			sender: userInfo.data.username,
			team: teamId,
			channel: channelName,
			msg: AES.encrypt(msg, channelName).toString(),
			sentAt: sentAt.toISOString(),
			reactions: [],
		};
``

		// Add the message to the real-time socket chat
		setText((prevText) => [
			...prevText,
			<MessageItem
				key={prevText.length}
				sender={messageData.sender}
				timestamp={sentAt.toLocaleTimeString()}
				message={msg}
				reactions={{}} // Add reactions if you have them
				userData={userInfo.data}
			/>,
		]);

		sockCli.current.emit('teamMsg', messageData); // Send the message to the server
	};
	useEffect(() => {
		scrollToBottom();
	}, [text]);


	if (loading || !user ) {
		return (
				<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
					<Lottie animationData={LoadingJSON} style={{ width: 300, height: 300 }} />
					<h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
				</div>
		);
	}


	return (
		<>
			{/* // <div className="flex h-full w-full drop-shadow-lg"> */}
			<div className="flex flex-row flex-grow">
				{/* <Sidebar /> */}
				<ChannelBar
					user={userInfo}
					userUID={user.uid}
					teamData={channelBarTeamData}
					onUpdated={handleUpdated}

				/>
				<div className="flex flex-col w-full  relative">
					<div className="w-full h-1/6">
						<div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
							<Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
								<h1 className='text-xl font-semibold text-primary items-center justify-center flex-row'>{<ShortTextIcon style={{ color: '#30475E', opacity: '0.7' }} fontSize="large" />}{channelName}</h1>
							</Toolbar>
						</div>
						<div className="w-full h-1/6">
							<div className="">
								<div className="p-5 w-full scrollbar-thin scrollbar-thumb-primary text-basicallydark overflow-y-scroll message-container">
									{text}
									<div ref={messagesEndRef} />
								</div>


							</div>
						</div>
					</div>

					<div className="absolute z-10 inset-x-0 bottom-5 mx-5 text-white bg-baiscallylight">
						<MessageBox onSendMessage={sendTeamMsg}  callback={sendTeamMsg} />
					</div>
				</div>

			</div>
			{/* <ChannelBar /> */}
		</>
	)
	{/* </div> */ }
}
