"use client";

import { useState, useEffect, useRef } from "react";
import AES from "crypto-js/aes";
const cryptoJS = require("crypto-js");
import dynamic from "next/dynamic";
import { maskProfanity, containsProfanity } from "../../utils/textmoderator";
import enc from "crypto-js/enc-utf8";
const uuid = require("uuid");
import MessageBox from "@/components/ui/messagesComponents/messageBox";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import ChannelBar from "./channelBar";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import MessageItem from "@/components/ui/messagesComponents/MessageItem";
const { useRouter, useSearchParams } = require('next/navigation');
const axios = require("axios");
import { Hash } from 'lucide-react';
const fb = require("_firebase/firebase");
import InviteUsersOverlay from "@/components/ui/overlays/inviteUsersOverlay";
const socket = require("_socket/socket");
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
const  LoaderComponent = dynamic(() => import('@/components/ui/loader/loaderComponent'), { ssr: false });
import ShortTextIcon from '@mui/icons-material/ShortText'; // This can act as a hash
import TeamSettingsOverlay from "@/components/ui/overlays/teamSettingsOverlay";
import TeamOverviewOverlay from "@/components/ui/overlays/teamOverviewOverlay";
import { fetchUser } from "../../utils/user";
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { set } from "react-hook-form";
import { addMedia } from "@/app/utils/storage";
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

