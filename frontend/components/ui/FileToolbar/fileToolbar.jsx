import React, { useEffect, useState } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { RefreshCcw, FilePenLine, HelpCircle, Type } from 'lucide-react';
import ShareComponent from "_components/ui/share";
const axios = require('axios');
const fb = require("_firebase/firebase");
import { ToastContainer, toast } from "react-toastify";


/**
 * @param props.userID - The user's uid
 * @param props.name - The name of the file
 * @param props.fileType - The type of file (i.e. "doc"/"map")
 * @param props.fileData - The data of the file (i.e. as returned by the API)
 * @param props.fileID - The name of the file
 * @param props.commentsEnabled - Whether comments are enabled, defaults to false
 * @param props.showCommentButton - Whether to show the comment button, only needed if comments are enabled
 * @param props.isSaved - Save state of file
 */
export default function FileToolbar(props)
{
	const [Share, setShare] = useState(false);
	const [token, setToken] = useState("");

	// Function to update file data for sharing
	const updateFileData = async (newData) =>
	{
		let res;
		// Different API calls for different file types due to inconsistencies
		if (props.fileType === "doc")
		{
			res = await axios.patch(`http://localhost:8080/api/${props.fileType}s/${props.fileID}`, newData, {
				headers: { "Authorization": "Bearer " + token }
			});
		}
		else if (props.fileType === "map")
		{
			res = await axios.put(`http://localhost:8080/api/${props.fileType}s/${props.fileID}`, newData, {
				headers: { "Authorization": "Bearer " + token }
			});
		}

		return res;
	};

	useEffect(() =>
	{
		fb.getToken().then((token) => setToken(token));
	}, []);

	return (
		<div className="flex justify-between items-center p-4 bg-[#f3f3f3] border-b border-gray-300 z-[2]">
			<ToastContainer />

			{/* Document Name (leftmost element) */}
			<div className="text-lg font-bold">{props.name}</div>

			{/* Save button */}
			{(props.fileData.access[props.userID].role == "edit" || props.fileData.access[props.userID].role == "owner") &&
				<div id="save" className="flex items-center gap-2 bg-basicallylight text-primary rounded-md px-2 py-1 ml-2">
					<p className="lg:block ">{props.isSaved ? "Saved" : "Saving..."}</p>
					{
						!props.isSaved &&
						<p className={`rounded-t-lg `}><RefreshCcw width={20} height={20} className={`${!props.isSaved && "animate-spin"}`} /> </p>
					}
				</div>
			}

			{/* Buttons container (right side) */}
			<div className="flex space-x-2 ml-auto"> {/* Added ml-auto to move the right side elements to the right */}
				{/* Add comment button */}
				{props.commentsEnabled && props.showCommentButton && (
					<button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white focus:outline-none">
						{/* Reduced padding */}
						<AddCommentIcon />
					</button>
				)}

				{/* Show comments button */}
				{props.commentsEnabled && (
					<button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white focus:outline-none">
						<CommentIcon />
					</button>
				)}

				{/* Share button */}
				<button id="share" onClick={() => setShare(Share => !Share)} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white focus:outline-none">Share</button>
				{Share && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-basicallylight rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.2)] p-2 flex flex-col gap-2 border border-primary">
					<ShareComponent getdata={props.fileData} updatecontent={updateFileData}
						contentMapName={props.name} setShare={setShare}
						sData={props.fileData.access} isOwner={props.fileData.access[props.userID].role == "owner"} />
				</div>}
			</div>
		</div>
	);
};
