
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/sidebar";
import Navbar from "./navbar/navbar";
import dynamic from "next/dynamic";
const CallScreen = dynamic(() => import("_components/ui/call/callScreen"), { ssr: false });

const Template = ({ children }) =>
{
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showCallScreen, setShowCallScreen] = useState(false);
	const [callVideoStreams, setCallVideoStreams] = useState({});
	const [micEnabled, setMicEnabled] = useState(true);
	const [videoEnabled, setVideoEnabled] = useState(true);
	const [leaveCall, setLeaveCall] = useState(null);

	const toggleVideo = (video) => setVideoEnabled(!videoEnabled);

	const toggleAudio = (video) => setMicEnabled(!micEnabled);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	useEffect(() =>
	{
		console.log("### leaveCall changed ###");
		console.log(leaveCall);
	}, [leaveCall]);

	return (
		<div className="flex flex-col h-screen bg-basicallylight">

			<div className="flex flex-grow overflow-hidden">
				{/* <div className="flex h-screen bg-gray-100 overflow-hidden"> */}
				<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<>

					<div className={`flex flex-col flex-grow overflow-hidden  ${isSidebarOpen ? "max-sm:hidden" : ""}`}>
						<Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setShowCallScreen={setShowCallScreen}
							setCallVideoStreams={setCallVideoStreams} callVideoStreams={callVideoStreams} toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveCall={leaveCall} 
							micEnabled={micEnabled} videoEnabled={videoEnabled} setLeaveCall={setLeaveCall} />
						{/* <div id="content" className="flex-grow flex flex-col items-center justify-center"> */}
						{
							showCallScreen ?
								<CallScreen setShowCallScreen={setShowCallScreen} callVideoStreams={callVideoStreams}
									toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveCall={leaveCall}
									micEnabled={micEnabled} videoEnabled={videoEnabled} /> :
								<>{children}</>
						}
					</div>
				</>
			</div>
		</div>
	);
};

export default Template;
