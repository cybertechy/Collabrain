"use client";

import Template from "@/components/ui/template/template";
import Quill from "./quill";
const socket = require("_socket/socket");
const fb = require("_firebase/firebase");
import "./quillStyle.css";
import { useRef, useState, useEffect } from "react";

export default function Editor()
{
	const [user, loading] = fb.useAuthState();
	const [value, setValue] = useState("");
	const quillRef = useRef(null);

	let sock_cli = useRef(null);
	useEffect(() =>
	{
		if (!user) return;

		sock_cli.current = socket.init('http://localhost:8080') || {};
		sock_cli.current.on('get-doc-changes', (delta) =>
		{
			quillRef.current.getEditor().updateContents(delta);
		});

		return () => sock_cli.current.off('get-doc-changes');
	}, [user]);

	return (
		<Template>
			<div className="bg-[#F3F3F3] h-full">
				<div className="editor-container bg-[#F3F3F3] overflow-auto">
					<Quill socket={sock_cli} quillRef={quillRef} value={value} setValue={setValue}/>
				</div>
			</div>
		</Template>
	);
}