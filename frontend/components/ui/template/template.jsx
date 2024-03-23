import React, { useState, useEffect, useRef, use } from "react";
import Sidebar from "./sidebar/sidebar";
import Navbar from "./navbar/navbar";
import dynamic from "next/dynamic";
const CallScreen = dynamic(() => import("_components/ui/call/callScreen"), { ssr: false });
import { useVideoCall } from "_components/ui/call/zustand";

const Template = ({ children }) =>
{
	const { showCallScreen } = useVideoCall();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className="flex flex-col h-screen bg-basicallylight">

			<div className="flex flex-grow overflow-hidden">
				{/* <div className="flex h-screen bg-gray-100 overflow-hidden"> */}
				<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<>

					<div className={`flex flex-col flex-grow overflow-hidden  ${isSidebarOpen ? "max-xsm:hidden" : ""}`}>
						<Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
						{/* <div id="content" className="flex-grow flex flex-col items-center justify-center"> */}
						{
							showCallScreen ?
								<CallScreen /> :
								<>{children}</>
						}
					</div>
				</>
			</div>
		</div>
	);
};

export default Template;
