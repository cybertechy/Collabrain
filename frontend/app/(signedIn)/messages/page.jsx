"use client";

import { useState, useEffect, useRef } from "react";
import DMSideBar from "@/components/ui/messagesComponents/DMSidebar";
import MessageItem from "@/components/ui/messagesComponents/MessageItem";
const { useRouter, useSearchParams } = require("next/navigation");
import AES from "crypto-js/aes";
import React from "react";
import { maskProfanity, containsProfanity } from "@/app/utils/textmoderator";
import enc from "crypto-js/enc-utf8";
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ChatWindow from "@/components/ui/messagesComponents/chatWindow";
import FriendsWindow from "./friendWindow";
import { fetchUser } from "@/app/utils/user";
import { fetchMessages, fetchDirectMessages } from "@/app/utils/messages";
import LoaderComponent from "@/components/ui/loader/loaderComponent";
const uuid = require("uuid");
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

import { addMedia } from "@/app/utils/storage";
import { ToastContainer, toast } from "react-toastify";
import { search } from "homoglyph-search";
export default function Messages() {
    const router = useRouter();
    const [user, loading] = fb.useAuthState();
    const [channelsData, setChannelsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingState, setLoadingState] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);
    const params = useSearchParams();
    const [withUserInfo, setWithUserInfo] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [replyTo, setReplyTo] = useState(null);

    const withUser = params.get("user");
    const chatId = params.get("chatID");

    let sockCli = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        if (!user) return;



        sockCli.current = socket.init(SERVERLOCATION) || {};
        console.log("Socket initialized", sockCli);
        sockCli.current.on("directMsg", (data) => {
            let sentAt = new Date(
                data.sentAt._seconds * 1000 + data.sentAt._nanoseconds / 1000000
            );

            if (!data) {
                console.error("Invalid message data received:", data);
                return;
            }

            console.log("Received direct message:", data);

            if (chatId !== data.chat) return;

            data.msg = AES.decrypt(data.msg, chatId).toString(enc);

            setMessages((prevMessage) => [
                ...prevMessage,
                <MessageItem
                    key={data.id }
                    sender={data.sender}
                    senderId= {data.senderId}
                    message={data.msg}
                    timestamp={
                        sentAt.toDateString() +
                        ", " +
                        sentAt.toLocaleTimeString()
                    }
                    messageId={data.id}
                    reactions={{}}
                    onReact={handleReact}
                    onReply={setReplyTo}
                    attachments={data.attachments}
                    replyTo={data.replyTo}
                    userInfo={userInfo}
                    chatId = {chatId}
                    
                />,
            ]);
        });
        setIsLoading(false);
        return () => sockCli.current.off("directMsg");
    }, [user, chatId]);


    useEffect(() => {
        if (!user || !chatId) return;
        const handleUpdateDirectMessage = (updatedMessage) => {
            console.log("Received updateDirectMessage event:", updatedMessage);
            if (updatedMessage?.msg) updatedMessage.msg = AES.decrypt(updatedMessage.msg, chatId).toString(enc);
            setMessages(currentMessages => currentMessages.map(messageComponent => {
                if (messageComponent.props.messageId === updatedMessage.id) {
                    return <MessageItem
                        key={updatedMessage.id+Math.random()}
                        sender={messageComponent.props.sender}
                        message={updatedMessage.msg ? updatedMessage.msg : messageComponent.props.message}
                        timestamp={messageComponent.props.timestamp}
                        messageId={updatedMessage.id}
                        reactions={updatedMessage.reactions ? updatedMessage.reactions : messageComponent.props.reactions}
                        attachmentIds={updatedMessage.attachmentIds ? updatedMessage.attachmentIds : messageComponent.props.attachmentIds}
                        userInfo={messageComponent.props.userInfo}
                    />
                }

                return messageComponent;
            }));
        };

        if (sockCli.current) {
            sockCli.current.on("updateDirectMessage", handleUpdateDirectMessage);
        }

        // Cleanup on component unmount
        return () => {
            if (sockCli.current) {
                sockCli.current.off("updateDirectMessage", handleUpdateDirectMessage);
            }
        };
    }, [user, chatId]); // Dependency array is empty to set up the listener once on mount
    useEffect(() => {
        if (!user) return;

        const handleDeleteDirectMessage = (deletedMessage) => {
            console.log("Received deleteDirectMessage event for message ID:", deletedMessage);
            setMessages(currentMessages => currentMessages.filter(messageComponent =>
                messageComponent.props.messageId !== deletedMessage.id
            ));
        };

        if (sockCli.current) {
            sockCli.current.on("deleteDirectMessage", handleDeleteDirectMessage);
        }

        // Cleanup on component unmount
        return () => {
            if (sockCli.current) {
                sockCli.current.off("deleteDirectMessage", handleDeleteDirectMessage);
            }
        };
    }, [user]);

    // useEffect(() => {
    //     if (!sockCli.current || !user || !chatId) return;


    //     const handleUpdateID = (updatedMessage) => {
    //         console.log("Received updateID event:", updatedMessage);
    //         updatedMessage.msg = AES.decrypt(updatedMessage.msg, chatId).toString(enc);
    //         setMessages((prevMessages) => {
    //             return prevMessages.map((messageComponent) => {

    //                 // Extract props from each MessageItem component
    //                 const { sender, message, timestamp, messageId } = messageComponent.props;

    //                 // Convert updatedMessage.sentAt to Date object
    //                 const updatedMessageDate = new Date(
    //                     updatedMessage.sentAt._seconds * 1000 +
    //                     updatedMessage.sentAt._nanoseconds / 1000000
    //                 );

    //                 // Options to format the date as '3/13/2024, 11:07:25 PM'
    //                 const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    //                 const updatedMessageTimestampString = updatedMessageDate.toLocaleString('en-US', options);

    //                 const tempIDCheck = messageId.startsWith("temp-");
    //                 const senderMatch = sender === updatedMessage.sender;
    //                 const messageMatch = message === updatedMessage.msg;
    //                 const timestampMatch = timestamp === updatedMessageTimestampString;


    //                 // Reconstruct component with updated ID if conditions match
    //                 if (tempIDCheck && senderMatch && messageMatch && timestampMatch) {

    //                     return React.cloneElement(messageComponent, {
    //                         ...messageComponent.props,
    //                         key: updatedMessage.id, // Update the key
    //                         messageId: updatedMessage.id // Update the ID
    //                     });
    //                 }

    //                 // Return the original component if no match
    //                 return messageComponent;
    //             });
    //         });
    //     };

    //     sockCli.current.on("updateID", handleUpdateID);

    //     return () => {
    //         if (sockCli.current) {
    //             sockCli.current.off("updateID", handleUpdateID);
    //         }
    //     };
    // }, [user, chatId]);



    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchedUser = await fetchUser(user.uid);
                setLoadingState("DEFAULT");
                setUserInfo({ data: fetchedUser });
                setLoadingState("FETCHING_MESSAGES");
                const directMessagesData = await fetchDirectMessages(); // Assuming this function is properly defined to fetch direct messages

                directMessagesData.forEach((chat) => {
                    if ("lastMessage" in chat && chat?.lastMessage?.message) {
                        try {
                            chat.lastMessage.message = AES.decrypt(
                                chat.lastMessage.message,
                                chat.id
                            ).toString(enc);
                        } catch (error) {
                            console.error("Error decrypting message:", error);
                            chat.lastMessage.message = "Unencrypted Message";
                        }
                    } else {
                        chat.lastMessage.message = "Start a new chat!"
                           
                    }
                });

               
                setDirectMessages(directMessagesData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoadingState("ERROR");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (!user || !withUser) return;
        setIsLoading(true); // Start loading before the async operation

        const fetchUserData = async () => {
            try {
                const fetchedUser = await fetchUser(withUser); // Fetch user data asynchronously
                setWithUserInfo({ data: fetchedUser }); // Set user data after it's fetched
            } catch (error) {
                console.error("Failed to fetch user data:", error); // Log any errors
            } finally {
                setIsLoading(false); // Stop loading after the operation completes, regardless of success or failure
            }
        };

        fetchUserData(); // Call the async function
    }, [user, withUser]);

    useEffect(() => {
        if (!user || !chatId || !userInfo) return;

        const fetchAndSetMessages = async () => {
            if (!user || !chatId || !userInfo) return;
            setIsLoading(true);
            setLoadingState("FETCHING_MESSAGES");
            try {

                const fetchedMessages = await fetchMessages(chatId, userInfo);

                setMessages(fetchedMessages);
                setIsLoading(false);
                setLoadingState(""); // Or any state indicating success
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                setIsLoading(false);
                setLoadingState("ERROR"); // Update your loading states to handle errors
            }
        };

        fetchAndSetMessages();
    }, [user, chatId, userInfo]);

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
    

    const onDelete = (messageId) => {
        // Assuming `chatId` is available in the scope as you mentioned
        if(!chatId) return console.error("Chat ID is not available.");
        setMessages(currentMessages => currentMessages.filter(messageComponent =>
            messageComponent.props.messageId !== messageId
        ));
        const messageToDelete = {
            chat: chatId,
            id: messageId,
            sentAt: new Date().toISOString(),
        };

        console.log("Emitting deleteDirectMessage event with:", messageToDelete);

        if (sockCli.current) {
            sockCli.current.emit("deleteDirectMessage", messageToDelete);
        }
    };
    const handleAliasUpdate = (friendId, newAlias) => {
        console.log("USER UPDATE CALLED FOR ID", friendId,"WITH ALIAS", newAlias)
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          alias: { ...prevUserInfo.alias, [friendId]: newAlias },
        }));
      };
    const sendPersonalMsg = async (msg, attachments = []) => {
        if (!sockCli.current) {
            console.error("Socket is not initialized yet.");
            return;
        }

        // Check and mask profanity in message
        if (typeof msg === "string" && msg.trim() !== "") {
            msg = maskProfanity(msg, "*");
        } else if (
            typeof msg === "string" &&
            msg.trim() !== "" &&
            containsProfanity(msg, true)
        ) {
            console.error("Message contains profanity.");
            return;
        }

        let sentAt = new Date();
        let msgId = uuid.v4() + "D" + sentAt.getTime();
        // Handle attachment upload
        let attachmentIds = [];
        try {
            const uploadResponses = await Promise.all(
                attachments.map(async (file) => {
                    try {
                        const uploadResponse = await addMedia(
                            file.type,
                            file.base64
                        ); // Adjust based on your API structure
                        return uploadResponse?.mediaId; // Assuming the response includes an id
                    } catch (error) {
                        console.error("Failed to upload attachment:", error);
                        return null;
                    }
                })
            );

            // Filter out null values after all promises have resolved
            attachmentIds = uploadResponses.filter((id) => id != null);
        } catch (error) {
            console.error("Error uploading attachments:", error);
        }

        const messageData = {
            id: msgId,
            senderID: user.uid,
            sender: userInfo.data.username,
            chat: chatId,
            msg: AES.encrypt(msg, chatId).toString(),
            sentAt: sentAt.toISOString(),
            attachments: attachmentIds,
            reactions: [],

        };

        // Optimistically update the UI with the new message and attachments
        const optimisticMessage = {
            ...messageData,
            msg: msg, // Display the original, unencrypted message in the UI
            sentAt: formatDate(sentAt),
            attachments: attachmentIds, // Include the attachment IDs for rendering
        };

        setMessages((prevMessages) => [
            ...prevMessages,
            <MessageItem
                key={msgId}
                sender={optimisticMessage.sender}
                senderId = {messageData.senderID}
                timestamp={optimisticMessage.sentAt}
                message={optimisticMessage.msg}
                userData={userInfo.data}
                attachmentIds={optimisticMessage.attachments} // Pass the attachment IDs to the MessageItem component
                messageId={msgId}
                userInfo={userInfo}
                chatId = {chatId}
               
            />,
        ]);

        sockCli.current.emit("directMsg", messageData);
    };

    const handleReact = (messageId, emoji) => {
        if (messageId.startsWith("temp-")) return toast.error("Cannot react to unsent messages", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        let updatedReactions = {};
        let updatedMessage = {};
        // Prepare the updated reactions
        const messagesCopy = messages.map((messageComponent) => {
            if (messageComponent.props.messageId === messageId) {
                const currentReactions = messageComponent.props.reactions || {};
                updatedReactions = { ...currentReactions };

                if (updatedReactions[emoji]) {
                    if (updatedReactions[emoji].includes(user.uid)) {
                        updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== user.uid);
                    } else {
                        updatedReactions[emoji].push(user.uid);
                    }
                } else {
                    updatedReactions[emoji] = [user.uid];
                }
                updatedMessage = { ...messageComponent.props, reactions: updatedReactions };
                // Return an updated component for local state update
                return React.cloneElement(messageComponent, {
                    ...messageComponent.props,
                    reactions: updatedReactions,
                });
            }
            return messageComponent;
        });

        // Emit the updateDirectMessage event with updated reactions
        if (sockCli.current) {
            let sentAt = new Date();
            updatedMessage = { chat: chatId, sentAt: sentAt.toISOString(), id: updatedMessage.messageId, reactions: updatedMessage.reactions }
            console.log("Emitting updateDirectMessage event with updated reactions:", updatedMessage);
            sockCli.current.emit("updateDirectMessage", updatedMessage);
        }

        // Update local state
        setMessages(messagesCopy);
    };


    const handleEdit = (messageId, editedText) => {
        let updatedMessage = {};
        // Prepare the updated messages
        const messagesCopy = messages.map((messageComponent) => {
            if (messageComponent.props.messageId === messageId) {
                updatedMessage = { ...messageComponent.props, message: editedText };
                // Return an updated component for local state update
                return React.cloneElement(messageComponent, updatedMessage);
            }
            return messageComponent;
        });

        // Emit the updateDirectMessage event with updated message text
        if (sockCli.current) {
            let sentAt = new Date();
            // Assuming you have chatId and user information available as in handleReact
            const messageUpdate = {
                chat: chatId,
                sentAt: sentAt.toISOString(),
                id: updatedMessage.messageId,
                msg: AES.encrypt(updatedMessage.message, chatId).toString(),
            };
            console.log("Emitting updateDirectMessage event with updated message text:", messageUpdate);
            sockCli.current.emit("updateDirectMessage", messageUpdate);
        }

        // Update local state with the modified messages
        setMessages(messagesCopy);
    };
    // Handler for the friends button
    const openFriends = () => {
        // Toggles the display between ChatWindow and FriendsWindow

        setShowChat(false);
        router.push("/messages");
    };
    const openChat = (userId, chatId) => {
        router.push("/messages?user=" + userId + "&chatID=" + chatId);
    };

    return (
        <>
            <ToastContainer />
            <LoaderComponent
                isLoading={isLoading}
                loadingState={loadingState}
            />

            <div className="flex flex-row flex-grow">
                <DMSideBar
                    userData={userInfo}
                    friendsHandler={() => setShowChat(false)}
                    chatList={directMessages}
                    openChat={openChat}
                    loadingState={loadingState}
                    setLoadingState={setLoadingState}
                    chatHandler={(id, user) => {
                        router.push(`/messages?chatID=${id}&user=${user}`);
                    }}
                />
                {withUser ? (
                    <ChatWindow
                        messages={messages}
                        setMessagess={setMessages}
                        sendPersonalMsg={sendPersonalMsg}
                        userInfo={userInfo}
                        withUserInfo={withUserInfo}
                        withUserId = {withUser}
                        switchToFriends={openFriends}
                        onReact={handleReact}
                        onReply={setReplyTo}
                        replyTo={replyTo}
                        onEdit={handleEdit}
                        onDelete={onDelete}
                        chatId = {chatId}
                    />
                ) : (
                    <FriendsWindow userInfo = {userInfo} handleAliasUpdate  = {handleAliasUpdate}/>
                )}
            </div>
        </>
    );
}