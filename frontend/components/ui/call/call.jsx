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

//dynamic import for peerjs
const { Peer } = require('peerjs');

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
export default function Call(props)
{
	const pathname = usePathname();
	const searchParams = useSearchParams();
	let myPeer = useRef(null);
	let sockCli = useRef(null);
	const [peers, setPeers] = useState({});
	const [inCall, setInCall] = useState(false);
	const [user, loading] = fb.useAuthState();
	const [stream, setStream] = useState(null);

	const connectToNewUser = (userId, stream) =>
	{
		console.log(`### Calling user... ###`);
		const call = myPeer.current.call(userId, stream);
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
		props.setCallVideoStreams(prevState => ({
			...prevState,
			[userID]: stream
		}));
	};

	const joinCall = (room) =>
	{
		// Setup peer
		if (myPeer.current)
			return;

		myPeer.current = new Peer();

		// if peerjs fails, try to reconnect
		myPeer.current.on('error', err =>
		{
			alert(`### PeerJS error: ${err} ###`);
			myPeer.current.reconnect();
		});

		// Add video stream
		const myVideo = document.createElement('video');
		myVideo.muted = true;
		myVideo.playsInline = true;
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then(stream =>
			{
				setStream(stream);
				addVideoStream(myVideo, stream, "self");

				myPeer.current.on('call', call =>
				{
					console.log(`### Answering call... ###`);
					call.answer(stream);
					const video = document.createElement('video');
					video.playsInline = true;
					video.id = call.peer;
					call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream, call.peer); });
				});

				sockCli.current.on('user-joined-call', userId =>
				{
					console.log(`### user ${userId} joined call ###`);
					setTimeout(connectToNewUser, 1000, userId, stream);
				});
			});

		sockCli.current.on('user-left-call', userId =>
		{
			if (peers[userId])
				peers[userId].close();

			console.log("### user left call ###");

			props.setCallVideoStreams(prevState =>
			{
				const newStreams = { ...prevState };
				delete newStreams[userId];
				return newStreams;
			});
		});

		myPeer.current.on('open', id =>
		{
			console.log(`### user id: ${id} ###`);
			sockCli.current.emit('join-call', room, id);
		});

		props.setShowCallScreen(true);
		setInCall(true);
	};

	const leaveCall = () =>
	{
		props.setShowCallScreen(false);
		if (myPeer.current)
			myPeer.current.destroy();

		myPeer.current = null;

		props.setCallVideoStreams({});

		sockCli.current.emit('leave-call');
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
		sockCli.current = socket.init(SERVERLOCATION) || {};

		// Set leave call function pointer
		props.setLeaveCall(() => leaveCall);
	}, [user, loading]);

	return (
		<div>
			{
				!inCall ?
					(pathname == "/messages" && (searchParams.get("chatID") != null)) || pathname === "/chat" ?
						<button className="border border-white text-white hover:text-white hover:bg-green-500 hover:border-green-500 font-bold px-3 py-2 rounded"
							onClick={() => { joinCall("room1"); }}>
							<CallIcon />
						</button> :
						<></>
					:
					// Button to show call with mic, video and leave buttons
					<div className="border border-white text-black bg-white font-bold p-1 rounded">
						<button className="bg-green-500 hover:bg-green-600 p-2 rounded text-white"
							onClick={() => props.setShowCallScreen(true)}>
							<LaunchIcon />
						</button>
						<button className="p-2 rounded"
							onClick={props.toggleAudio}>
							{
								props.micEnabled ?
									<MicIcon style={{ fontSize: 28, color: "black" }} /> :
									<MicOffIcon style={{ fontSize: 28, color: "red" }} />
							}
						</button>
						<button className="p-2 rounded"
							onClick={props.toggleVideo}>
							{
								props.videoEnabled ?
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