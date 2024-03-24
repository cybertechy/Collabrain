"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
const { useRouter, useSearchParams } = require("next/navigation");

import axios from 'axios';
import Lottie from "lottie-react";

const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import Template from "_components/ui/template/template";
import FileToolbar from "_components/ui/FileToolbar/fileToolbar";
const Quill = dynamic(() => import("./quill"), { ssr: false });
import "./quillStyle.css";

import SearchingJSON from "../../public/assets/json/Searching.json";
import LoadingJSON from "../../public/assets/json/Loading.json";
import ErrorJSON from "../../public/assets/json/Error.json";
import WorkingJSON from "../../public/assets/json/Working.json";

export default function Editor()
{
	const router = useRouter();
	const [user, loading] = fb.useAuthState();
	const searchParams = useSearchParams();

	const [userData, setUserData] = useState();
	const [fileData, setFileData] = useState();
	const [ociID, setOciID] = useState("");
	const [loadFailed, setLoadFailed] = useState(null);

	const quillRef = useRef(null);
	const [value, setValue] = useState("Loading...");
	const [isDisabled, setIsDisabled] = useState(true);

	const [docName, setDocName] = useState("");
	const [showCommentButton, setShowCommentButton] = useState(false);
	const [isSaved, setIsSaved] = useState(true);

	// Redirect to dashboard if no document is specified
	if (searchParams.get('id') == null)
	{
		// No document selected
		// Redirect to dashboard
		router.push("/dashboard");
	}

	// Generate random color for cursor
	const randomColor = () =>
	{
		const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		// Generate random hue and saturation
		const h = randomInt(0, 360);
		const s = randomInt(42, 98);
		// Ensure enough contrast with white text
		let l;
		do
		{
			l = randomInt(40, 90);
		} while (Math.abs(l - 100) < 30); // Ensure the color is not too close to white
		return `hsl(${h},${s}%,${l}%)`;
	};

	// Setup socket and event listeners
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
		if (!user || !userData || !sockCli.current)
			return;

		const id = searchParams.get('id');
		// Get document
		fb.getToken().then(token =>
		{
			axios.get(`http://localhost:8080/api/docs/${id}`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
				.then(res =>
				{
					setFileData(res.data);
					setDocName(res.data.name);
					setOciID(res.data.data);
					setValue(JSON.parse(res.data.contents));

					if (res.data.access[userData.uid] != "view")
						setIsDisabled(false);
				})
				.catch(err =>
				{
					console.log(err.response.data.error);
					setLoadFailed(err.response.data.error);
				});
		});

		sockCli.current.emit('join-doc', id);
		return () => sockCli.current.emit('leave-doc', id);
	}, [user, userData]);

	// Signing in animation
	if (loading || !user || !userData)
	{
		return (
			<Template>
				<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
					<Lottie animationData={LoadingJSON} style={{ width: 300, height: 300 }} />
					<h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
				</div>
			</Template>
		);
	}

	// Failed to load animation
	if (loadFailed)
	{
		return (
			<Template>
				<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
					<Lottie animationData={ErrorJSON} style={{ width: 300, height: 300 }} />
					<h1 className="text-2xl font-bold text-primary px-10 text-center"> {loadFailed} </h1>
				</div>
			</Template>
		);
	}

	// Loading animation
	if (!fileData || !ociID || !docName)
	{
		return (
			<Template>
				<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
					<Lottie animationData={WorkingJSON} style={{ width: 300, height: 300 }} />
					<h1 className="text-2xl font-bold text-primary px-10 text-center"> Working to load the Doc ... </h1>
				</div>
			</Template>
		);

	}

	return (
		<Template>
			{user && fileData &&
				<FileToolbar userID={user.uid} name={docName} commentsEnabled={true} showCommentButton={showCommentButton}
					fileType="doc" fileID={searchParams.get('id')} fileData={fileData} isSaved={isSaved} />
			}

			<div className="relative flex overflow-y-auto h-fit">
				<div className="editor-container flex-1 bg-[#F3F3F3] h-fit">
					<Quill socket={sockCli} user={userData} quillRef={quillRef}
						value={value} setValue={setValue} isDisabled={isDisabled}
						docID={searchParams.get('id')} ociID={ociID}
						setShowCommentButton={setShowCommentButton} setIsSaved={setIsSaved} />
				</div>
			</div>
		</Template>
	);
}