export default function ChatRoom() {


	const params = useSearchParams();
	const [user, loading] = fb.useAuthState();
	const [teamData, setTeamData] = useState({}); // This is the team name that will be displayed on the top of the chat
	const [isLoading, setIsLoading] = useState(false);
	const [loadingState, setLoadingState] = useState("");
	const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false); // State for delete confirmation overlay
	const [channelBarTeamData, setChannelBarTeamData] = useState({});
	const [userInfo, setUserInfo] = useState({ data: { username: "User" } });
	const [teamId, setTeamId] = useState(params.get('teamId')); // This is the team name that will be displayed on the top of the chat
	const [channelName, setChannelName] = useState(params.get('channelName')); // This is the team name that will be displayed on the top of the chat
	const [channelsUpdated, setChannelsUpdated] = useState(0);
	const [messages, setMessages] = useState([]);
	const router = useRouter();
	const inviteUsersOverlayRef = useRef(null);
	const teamSettingsOverlayRef = useRef(null);
	const [showinviteUsersOverlay, setShowinviteUsersOverlay] = useState(false);
	const [showTeamSettingsOverlay, setShowTeamSettingsOverlay] = useState(false);
	const [showTeamOverviewOverlay, setShowTeamOverviewOverlay] = useState(false);
	const [members, setMembers] = useState([]);
	const [bannedMembers, setBannedMembers] = useState([]);
	const [currentUserIsBanned, setCurrentUserIsBanned] = useState(false);
	const { t } = useTranslation('team');
	const { speak, stop, isTTSEnabled } = useTTS();
	useEffect(() => {
		if (!user) {
			return;
		}
		fetchAllMembers();
	}, [teamData, channelsUpdated, user]);


	const fetchAllMembers = async () => {
		if (teamData && teamData.members && teamData.owner && user) {
			setIsLoading(true);
			const memberPromises = Object.keys(teamData.members).map(async memberId => {
				// Assume fetchUser returns user info for a given ID
				const userInfo = await fetchUser(memberId);
				return {
					...userInfo,
					role: memberId === teamData.owner ? 'owner' : teamData.members[memberId].role,
					id: memberId,
					score: teamData.members[memberId].score ? teamData.members[memberId].score : 0,
				};
			});
			Promise.all(memberPromises).then(completeMembers => {
				setMembers(completeMembers);
			});
			const bannedMemberPromises = (teamData?.banned || []).map(async memberId => {
				console.log("BANNED MEMBER ID", memberId)
				// Assume fetchUser returns user info for a given ID
				if (memberId === user.uid) {
					setCurrentUserIsBanned(true);
				}

				const userInfo = await fetchUser(memberId);
				return {
					...userInfo,

					id: memberId
				};
			});
			Promise.all(bannedMemberPromises).then(completeMembers => {
				setBannedMembers(completeMembers);
			});
		}
		setIsLoading(false);
	};

	const handleCloseTeamOverview = () => {
		setShowTeamOverviewOverlay(false);
	};


	const handleCloseTeamSettings = () => {
		setShowTeamSettingsOverlay(false);
	};



	const handleCloseinviteUsers = () => {
		setShowinviteUsersOverlay(false);
	};
	const dialogStyles = {
		color: "#30475E",  // Text color
		borderColor: "#30475E",  // Border color
	};

	const buttonStyles = {
		border: 1, borderColor: "#30475E", color: "#30475E", '&:hover': {
			backgroundColor: "#30475E",
			color: "#FFFFFF",
		},
	};

	const onDeafen = () => { }
	const onLeave = async () => {
		try {
			const token = await fb.getToken(); // Ensure this method correctly retrieves the auth token


			if (!teamId || !user) {
				console.log("Missing teamId or userId");
				return;
			}

			const response = await axios.delete(`${SERVERLOCATION}/api/teams/${teamId}/users/${user.uid}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200) {
				console.log("Successfully left the team");
				// Optionally, perform any follow-up actions here, e.g., redirecting the user or updating UI
				router.push("/dashboard");
			} else {
				console.error("Failed to leave the team", response.data);
			}
		} catch (error) {
			console.error("Error leaving the team", error);
		}
	};
	const onMute = () => { console.log("Implement Mute Team") }

	const onDeleteMessage = (messageId) => {
    if (!teamId) {
        console.error("Team ID is not available.");
        toast.error("An error occurred. Please try again later.");
        return;
    }
	let channelId = "";
		let teamInfo = teamDataRef.current;
		console.log(teamDataRef.current);
		for (let x = 0; x < teamInfo.channels.length; x++) {
			if(teamInfo.channels[x].name == channelName) {
				channelId = teamInfo.channels[x].channelId;
			}

		}
    // Optimistically remove the message from the UI
    setMessages((currentMessages) =>
        currentMessages.filter(
            (messageComponent) => messageComponent.props.messageId !== messageId
        )
    );

    // Prepare the message deletion details for the server
    const messageToDelete = {
        team: teamId,
        id: messageId,
        channelId: channelId,
		channel: channelName,
        sentAt: new Date().toISOString(),
    };

    console.log("Emitting deleteTeamMessage event with:", messageToDelete);

    // Emit the delete event to the server
    if (sockCli.current) {
        sockCli.current.emit("deleteTeamMessage", messageToDelete);
        toast.success("Message deleted successfully."); // Provide user feedback on successful deletion
    } else {
        toast.error("Failed to connect to server. Message not deleted."); // Error handling if the socket connection is unavailable
    }
};



	const onDelete = async () => {
		try {
			const token = await fb.getToken(); // Replace with your method to get the user's token

			const response = await axios.delete(`${SERVERLOCATION}/api/teams/${teamId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Team deleted successfully", response.data);
			// Handle post-delete logic here (e.g., redirecting the user)
			router.push("/dashboard")
		} catch (error) {
			console.error("Failed to delete team", error.response?.data || error.message);
			// Handle error (e.g., showing an error message to the user)
		}
	};

	const messagesEndRef = useRef(null); // Create a reference to the message container

	// Function to scroll to the bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	let sockCli = useRef(null);

	useEffect(() => {
		setIsLoading(true);
		if (!user) return;

		sockCli.current = socket.init(SERVERLOCATION) || {};
		console.log("Socket initialized", sockCli);
		sockCli.current.on("teamMsg", (data) => {
			let sentAt = new Date(
				data.sentAt._seconds * 1000 + data.sentAt._nanoseconds / 1000000
			);

			if (!data) {
				console.error("Invalid message data received:", data);
				return;
			}

			console.log("Received team message:", data);

			if (teamId !== data.chat) return;

			data.msg = AES.decrypt(data.msg, teamId).toString(enc);

			setMessages((prevMessage) => [
				...prevMessage,
				<MessageItem
					key={data.id}
					sender={data.sender}
					senderId={data.sender}
					message={data.msg}
					timestamp={
						sentAt.toDateString() +
						", " +
						sentAt.toLocaleTimeString()
					}
					messageId={data.id}
					reactions={{}}
					onReact={handleReact}
					attachments={data.attachments}
					userInfo={userInfo}
					teamId={teamId}
					source={"team"}
					onEdit={handleEdit}
					onDelete={() => onDeleteMessage(data.id)}
					
				/>,
			]);
		});
		setIsLoading(false);
		return () => sockCli.current.off("teamMsg");
	}, [user, teamId]);



	useEffect(() => {
		setTeamId(params.get('teamId'));
		setChannelName(params.get('channelName'));
	}, [params.get('teamId'), params.get('channelName')]);
	useEffect(() => {
		if (!user || !teamId) return;

		const handleUpdateTeamMessage = (updatedMessage) => {
			console.log("Received updateTeamMessage event:", updatedMessage);

			if (updatedMessage?.msg) {
				updatedMessage.msg = AES.decrypt(updatedMessage.msg, teamId).toString(enc);
			}

			setMessages((currentMessages) =>
				currentMessages.map((messageComponent) => {
					if (messageComponent.props.messageId === updatedMessage.id) {
						return (
							<MessageItem
								key={updatedMessage.id}
								sender={messageComponent.props.sender}
								senderId = {messageComponent.props.sender}
								message={updatedMessage.msg || messageComponent.props.message}
								timestamp={messageComponent.props.timestamp}
								messageId={updatedMessage.id}
								reactions={updatedMessage.reactions || messageComponent.props.reactions}
								attachmentIds={updatedMessage.attachmentIds || messageComponent.props.attachmentIds}
								userInfo={messageComponent.props.userInfo}
								teamId={teamId}
								source={"team"}
								onReact={handleReact}
								onEdit={handleEdit}
								onDelete= {() => onDeleteMessage(updatedMessage.id)}
							/>
						);
					}
					return messageComponent;
				})
			);
		};

		if (sockCli.current) {
			sockCli.current.on("updateTeamMessage", handleUpdateTeamMessage);
		}

		// Cleanup on component unmount
		return () => {
			if (sockCli.current) {
				sockCli.current.off("updateTeamMessage", handleUpdateTeamMessage);
			}
		};
	}, [user, teamId]);

	useEffect(() => {
		if (!user || !teamId) return;

		const handleDeleteTeamMessage = (deletedMessage) => {
			console.log("Received deleteTeamMessage event for message ID:", deletedMessage);

			setMessages((currentMessages) =>
				currentMessages.filter(
					(messageComponent) => messageComponent.props.messageId !== deletedMessage.id
				)
			);
		};

		if (sockCli.current) {
			sockCli.current.on("deleteTeamMessage", handleDeleteTeamMessage);
		}

		// Cleanup on component unmount
		return () => {
			if (sockCli.current) {
				sockCli.current.off("deleteTeamMessage", handleDeleteTeamMessage);
			}
		};
	}, [user, teamId]);

	useEffect(() => {
		if (!user || !teamId || !channelName) return;

		const fetchMessages = async () => {
			try {
				setIsLoading(true);
				setLoadingState("FETCHING_MESSAGES");
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}/channels/${channelName}/messages`, {
					headers: { "Authorization": "Bearer " + token }
				});
			
				const fetchedMessages = response.data.map((messageData) => {
					// Attempt to safely convert timestamp to Date object'
					console.log("MESSAGE DATA", messageData)
					let sentAt = new Date(messageData.sentAt._seconds * 1000 + messageData.sentAt._nanoseconds / 1000000);

					let decryptedMessage = ""

					// Format date or handle invalid dates
				    if(messageData.username == "System") {
						decryptedMessage = messageData.message;
						messageData.reactions = {};
					}else{
						decryptedMessage = decryptMessage(messageData.message, teamId);
					}
					let timestamp = sentAt.toLocaleDateString() + ", " + sentAt.toLocaleTimeString();
				
					return (
						<MessageItem
							key={messageData.id}
							userInfo={userInfo}
							sender={messageData.username}
							senderId = {messageData.sender}
							timestamp={timestamp}
							message={decryptedMessage}
							messageId = {messageData.id}
							reactions={messageData.reactions || {}}
							userId={messageData.sender}
							teamId={teamId}
							source={"team"}
							onReact={handleReact}
							onEdit={handleEdit}
							onDelete= {() => onDeleteMessage(messageData.id)}
						/>
					);
				});
				setMessages(fetchedMessages);
				setIsLoading(false);
				setLoadingState("");
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		fetchMessages();
	}, [user, teamId, channelName, userInfo]);

	// Helper functions
	const convertToDate = (seconds, nanoseconds) => {
		try {
			return new Date(seconds * 1000 + nanoseconds / 1000000);
		} catch (e) {
			console.error("Error converting timestamp to date:", e);
			return null; // Return null if conversion fails
		}
	};

	const decryptMessage = (cipherText, secretKey) => {
		try {
			const bytes = cryptoJS.AES.decrypt(cipherText, secretKey);
			const originalText = bytes.toString(cryptoJS.enc.Utf8);
			return originalText || "Decryption error";
		} catch (e) {
			console.error("Error decrypting message:", e);
			return "Decryption error";
		}
	};


	useEffect(() => {
		if (!user) return;

		const fetchUser = async () => {
			try {
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/users/${user?.uid}`, {
					headers: { "Authorization": "Bearer " + token }
				});
				// Set user info with the data obtained from the response
				setUserInfo({ data: response.data });
			} catch (error) {
				console.error('Error fetching user data:', error);
				// Handle error, for example by setting a default user info
				setUserInfo({ data: { username: "User" } });
			}
		};

		fetchUser();
	}, [user]);
	useEffect(() => {
		const fetchTeamInformation = async (teamId) => {
			try {
				// Make a GET request to retrieve information for the specified team
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Replace with the actual auth token
					},
				});

				// Check if the request was successful
				if (response.status === 200) {
					const teamData = {
						teamId,
						...response.data
					};

					// Update the userTeams state with the team information
					setTeamData(teamData);
					console.log("TEAM DATA", teamData)
				} else {
					console.error('Failed to fetch team information:', response.statusText);
					// Handle the error and provide user feedback here
				}
			} catch (error) {
				console.error('Error fetching team information:', error);
				// Handle errors and provide user feedback here
			}
		};



		// Call the function to fetch team information when the component mounts
		fetchTeamInformation(teamId);
	}, [user, teamId, channelName, channelsUpdated]);
	const handleChannelSelect = (channelName) => {
		router.push(`/chat?teamId=${teamData.teamId}&channelName=${channelName}`);

	};
	const handleUpdated = () => {
		setChannelsUpdated(channelsUpdated + 1);
	}
	useEffect(() => {
		// Your update logic here, e.g., updating local state or refetching data
		console.log('Team data or user changed, update component:', teamData);
		// Update component state or perform actions based on the new props
		setChannelBarTeamData(teamData);
	}, [teamData]); // React to changes in these props
	const formatDate = (date) => {
		return new Date(date).toLocaleString("en-US", {
			hour12: true, // Use 12-hour clock
			month: "2-digit", // Numeric month, e.g., 3, 4, ...
			day: "2-digit", // Numeric day of the month
			year: "numeric", // 4-digit year
			hour: "2-digit", // Numeric hour
			minute: "2-digit", // 2-digit minute
			second: "2-digit", // 2-digit second
		});
	};
	const formatDate2 = (date) => {
		const options = {
			hour12: true,
			weekday: 'long', // e.g., Monday
			month: 'long', // e.g., July
			day: '2-digit', // e.g., 01
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short' // This will include the time zone abbreviation, not the offset
		};
		// Format the date according to the options
		let formattedDate = new Date(date).toLocaleString("en-US", options);
		// Manually adjust the time zone part if needed. Here, assuming you want to replace the timezone abbreviation with "UTC+4"
		formattedDate = formattedDate.replace(/GMT\+\d+ \(.*\)$/, 'UTC+4');
		return formattedDate;
	};




	const sendTeamMsg = async (msg, attachments = []) => {
		if (!sockCli.current) {
			console.error('Socket is not initialized yet.');
			return;
		}

		let token = await fb.getToken();
		let userData = await axios.get(`${SERVERLOCATION}/api/users/${user?.uid}`, {
			headers: { "Authorization": "Bearer " + token }
		});

		let sentAt = new Date();
		let msgId = uuid.v4() + "D" + sentAt.getTime(); // T for team

		// Handle attachment upload if any
		let attachmentIds = [];
		try {
			const uploadResponses = await Promise.all(
				attachments.map(async (file) => {
					try {
						const uploadResponse = await addMedia(file.type, file.base64, "team"); // Adjust based on your API structure
						return uploadResponse?.mediaId; // Assuming the response includes an id
					} catch (error) {
						console.error("Failed to upload attachment:", error);
						return null;
					}
				})
			);
			// Filter out null values after all promises have resolved
			attachmentIds = uploadResponses.filter(id => id != null);
		} catch (error) {
			console.error("Error uploading attachments:", error);
		}

		// Encrypt the message before sending
		const encryptedMsg = AES.encrypt(msg, teamId).toString();

		const messageData = {
			id: msgId,
			senderID: user.uid,
			sender: userInfo.data.username,
			team: teamId,
			channel: channelName,
			msg: encryptedMsg, // encrypted message
			sentAt: sentAt.toISOString(),
			attachments: attachmentIds,
			reactions: {} // if you handle reactions
		};
		
		const optimisticMessage = {
			...messageData,
			msg: msg, // Display the original, unencrypted message in the UI
			sentAt: formatDate(sentAt),
			attachments: attachmentIds, // Include the attachment IDs for rendering
		};
		// Optimistically update the UI with the new message
		setMessages(prevMessages => [
			...prevMessages,
			<MessageItem
				key={msgId}
				sender={messageData.sender}
				timestamp={optimisticMessage.sentAt}
				message={optimisticMessage.msg} // Display the original, unencrypted message in the UI
				reactions={{}}
				userInfo={userInfo}
				messageId={msgId}
				onReact={handleReact}
				teamId={teamId}
				source={"team"}
				attachmentIds={attachmentIds} // Include the attachment IDs for rendering
				onEdit={handleEdit}
			/>
		]);

		sockCli.current.emit('teamMsg', messageData); // Send the encrypted message to the server
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages]);
	const teamDataRef = useRef(teamData);

	useEffect(() => {
	  teamDataRef.current = teamData;
	}, [teamData]);
	const handleReact = (messageId, emoji) => {
		if (!messageId) {
			toast.error("Cannot react to messages that don't have IDs");
			return;
		}
	
		let additionalProps = null;
		let updatedReactionsForServer = {}; // This will hold the updated reactions for the server update
	
		setMessages(currentMessages => currentMessages.map(message => {
			const messageProps = { ...message.props };
			
			if (messageProps.messageId === messageId) {
				additionalProps = messageProps;
				const newReactions = messageProps.reactions ? { ...messageProps.reactions } : {};
				
				if (newReactions[emoji]) {
					if (newReactions[emoji].includes(user.uid)) {
						newReactions[emoji] = newReactions[emoji].filter(id => id !== user.uid);
					} else {
						newReactions[emoji].push(user.uid);
					}
				} else {
					newReactions[emoji] = [user.uid];
				}
	
				updatedReactionsForServer = newReactions; // Capture the updated reactions for this message
	
				return React.cloneElement(message, { ...messageProps, reactions: newReactions });
			}
	
			return message;
		}));
	
		let sentAt = new Date();
		const messageUpdate = {
			msg: AES.encrypt(additionalProps.message, teamId).toString(),
		    sender: additionalProps.senderId,
			username: additionalProps.sender, 
			team: teamId,
			sentAt: sentAt.toISOString(),
			id: messageId,
			channel: channelName,
			reactions: updatedReactionsForServer,
		};
	
		// Send the update to the server
		console.log("Emitting reaction update to server:", messageUpdate);
		sockCli.current.emit("updateTeamMessage", messageUpdate); // Adjust the event name ("updateReaction") as per your server-side implementation
	};
	
	const prepareReactionsForServer = (messageId, emoji) => {
		// Implement according to how your server expects the reactions to be formatted
		// This could involve just sending the updated reactions object for the messageId
		const message = messages.find((msg) => msg.id === messageId);
		return message ? message.reactions : {};
	};

	const handleEdit = (messageId, editedText) => {
		if (!messageId) {
			toast.error("Cannot edit messages that don't have IDs");
			return;
		}
		// Similar to handleReact, we check for channelID even though it might not be used here, for consistency.
		let channelId = "";
		const teamInfo = teamDataRef.current;
		for (let x = 0; x < teamInfo.channels.length; x++) {
			if(teamInfo.channels[x].name === channelName) {
				channelId = teamInfo.channels[x].id;
				break; // Once we find the channelId, we can break the loop.
			}
		}
	
		let editedMessageProps = null; // This will hold the properties of the edited message for server update.
	
		// Update the local state before sending the update to the server, similar to handleReact.
		setMessages(currentMessages => currentMessages.map(message => {
			const messageProps = { ...message.props };
			
			if (messageProps.messageId === messageId) {
				editedMessageProps = {
					...messageProps,
					message: editedText, // Update the message text
				};
	
				// Prepare the message update for the server, including encryption.
				const encryptedMessage = AES.encrypt(editedText, teamId).toString();
				
				return React.cloneElement(message, { ...editedMessageProps, message: encryptedMessage });
			}
	
			return message;
		}));
	
		if (!editedMessageProps) return; // If no message was found and updated, do not proceed.
	
		const sentAt = new Date();
		// Construct the message update object for the server, similar to handleReact.
		const messageUpdate = {
			msg: AES.encrypt(editedText, teamId).toString(),
			sender: editedMessageProps.senderId,
			username: editedMessageProps.sender,
			team: teamId,
			sentAt: sentAt.toISOString(),
			id: messageId,
			channel: channelName,
			// No reactions update here since we're editing the message text.
		};
	
		// Log and emit the update to the server, akin to handleReact.
		console.log("Emitting updateTeamMessage event with updated message text:", messageUpdate);
		sockCli.current.emit("updateTeamMessage", messageUpdate);
	};
	

	return (
		<>
			{(!currentUserIsBanned) ? ( // Ensure the condition is wrapped in parentheses and properly closed
				<>
					<ToastContainer />
					<LoaderComponent
						isLoading={isLoading}
						loadingState={loadingState}
					/>
					{/* // <div className="flex h-full w-full drop-shadow-lg"> */}

					<div className="flex flex-row flex-grow">
						{/* <Sidebar /> */}

						<ChannelBar
							user={userInfo}
							userUID={user?.uid}
							teamData={channelBarTeamData}
							onUpdated={handleUpdated}
							handleChannelSelect={handleChannelSelect}
							selectedChannel={channelName}
							onSettings={() => setShowTeamSettingsOverlay(true)}
							onInvite={() => setShowinviteUsersOverlay(true)}
							onDeafen={onDeafen}
							onLeave={onLeave}
							onDelete={() => setDeleteOverlayOpen(true)}
							onMute={onMute}
							onViewDetails={() => setShowTeamOverviewOverlay(true)}
						/>
						<div className="flex flex-col w-full  relative">
							<div className="w-full h-1/6">
								<div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
									<Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
										<Hash size={28} strokeWidth={2} className="text-primary" /><h1 className='text-xl font-semibold text-primary items-center justify-center flex-row'>{channelName}</h1>
									</Toolbar>
								</div>
								<div className="w-full h-1/6">
									<div className="">
										<div className="p-5 w-full scrollbar-thin scrollbar-thumb-primary text-basicallydark overflow-y-scroll message-container">
											<div className="mt-5"></div>
											{messages}
											<div ref={messagesEndRef} />
										</div>


									</div>

								</div>
							</div>

							<div className="absolute bottom-0 left-0 right-0 p-3  bg-white" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
								<MessageBox onSendMessage={sendTeamMsg} />
							</div>
						</div>

					</div>
					{showinviteUsersOverlay && (
						<div ref={inviteUsersOverlayRef}>
							<InviteUsersOverlay onClose={handleCloseinviteUsers} teamData={teamData} />
						</div>
					)}

					{/* <ChannelBar /> */}
					<Dialog open={deleteOverlayOpen} onClose={() => setDeleteOverlayOpen(false)} sx={dialogStyles}>
						<DialogTitle onMouseEnter={() => isTTSEnabled && speak("Confirm Delete")}
              				onMouseLeave={stop}>{t('confirm_delete')}</DialogTitle>
						<DialogContent onMouseEnter={() => isTTSEnabled && speak("Are you sure you want to delete this team? THIS IS IRREVERSIBLE!")}
              				onMouseLeave={stop}>
							{t('delete_msg')}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setDeleteOverlayOpen(false)} sx={buttonStyles} 
							onMouseEnter={() => isTTSEnabled && speak("Cancel button")} onMouseLeave={stop}>
								{t('cancel')}
							</Button>
							<Button onClick={onDelete} sx={buttonStyles} 
							onMouseEnter={() => isTTSEnabled && speak("Delete button")} onMouseLeave={stop}>
								{t('delete')}
							</Button>
						</DialogActions>
					</Dialog>
					{showTeamSettingsOverlay && (
						<div ref={teamSettingsOverlayRef}>
							<TeamSettingsOverlay onClose={handleCloseTeamSettings} teamData={teamData} onUpdate={handleUpdated} members={members} bannedMembers={bannedMembers} userId={user?.uid} />
						</div>
					)}
					{showTeamOverviewOverlay && (
						<div>
							<TeamOverviewOverlay onClose={handleCloseTeamOverview} teamData={teamData} members={members} />
						</div>
					)}
				</>
			) : (
				<div className="flex h-full items-center justify-center">
					<p className="font-bold text-3xl font-sans text-center text-primary"
					onMouseEnter={() => isTTSEnabled && speak("Sorry, you are banned from this team")}
					onMouseLeave={stop}>{t('banned')} {"  "} :(</p>
				</div>
			)}
		</>
	)
	{/* </div> */ }
}