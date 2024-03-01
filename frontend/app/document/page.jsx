"use client";

import dynamic from "next/dynamic";
const { useRouter } = require("next/navigation");
import Template from "_components/ui/template/template";
const Quill = dynamic(() => import("./quill"), { ssr: false });
import axios from 'axios';
const socket = require("_socket/socket");
const fb = require("_firebase/firebase");
import "./quillStyle.css";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import FileToolbar from "_components/ui/FileToolbar/fileToolbar";
import Comments from "./comments";

export default function Editor()
{
	const [user, loading] = fb.useAuthState();
	const searchParams = useSearchParams();
	const [userData, setUserData] = useState({});
	const [value, setValue] = useState("Loading...");
	const [isDisabled, setIsDisabled] = useState(true);
	const [ociID, setOciID] = useState("");
	const [docName, setDocName] = useState("");
	const [showCommentButton, setShowCommentButton] = useState(false);
	const quillRef = useRef(null);
	const router = useRouter();

	if (searchParams.get('id') == null)
	{
		// No document selected
		// Redirect to dashboard
		router.push("/dashboard");
	}

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

	// Load document
	useEffect(() =>
	{
		if (!user || !sockCli.current)
			return;

		const id = searchParams.get('id');
		// Get document
		fb.getToken().then(token =>
		{
			axios.get(`http://localhost:8080/api/docs/${id}`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			}).then(res =>
			{
				setDocName(res.data.name);
				setOciID(res.data.data);
				setValue(JSON.parse(res.data.contents));

				if (res.data.access[userData.uid] != "viewer")
					setIsDisabled(false);
			});
		});

		sockCli.current.emit('join-doc', id);
		return () => sockCli.current.emit('leave-doc', id);
	}, [user]);

	if (loading)
	{
		// Not signed in
		return (
			<Template>
				<div className="bg-[#F3F3F3] h-full">
					<div className="editor-container bg-[#F3F3F3]">
						<div className="text-center text-3xl mt-20">Loading...</div>
					</div>
				</div>
			</Template>
		);
	}

	return (
		<Template>
			<FileToolbar name={docName} />
			<div className="editor-container bg-[#F3F3F3] overflow-auto">
				<Quill socket={sockCli} user={userData} quillRef={quillRef}
					value={value} setValue={setValue} isDisabled={isDisabled}
					docID={searchParams.get('id')} ociID={ociID}
					setShowCommentButton={setShowCommentButton} />
				{/* <Comments /> */}
			</div>
		</Template>
	);
}