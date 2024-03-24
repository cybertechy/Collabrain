import { useEffect, useState, useRef } from "react";
import MicIcon from "@mui/icons-material/MicRounded";
import VideocamIcon from "@mui/icons-material/VideocamRounded";
import CallEndIcon from "@mui/icons-material/CallEndRounded";
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useVideoCall } from "./zustand";

export default function CallScreen(props)
{
	const { callVideoStreams, micEnabled, videoEnabled, toggleAudio, toggleVideo, leaveCallFunc, setShowCallScreen} = useVideoCall();
	const [gridCols, setGridCols] = useState(1);
	const [maxGridHeight, setMaxGridHeight] = useState("100%");
	const gridRef = useRef(null);

	const minimize = () => setShowCallScreen(false);

	const addVideoElementsToGrid = () =>
	{
		if (!callVideoStreams || !gridRef.current) return;

		for (const [id, stream] of Object.entries(callVideoStreams))
		{
			const video = document.createElement('video');
			video.srcObject = stream;
			video.playsInline = true;
			video.autoplay = true;
			video.className = "rounded-md aspect-video object-cover w-auto h-full";
			video.id = id;
			if (id === "self")
				video.muted = true;
			gridRef.current.appendChild(video);
		}
	};

	useEffect(() =>
	{
		if (!callVideoStreams)
			return;

		addVideoElementsToGrid();
		console.log("numVids: ", gridRef.current.childElementCount); // Log here

		if (gridRef.current && gridRef.current.childElementCount >= 1)
			setMaxGridHeight("fit-content");
		else
			setMaxGridHeight("100%");

		if (gridRef.current)
		{
			if (gridRef.current.childElementCount <= 2)
				setGridCols(gridRef.current.childElementCount);

			else
				setGridCols(3);
		}

		return () =>
		{
			if (gridRef.current)
				gridRef.current.innerHTML = '';
		};
	}, [callVideoStreams]);

	return (
		<div className="relative w-full h-full bg-[#202124] p-4 gap-4">
			{/* Minimize button */}
			<button className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-700 transition duration-300 text-black hover:text-white z-10"
				onClick={() => minimize()}>
				<CloseFullscreenIcon style={{ fontSize: 28 }} />
			</button>

			{/* Video grid */}
			<div ref={gridRef} id="video-grid" className={"grid gap-4 w-full h-full place-items-center"}
				style={{
					gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
					maxHeight: `${maxGridHeight}`
				}}>
				{/* Video elements will be dynamically added here */}
			</div>

			{/* Toolbar */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-8 bg-white p-2 rounded-2xl shadow-2xl">
				<button className={`bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition duration-300`}
					onClick={toggleAudio}>
					{
						micEnabled ?
							<MicIcon style={{ fontSize: 28, color: "white" }} /> :
							<MicOffIcon style={{ fontSize: 28, color: "red" }} />
					}
				</button>

				<button className={`bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition duration-300`}
					onClick={toggleVideo}>
					{
						videoEnabled ?
							<VideocamIcon style={{ fontSize: 28, color: "white" }} /> :
							<VideocamOffIcon style={{ fontSize: 28, color: "red" }} />
					}
				</button>

				<button className="bg-red-500 rounded-full p-2 hover:bg-red-600 transition duration-300"
					onClick={() => leaveCallFunc()}>
					<CallEndIcon style={{ fontSize: 28, color: "white" }} />
				</button>
			</div>
		</div>
	);
}
