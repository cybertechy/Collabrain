"use client";

import InfoBar from "./infoBar";
import MessageBox from "./messageBox";
import Sidebar from "./sidebar";

const { isAuth } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require('next/navigation');

export default function ChatRoom()
{
	const router = useRouter();

	// if (!isAuth())
	// 	router.push('/'); // Redirect to dashboard

	return (
		<div className="flex h-full w-full">
			<Sidebar />
			<div className="relative h-full w-full bg-white"> {/* Chat room */}

				<div className="flex flex-col h-full w-full">
					<div className="flex-1 overflow-y-auto">
						{/* Chat messages */}
					</div>
					<div className="flex-none">
						{/* Message box */}
					</div>
				</div>

				<div className="absolute inset-x-0 bottom-5 mx-5 drop-shadow-lg shadow-slate-950">
					<MessageBox />
				</div>

			</div>
			<InfoBar />
		</div>
	);
}