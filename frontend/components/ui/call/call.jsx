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
import { useTTS } from "@/app/utils/tts/TTSContext";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
export default function Call(props)
{
	const { speak, stop, isTTSEnabled } = useTTS();
	const { callVideoStreams, myPeer, micEnabled, videoEnabled, showCallScreen,
		setMyPeer, setShowCallScreen, setCallVideoStreams, addCallVideoStream, removeCallVideoStream,
		toggleAudio, toggleVideo, room, setRoom, stream, setStream, 
		inCall, setInCall, sockCli, setSockCli } = useVideoCall();
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

	const joinCall = async (room) =>
	{
		// Setup peer
		if (myPeer)
			return;

		setMyPeer(new Peer());
		setRoom(room);
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

	return (
		<div>
			{
				!inCall ?
					(pathname == "/messages" && (searchParams.get("chatID") != null)) || pathname === "/chat" ?
						<button className="border border-white text-white hover:text-white hover:bg-green-500 hover:border-green-500 font-bold px-3 py-2 rounded"
							onClick={() => { joinCall("room1"); }}
							onMouseEnter={() => isTTSEnabled && speak("Call button")}
                        	onMouseLeave={stop}>
							<CallIcon />
						</button> :
						<></>
					:
					// Button to show call with mic, video and leave buttons
					<div className="border border-white text-black bg-white font-bold p-1 rounded">
						<button className="bg-green-500 hover:bg-green-600 p-2 rounded text-white"
							onClick={() => setShowCallScreen(true)}>
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