"use client";

import Template from "@/components/ui/template/template";
import Quill from "./quill";
import axios from 'axios';
const socket = require("_socket/socket");
const fb = require("_firebase/firebase");
import "./quillStyle.css";
import { useRef, useState, useEffect } from "react";


export default function Editor()
{
	const [user, loading] = fb.useAuthState();
	const [userData, setUserData] = useState({});
	const [value, setValue] = useState("");
	const quillRef = useRef(null);

	const randomColor = () =>
	{
		const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

		var h = randomInt(0, 360);
		var s = randomInt(42, 98);
		var l = randomInt(40, 90);
		return `hsl(${h},${s}%,${l}%)`;
	};

	let sockCli = useRef(null);
	useEffect(() =>
	{
		if (!user) return;

		// Get user data
		fb.getToken().then(token =>
		{
			axios.get(`http://localhost:8080/api/users/${user.uid}`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			}).then(res => setUserData(res.data));
		});

		// Setup socket and event listeners
		sockCli.current = socket.init('http://localhost:8080') || {};
		sockCli.current.on('get-doc-changes', delta =>
		{
			quillRef.current.getEditor().updateContents(delta);
		});

		sockCli.current.on('get-doc-cursor-changes', data =>
		{
			// Create a cursor for the user if it doesn't exist
			const cursor = quillRef.current.getEditor().getModule('cursors');
			cursor.createCursor(data.username, data.username, randomColor()); // Username is id since it's unique
			cursor.moveCursor(data.username, data.range);
		});

		// Cleanup event listeners
		return () =>
		{
			sockCli.current.off('get-doc-changes');
			sockCli.current.off('get-doc-cursor-changes');
		};
	}, [user]);

	return (
		<Template>
			<div className="bg-[#F3F3F3] h-full">
				<div className="editor-container bg-[#F3F3F3] overflow-auto">
					<Quill socket={sockCli} user={userData} quillRef={quillRef} value={value} setValue={setValue} />
				</div>
			</div>
		</Template>
	);
}