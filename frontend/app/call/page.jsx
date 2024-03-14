"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const fb = require("_firebase/firebase");
const CallComp = dynamic(() => import("@/components/ui/call/call"), { ssr: false });
import CallScreen from "_components/ui/call/callScreen";
import Template from "@/components/ui/template/template";

export default function Call(props)
{
	const [user, loading] = fb.useAuthState();
	const [numUsers, setNumUsers] = useState(1);

	if (loading)
	{
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}

	return (
		<Template>
			<div className="flex-col justify-center w-full h-full">
				<CallComp setNumUsers={setNumUsers} numUsers={numUsers} />
				<CallScreen numUsers={numUsers} />
			</div>
		</Template>
	);
}