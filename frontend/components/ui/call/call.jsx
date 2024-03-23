import { useEffect, useState, useRef } from "react";
import socket from "_socket/socket";
import CallIcon from '@mui/icons-material/Call';
import { usePathname, useSearchParams } from 'next/navigation';
import fb from "_firebase/firebase";
import MicIcon from "@mui/icons-material/MicRounded";
import VideocamIcon from "@mui/icons-material/VideocamRounded";
import CallEndIcon from "@mui/icons-material/CallEndRounded";
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LaunchIcon from '@mui/icons-material/Launch';
const { Peer } = require('peerjs');
import { useVideoCall } from "./zustand";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
export default function Call(props)
{
	const { callVideoStreams, myPeer, micEnabled, videoEnabled, showCallScreen,
		setMyPeer, setShowCallScreen, setCallVideoStreams, addCallVideoStream, removeCallVideoStream,
		toggleAudio, toggleVideo, room, setRoom, stream, setStream,
		inCall, setInCall, sockCli, setSockCli, receivingCall, setReceivingCall } = useVideoCall();

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [peers, setPeers] = useState({});
	const [user, loading] = fb.useAuthState();

	const connectToNewUser = (userId, stream) =>
	{
		console.log(`### Calling user... ${userId} ###`);
		const call = myPeer.call(userId, stream);
		const video = document.createElement('video');
		video.playsInline = true;
		video.id = userId;
		call.on('stream', userVideoStream => addVideoStream(video, userVideoStream, userId));
		call.on('close', () => { video.remove(); });
		setPeers({ ...peers, [userId]: call });
	};

	const addVideoStream = (video, stream, userID) =>
	{
		video.srcObject = stream;
		video.className = "rounded-md aspect-video object-cover w-auto h-full";
		video.addEventListener('loadedmetadata', () => { video.play(); });
		// document.querySelector('#video-grid').append(video);
		// setCallVideoStreams(prevState => ({
		// 	...prevState,
		// 	[userID]: stream
		// }));
		addCallVideoStream(userID, stream);
	};

	const startCall = async () =>
	{
		// Setup peer
		if (myPeer)
			return;

		setMyPeer(new Peer({ host: 'peer-server.cybertech13.eu.org', secure: true, port: 443 }));
		// Create room with random uid
		const roomID = uuidv4();
		setRoom(roomID);

		const token = await fb.getToken();
		let target = null;
		let targetID = null;

		// Get target
		if (pathname === "/chat") // For teams
		{
			target = "team";
			targetID = searchParams.get("teamId");
		}
		else if (pathname === "/messages") // For direct messages
		{
			target = "chat";
			targetID = searchParams.get("chatID");
		}

		// Create call on db
		const res = await axios.post(`${SERVERLOCATION}/api/calls`, {
			room: roomID,
			target: target,
			targetID: targetID
		}, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
	};

	const joinCall = async () =>
	{
		// Setup peer
		if (myPeer)
			return;

		setMyPeer(new Peer({ host: 'peer-server.cybertech13.eu.org', secure: true, port: 443 }));
	};

	useEffect(() =>
	{
		if (!myPeer || !room)
			return;

		myPeer.on('error', err =>
		{
			console.log("### Peer error ###", err);
		});

		myPeer.on('disconnected', () =>
		{
			console.log("### Peer disconnected ###");
			if (stream)
				stream.getTracks().forEach(track => track.stop());
		});

		// Add video stream
		const myVideo = document.createElement('video');
		myVideo.muted = true;
		myVideo.playsInline = true;

		myPeer.on('open', async id =>
		{
			console.log(`### user id: ${id} ###`);

			await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
				.then(stream =>
				{
					setStream(stream);
					addVideoStream(myVideo, stream, "self");

					myPeer.on('call', call =>
					{
						console.log(`### Answering call... ###`);
						call.answer(stream);
						const video = document.createElement('video');
						video.playsInline = true;
						video.id = call.peer;
						call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream, call.peer); });
					});

					sockCli.on('user-joined-call', userId =>
					{
						console.log(`### user ${userId} joined call ###`);
						connectToNewUser(userId, stream);
					});

					sockCli.on('user-left-call', userId =>
					{
						if (peers[userId])
							peers[userId].close();

						console.log("### user left call ###");

						let newStreams = { ...callVideoStreams };
						delete newStreams[userId];

						// setCallVideoStreams(newStreams);
						removeCallVideoStream(userId);
					});
				});

			sockCli.emit('join-call', room, id);
		});

		setShowCallScreen(true);
		setInCall(true);
	}, [myPeer, room]);

	const leaveCall = () =>
	{
		console.log("callScreen: ", showCallScreen,
			"myPeer: ", myPeer,
			"callVideoStreams: ", callVideoStreams,
			"stream: ", stream,
			"inCall: ", inCall);

		setShowCallScreen(false);
		if (myPeer)
			myPeer.destroy();

		setMyPeer(null);
		setCallVideoStreams({});

		sockCli.emit('leave-call');
		// STREAM IS null when called from call screen: FIX THIS
		if (stream)
			stream.getTracks().forEach(track => track.stop());
		setInCall(false);
		setStream(null);
	};

	useEffect(() =>
	{
		if (!user || loading)
			return;

		// Setup socket
		setSockCli(socket.init(SERVERLOCATION));
	}, [user, loading]);

	useEffect(() =>
	{
		console.log("call video streams: ", callVideoStreams);
	}, [callVideoStreams]);

	useEffect(() =>
	{
		if (!user)
			return;

		fb.getToken().then(token =>
		{
			const targetID = searchParams.get("teamId") || searchParams.get("chatID");
			let target = null;
			if (pathname === "/chat")
				target = "team";
			else if (pathname === "/messages")
				target = "chat";

			// Chek if a call is ongoing
			axios.get(`${SERVERLOCATION}/api/calls/${target}/${targetID}`, {
				headers
					: {
					authorization: `Bearer ${token}`
				}
			})
				.then(res =>
				{
					if (!res.data)
						return;

					setReceivingCall(true);
					console.log(res);
					setRoom(res.data.room);
				});
		});
	}, [user]);

	return (
		<div>
			{
				!inCall ?
					(pathname == "/messages" && (searchParams.get("chatID") != null)) || pathname === "/chat" ?
						(
							!receivingCall ?
								<button className="border border-white text-white hover:text-white hover:bg-green-500 hover:border-green-500 font-bold px-3 py-2 rounded"
									onClick={() => { startCall("room1"); }}>
									<CallIcon />
								</button>
								:
								<button className="font-normal border border-green-500 bg-green-500 text-white hover:text-white hover:bg-green-600 hover:border-green-600 font-bold px-3 py-2 rounded"
									onClick={() => { joinCall("room1"); }}>
									Join Call
									<CallIcon className="ml-2" />
								</button>
						)
						:
						<></>
					:
					// Button to show call with mic, video and leave buttons
					<div className="border border-white text-black bg-white font-bold p-1 rounded">
						<button className="bg-green-500 hover:bg-green-600 p-2 rounded text-white"
							onClick={() => props.setShowCallScreen(true)}>
							<LaunchIcon />
						</button>
						<button className="p-2 rounded"
							onClick={toggleAudio}>
							{
								micEnabled ?
									<MicIcon style={{ fontSize: 28, color: "black" }} /> :
									<MicOffIcon style={{ fontSize: 28, color: "red" }} />
							}
						</button>
						<button className="p-2 rounded"
							onClick={toggleVideo}>
							{
								videoEnabled ?
									<VideocamIcon style={{ fontSize: 28, color: "black" }} /> :
									<VideocamOffIcon style={{ fontSize: 28, color: "red" }} />
							}
						</button>
						<button className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
							onClick={() => leaveCall()}>
							<CallEndIcon />
						</button>
					</div>
			}
		</div>
	);
}