import { useEffect, useState, useRef } from "react";
import MicIcon from "@mui/icons-material/MicRounded";
import VideocamIcon from "@mui/icons-material/VideocamRounded";
import CallEndIcon from "@mui/icons-material/CallEndRounded";
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

export default function CallScreen(props)
{
	const [micEnabled, setMicEnabled] = useState(true);
	const [videoEnabled, setVideoEnabled] = useState(true);
	const [gridCols, setGridCols] = useState(1);
	const [maxGridHeight, setMaxGridHeight] = useState("100%");
	const gridRef = useRef(null);

	const toggleMic = () =>
	{
		setMicEnabled((prev) => !prev);
		// You can add logic here to toggle microphone
	};

	const toggleVideo = () =>
	{
		setVideoEnabled((prev) => !prev);
		// You can add logic here to toggle video
	};

	const exitCall = () =>
	{
		// Add logic to exit the call
		console.log("Exiting call...");
	};

	useEffect(() =>
	{
		console.log("### Adjusting grid... ###");
		if (gridRef.current && gridRef.current.childElementCount >= 2)
		{
			setMaxGridHeight("fit-content");
		} else
		{
			setMaxGridHeight("100%");
		}

		if (gridRef.current)
		{
			console.log(gridRef.current.childElementCount); // Log here
			if (gridRef.current.childElementCount <= 3)
				setGridCols(gridRef.current.childElementCount);

			else
				setGridCols(3);
		}
	}, [props.numUsers]);

	return (
		<div className="relative w-full h-full bg-[#202124] p-4 gap-4">
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
					onClick={toggleMic}>
					{micEnabled ?
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
					onClick={exitCall}>
					<CallEndIcon style={{ fontSize: 28, color: "white" }} />
				</button>
			</div>
		</div>
	);
}
