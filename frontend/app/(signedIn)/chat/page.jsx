"use client";

import { useState, useEffect, useRef } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MessageBox from "./messageBox";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import ChannelBar from "_components/ui/chatsComponents/channelBar";
import MessageItem from "_components/ui/messagesComponents/MessageItem";
import Template from "_components/ui/template/template";
const { useRouter, useSearchParams } = require('next/navigation');
const axios = require("axios");
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ShortTextIcon from '@mui/icons-material/ShortText'; // This can act as a hash
import { set } from "lodash";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

export default function ChatRoom()
{

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
	const scrollToBottom = () =>
	{
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	let sockCli = useRef(null);
	useEffect(() =>
	{
		if (!user) return;

		sockCli.current = socket.init(SERVERLOCATION) || {};
		sockCli.current.on('teamMsg', (data) =>
		{
			console.log("Received message from server");
			setText((prevText) => [
				...prevText,
				<h1 key={prevText.length} className="text-basicallydark">{`${data.sender}: ${data.msg}`}</h1>,
			]);
		});

		return () => sockCli.current.off('teamMsg');
	}, [user]);


	useEffect(() =>
	{
		setTeamId(params.get('teamId'));
		setChannelName(params.get('channelName'));
	}, [params.get('teamId'), params.get('channelName')]);
	useEffect(() =>
	{
		if (!user) return;

		fb.getToken().then((token) =>
		{
			axios.get(`${SERVERLOCATION}/api/teams/${teamId}/channels/${channelName}/messages`, {
				headers: { "Authorization": "Bearer " + token }
			}).then((res) =>
			{
				console.log(res.data);
				let data = res.data;
				let msgs = data.map((messageData, i) => (
					<MessageItem
						key={i}
						sender={messageData.username}
						timestamp={fb.fromFbTimestamp(new Timestamp(messageData.sentAt.seconds, messageData.sentAt.nanoseconds)).toLocaleTimeString()}
						message={messageData.message}
						reactions={{}}
						userId={messageData.senderID}
					/>
				));
				setText(msgs);
				console.log("Messages retrieved", msgs);
			}).catch((err) => console.log(err));
		});
	}, [user, teamId, channelName]);
	useEffect(() =>
	{
		if (!user) return;

		const fetchUser = async () =>
		{
			try
			{
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/users/${user.uid}`, {
					headers: { "Authorization": "Bearer " + token }
				});
				// Set user info with the data obtained from the response
				setUserInfo({ data: response.data });
			} catch (error)
			{
				console.error('Error fetching user data:', error);
				// Handle error, for example by setting a default user info
				setUserInfo({ data: { username: "User" } });
			}
		};

		fetchUser();
	}, [user]);
	useEffect(() =>
	{
		const fetchTeamInformation = async (teamId) =>
		{
			try
			{
				// Make a GET request to retrieve information for the specified team
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Replace with the actual auth token
					},
				});

				// Check if the request was successful
				if (response.status === 200)
				{
					const teamData = {
						teamId,
						...response.data
					};

					// Update the userTeams state with the team information
					setTeamData(teamData);
					console.log("Team data:", teamData);
				} else
				{
					console.error('Failed to fetch team information:', response.statusText);
					// Handle the error and provide user feedback here
				}
			} catch (error)
			{
				console.error('Error fetching team information:', error);
				// Handle errors and provide user feedback here
			}
		};



		// Call the function to fetch team information when the component mounts
		fetchTeamInformation(teamId);
	}, [user, teamId, channelName, channelsUpdated]);

	const handleUpdated = () =>
	{
		setChannelsUpdated(channelsUpdated + 1);
	};
	useEffect(() =>
	{
		// Your update logic here, e.g., updating local state or refetching data
		console.log('Team data or user changed, update component:', teamData);
		// Update component state or perform actions based on the new props
		setChannelBarTeamData(teamData);
	}, [teamData]); // React to changes in these props

	const [text, setText] = useState([]);
	const sendTeamMsg = async (msg) =>
	{
		if (!sockCli.current)
		{
			console.log('Socket is not initialized yet.');
			return;
		}

		let token = await fb.getToken();
		let userData = await axios.get(`${SERVERLOCATION}/api/users/${user.uid}`,
			{ headers: { "Authorization": "Bearer " + token } });


		let sentAt = new Date();
		const messageData = {
			senderID: fb.getUserID(),
			sender: userInfo.data.username,
			team: teamId,
			channel: channelName,
			msg: msg,
			sentAt: fb.toFbTimestamp(sentAt),
		};
		const sentAtDate = messageData.sentAt.toDate();


		// Add the message to the real-time socket chat
		setText((prevText) => [
			...prevText,
			<MessageItem
				key={prevText.length}
				sender={messageData.sender}
				timestamp={sentAtDate.toLocaleTimeString()}
				message={messageData.msg}
				reactions={{}} // Add reactions if you have them
				userData={userInfo.data}
			/>,
		]);

		sockCli.current.emit('teamMsg', messageData); // Send the message to the server
	};
	useEffect(() =>
	{
		scrollToBottom();
	}, [text]);
	if (loading || !user)
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
						<MessageBox callback={sendTeamMsg} />
					</div>
				</div>

			</div>
			{/* <ChannelBar /> */}
		</>
	);
}