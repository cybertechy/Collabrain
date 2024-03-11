import { useEffect, useState, useRef } from "react";

const socket = require("_socket/socket");
import { Peer } from "peerjs";

export default function Call()
{
	// const [peers, setPeers] = useState({});
	const [peerID, setPeerID] = useState(null);
	const [remotePeerID, setRemotePeerID] = useState(null);
	const peer = useRef(null);

	const addVideoStream = (video, stream) =>
	{
		video.srcObject = stream;
		video.addEventListener("loadedmetadata", () => { video.play(); });
		document.querySelector("#video-grid").append(video);
	};

	const connectToNewUser = (userId, stream) =>
	{
		const call = peer.current.call(userId, stream);
		const video = document.createElement("video");
		call.on("stream", userVideoStream => { addVideoStream(video, userVideoStream); });
		call.on("close", () => { video.remove(); });
		setPeers(prev => ({ ...prev, [userId]: call }));
	};

	let sockCli = useRef(null);
	let myVideo = useRef(null);
	useEffect(() =>
	{
		// Setup socket and event listeners
		sockCli.current = socket.init('http://localhost:8080/');

		if (peer.current)
			return;

		peer.current = new Peer();
		peer.current.on("open", id => { setPeerID(id); });
	}, []);

	// const call = (remotePeer) =>
	// {
	// 	navigator.mediaDevices.getUserMedia(
	// 		{ video: true, audio: true },
	// 		(stream) =>
	// 		{
	// 			const call = peer.call(remotePeer, stream);
	// 			call.on("stream", (remoteStream) =>
	// 			{
	// 				// Show stream in some <video> element.
	// 				const video = document.createElement("video");
	// 				video.muted = true;
	// 				video.playsInline = true;
	// 				video.srcObject = remoteStream;
	// 				video.play();
	// 				document.querySelector("#video-grid").append(video);
	// 			});
	// 		},
	// 		(err) => { console.error("Failed to get local stream", err); },
	// 	);
	// };

	useEffect(() =>
	{
		// // Setup socket and event listeners
		// sockCli.current = socket.init('http://localhost:8080/');

		// // Setup peerjs connection
		// peer.current = new Peer(undefined, {
		// 	host: "	",
		// 	port: 3001,
		// });

		// peer.current.on("open", id =>
		// {
		// 	console.log("Hello##############");
		// 	sockCli.current.emit('join-call', { room: "room1", id: id });
		// });

		// // Setup video stream
		// if (myVideo.current || !sockCli.current || !peer.current)
		// 	return;

		// myVideo.current = document.createElement("video");
		// myVideo.current.muted = true;
		// myVideo.current.playsInline = true;
		// navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		// 	.then(stream =>
		// 	{
		// 		// Add video stream
		// 		addVideoStream(myVideo.current, stream);

		// 		// Listen for user join call
		// 		console.log("Listening for user join call...");
		// 		sockCli.current.on('user-join-call', userId =>
		// 		{
		// 			console.log("User joined call: ", userId);
		// 			connectToNewUser(userId, stream);
		// 		});

		// 		// Listen for peer call
		// 		peer.current.on('call', call =>
		// 		{
		// 			call.answer(stream);
		// 			const video = document.createElement('video');
		// 			call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream); });
		// 		});
		// 	});

		// sockCli.current.on('user-leave-call', userId =>
		// {
		// 	if (peers[userId])
		// 		peers[userId].close();
		// });

		// return () =>
		// {
		// 	sockCli.current.off('user-join-call');
		// 	sockCli.current.off('user-leave-call');
		// 	peer.current.destroy();
		// };
	}, []);

	// Temp
	useEffect(() =>
	{
		if (peerID == null)
			return;

		alert(peerID);
	}, [peerID]);

	return (
		<div>
			{/* Call widget */}
			<div className="flex flex-col">
				<input type="text" placeholder="Enter a peer ID" onChange={e => setRemotePeerID(e.target.value)} />
				<button className="bg-green-500 text-white p-2 rounded-md" onClick={() => call(remotePeerID)}>Start Call</button>
			</div>
		</div>
	);
}