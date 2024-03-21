"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
const { useSearchParams } = require("next/navigation");
import { useRouter } from "next/navigation";

import axios from 'axios';
import Lottie from "lottie-react";

const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import FileToolbar from "_components/ui/FileToolbar/fileToolbar";
const Quill = dynamic(() => import("./quill"), { ssr: false });
import "./quillStyle.css";

import LoadingJSON from "_public/assets/json/Loading.json";
import ErrorJSON from "_public/assets/json/Error.json";
import WorkingJSON from "_public/assets/json/Working.json";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

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
	useEffect(() =>
	{
		if (searchParams.get('id') == null)
		{
			// No document selected
			// Redirect to dashboard
			if (router?.push) router.push("/dashboard");
		}
	}, [searchParams, router]);

	// Generate random color for cursor
	const randomColor = () =>
	{
		const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		var h = randomInt(0, 360);
		var s = randomInt(42, 98);
		var l = randomInt(40, 90);
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
			axios.get(`${SERVERLOCATION}/api/users/${user.uid}`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			}).then(res => setUserData(res.data));
		});

		// Setup socket and event listeners
		sockCli.current = socket.init(SERVERLOCATION) || {};
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
			axios.get(`${SERVERLOCATION}/api/docs/${id}`, {
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
			<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
				<Lottie animationData={LoadingJSON} style={{ width: 300, height: 300 }} />
				<h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
			</div>
		);
	}

	// Failed to load animation
	if (loadFailed)
	{
		return (
			<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
				<Lottie animationData={ErrorJSON} style={{ width: 300, height: 300 }} />
				<h1 className="text-2xl font-bold text-primary px-10 text-center"> {loadFailed} </h1>
			</div>
		);
	}

	// Loading animation
	if (!fileData || !ociID || !docName)
	{
		return (
			<div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
				<Lottie animationData={WorkingJSON} style={{ width: 300, height: 300 }} />
				<h1 className="text-2xl font-bold text-primary px-10 text-center"> Working to load the Doc ... </h1>
			</div>
		);
	}

	return (
		<div>
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
		</div>
	);
}