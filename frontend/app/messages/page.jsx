"use client";

import { useState, useEffect, useRef } from "react";
import DMSideBar from "@/components/ui/messagesComponents/DMSidebar";
import MessageItem from "../chat/messageItem";
const { useRouter, useSearchParams } = require("next/navigation");

const axios = require("axios");
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ChatWindow from "@/components/ui/messagesComponents/chatWindow";
import FriendsWindow from "./friendWindow";
import Template from "@/components/ui/template/template";
import { fetchUser } from "@/app/utils/user";
import { fetchMessages, fetchDirectMessages } from "@/app/utils/messages";
import LoaderComponent from "@/components/ui/loader/loaderComponent";
export default function Messages() {
    const router = useRouter();
    const [user, loading] = fb.useAuthState();
    const [channelsData, setChannelsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingState, setLoadingState] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessages] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);
    const params = useSearchParams();
    const [withUserInfo, setWithUserInfo] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [replyTo, setReplyTo] = useState(null);

    const withUser = params.get("user");
    const chatId = params.get("chatID");

    let sockCli = useRef(null);

    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        
        sockCli.current = socket.init("http://localhost:8080") || {};
        console.log("Socket initialized", sockCli);
        sockCli.current.on("directMsg", (data) => {
            let sentAt = new Date(
                data.sentAt._seconds * 1000 + data.sentAt._nanoseconds / 1000000
            );
            setMessages((prevMessage) => [
                ...prevMessage,
                <MessageItem
                    key={prevMessage.length}
                    sender={data.sender}
                    message={data.msg}
                    timestamp={
                        sentAt.toDateString() +
                        " " +
                        sentAt.toLocaleTimeString()
                    }
                    reactions={{}}
                    onReact = {handleReact}
                    onReply={setReplyTo}
                    attachments = {data.attachments}
                    replyTo = {data.replyTo}
                />,
            ]);
        });
        setIsLoading(false);
        return () => sockCli.current.off("directMsg");
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchedUser = await fetchUser(user.uid);
                setLoadingState("DEFAULT")
                setUserInfo({ data: fetchedUser });
                setLoadingState("FETCHING_MESSAGES");
                const directMessagesData = await fetchDirectMessages(); // Assuming this function is properly defined to fetch direct messages
                console.log("Direct Messages 2: ", directMessagesData);
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
                console.log("Fetching messages for chat:",userInfo);
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



    const uploadAttachments = async (attachments) => {
        // This function should handle the upload logic
        // For each attachment, upload it to your server or storage service
        // Return an array of URLs or references to the uploaded files
      };
    const sendPersonalMsg = async (msg, attachments, replyToMsg, reactions) => {
        if (!sockCli.current) {
            console.log("Socket is not initialized yet.");
            return;
        }
        console.log("Sending Personal Message attributes are:",msg, attachments); // Debug to check the values

        let attachmentUrls = [];
        if (attachments?.length > 0) {
          attachmentUrls = await uploadAttachments(attachments);
          // Handle errors or failures in upload
        }

        let sentAt = new Date();
        const messageData = {
            senderID: user.uid, // Ensure this is the correct Firebase user ID
            sender: userInfo.data.username,
            chat: chatId, // The chat ID for the direct message
            msg: msg,
            sentAt: sentAt, // Convert the date to a Firebase timestamp if necessary
            reactions: reactions, // Starting with an empty array for reactions
            attachments: attachmentUrls
        };

        // Add the message to the real-time socket chat
        setMessages((prevMessage) => [
            ...prevMessage,
            <MessageItem
                key={prevMessage.length}
                messageId = {prevMessage.length}
                sender={messageData.sender}
                timestamp={
                    sentAt.toDateString() + " " + sentAt.toLocaleTimeString()
                }
                message={messageData.msg}
                reactions={reactions} // This is where you'd add reactions if you have them
                userData={userInfo.data}
                onReact = {handleReact}
                onReply={setReplyTo}
                attachments = {attachments}
                replyTo = {replyToMsg}
            />,
        ]);

        sockCli.current.emit("directMsg", messageData); // Send the direct message to the server
        setReplyTo(null); // Reset replyTo state after sending a messagez
    };
    const handleReact = (messageId, emoji) => {
        setMessages((currentMessages) => {
            return currentMessages.map((message, index) => {
                if (index === messageId) {
                    // Clone the reactions object or initialize if undefined
                    let newReactions = { ...message.props.reactions };
                    // If the emoji already exists in reactions
                    if (newReactions[emoji]) {
                        // If it's exactly 1, remove the reaction entirely (toggle off)
                        if (newReactions[emoji] === 1) {
                            delete newReactions[emoji];
                        } else {
                            // Decrement if more than 1 (this handles the case of multiple users reacting with the same emoji)
                            newReactions[emoji] -= 1;
                        }
                    } else {
                        // If the emoji doesn't exist, initialize it with 1
                        newReactions[emoji] = 1;
                    }
                    // Return the updated message with new reactions
                    return {
                        ...message,
                        props: {
                            ...message.props,
                            reactions: newReactions,
                        },
                    };
                }
                return message;
            });
        });
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
        <Template>
            <LoaderComponent
                isLoading={isLoading}
                loadingState={loadingState}
            />

            <div className="flex flex-row flex-grow">
                <DMSideBar
                    userData={userInfo}
                    friendsHandler={() => setShowChat(false)}
                    chatList={directMessages}
                    openChat = {openChat}
                    chatHandler={(id, user) => {
                        router.push(`/messages?chatID=${id}&user=${user}`);
                    }}
                />
                {withUser ? (
                    <ChatWindow
                        messages={message}
                        setMessagess = {setMessages}
                        sendPersonalMsg={sendPersonalMsg}
                        userInfo={userInfo}
                        withUserInfo={withUserInfo}
                        switchToFriends = {openFriends}
                        onReact={handleReact}
                        onReply={setReplyTo}
                        replyTo={replyTo}
                    />
                ) : (
                    <FriendsWindow />
                )}
            </div>
        </Template>
    );
}
