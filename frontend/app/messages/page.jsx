"use client";

import { useState, useEffect, useRef } from "react";
import DMSideBar from "@/components/ui/messagesComponents/DMSidebar";
import MessageItem from "../chat/messageItem";
const { useRouter, useSearchParams } = require("next/navigation");
import AES from "crypto-js/aes";
import { maskProfanity , containsProfanity } from "../utils/textmoderator";
import enc from "crypto-js/enc-utf8";
const axios = require("axios");
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ChatWindow from "@/components/ui/messagesComponents/chatWindow";
import FriendsWindow from "./friendWindow";
import Template from "@/components/ui/template/template";
import { fetchUser } from "@/app/utils/user";
import { fetchMessages, fetchDirectMessages } from "@/app/utils/messages";
import LoaderComponent from "@/components/ui/loader/loaderComponent";
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
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

        sockCli.current = socket.init(SERVERLOCATION) || {};
        console.log("Socket initialized", sockCli);
        sockCli.current.on("directMsg", (data) => {
            let sentAt = new Date(
                data.sentAt._seconds * 1000 + data.sentAt._nanoseconds / 1000000
            );

            data.msg = AES.decrypt(data.msg, chatId).toString(enc);

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
                    onReact={handleReact}
                    onReply={setReplyTo}
                    attachments={data.attachments}
                    replyTo={data.replyTo}
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

                directMessagesData.forEach((chat) => {
                    if ("lastMessage" in chat) {
                        try {
                            chat.lastMessage.message = AES.decrypt(chat.lastMessage.message, chat.id).toString(enc);
                            if(chat.lastMessage.message === "") chat.lastMessage.message = "Unencrypted Message";
                        } catch (error) {
                            console.error("Error decrypting message:", error);
                            chat.lastMessage.message = "Unencrypted Message";
                        }
                    }
                });


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
                console.log("Fetching messages for chat:", userInfo);
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
        return new Date(date).toLocaleString('en-US', {
          hour12: true, // Use 12-hour clock
          month: 'numeric', // Numeric month, e.g., 3, 4, ...
          day: 'numeric', // Numeric day of the month
          year: 'numeric', // 4-digit year
          hour: 'numeric', // Numeric hour
          minute: '2-digit', // 2-digit minute
          second: '2-digit' // 2-digit second
        });
      };
      
      

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
          // Assuming uploadAttachments is an async function that uploads files and returns their URLs
          attachmentUrls = await uploadAttachments(attachments);
          // Handle errors or failures in upload
        }

        msg = maskProfanity(msg, "*");

        let sentAt = new Date();
        const formattedSentAt = formatDate(sentAt);

        const messageData = {
            senderID: user.uid, // Ensure this is the correct Firebase user ID
            sender: userInfo.data.username, // Assuming this is how you get the username
            chat: chatId, // The chat ID for the direct message
            msg: msg,
            sentAt: sentAt.toISOString(), // Convert to ISO string for consistency
            reactions: reactions || [], // Ensure there are default reactions if none provided
            attachments: attachmentUrls // This should be the processed URLs from uploadAttachments
        };
    
        // Add the message to the real-time socket chat
        setMessages((prevMessage) => [
            ...prevMessage,
            <MessageItem
                key={prevMessage.length}
                messageId={prevMessage.length}
                sender={messageData.sender}
                timestamp={formattedSentAt}
                message={messageData.msg}
                reactions={messageData.reactions}
                userData={userInfo.data}
                onReact={handleReact}
                onReply={setReplyTo}
                attachments={attachmentUrls} // Use the URLs from uploadAttachments
                replyTo={replyToMsg}
            />,
        ]);

        if(containsProfanity(msg,true)) return;

        messageData.msg = AES.encrypt(msg, chatId).toString();

        sockCli.current.emit("directMsg", messageData); // Send the direct message to the server
        setReplyTo(null); // Reset replyTo state after sending a message
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
                    openChat={openChat}
                    chatHandler={(id, user) => {
                        router.push(`/messages?chatID=${id}&user=${user}`);
                    }}
                />
                {withUser ? (
                    <ChatWindow
                        messages={message}
                        setMessagess={setMessages}
                        sendPersonalMsg={sendPersonalMsg}
                        userInfo={userInfo}
                        withUserInfo={withUserInfo}
                        switchToFriends={openFriends}
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
