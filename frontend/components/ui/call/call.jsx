import { useEffect, useState, useRef } from "react";

const socket = require("_socket/socket");
import { Peer } from "peerjs";

export default function Call()
{
	let myPeer = useRef(null);
	let sockCli = useRef(null);
	let [peers, setPeers] = useState({});

	const connectToNewUser = (userId, stream) =>
	{
		console.log(`### Calling user... ###`);
		const call = myPeer.current.call(userId, stream);
		const video = document.createElement('video');
		video.playsInline = true;
		video.id = userId;
		call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream); });
		call.on('close', () => { video.remove(); });
		setPeers({ ...peers, [userId]: call });
	};

	const addVideoStream = (video, stream) =>
	{
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => { video.play(); });
		document.querySelector('#video-grid').append(video);
	};

	useEffect(() =>
	{
		// Setup socket
		sockCli.current = socket.init('https://0h32zx14-8080.asse.devtunnels.ms/');

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
				addVideoStream(myVideo, stream);

				myPeer.current.on('call', call =>
				{
					console.log(`### Answering call... ###`);
					call.answer(stream);
					const video = document.createElement('video');
					video.playsInline = true;
					video.id = call.peer;
					call.on('stream', userVideoStream => { addVideoStream(video, userVideoStream); });
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

			// Remove video
			document.getElementById(userId).remove();
		});

		myPeer.current.on('open', id =>
		{
			console.log(`### user id: ${id} ###`);
			sockCli.current.emit('join-call', "room1", id);
		});
	}, []);

	return (
		<div>
			Call
		</div>
	);
}