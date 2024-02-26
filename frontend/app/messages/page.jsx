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
    const [text, setText] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);
    const params = useSearchParams();
    const [withUserInfo, setWithUserInfo] = useState(null);
    const [showChat, setShowChat] = useState(false);

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
            setText((prevText) => [
                ...prevText,
                <MessageItem
                    key={prevText.length}
                    sender={data.sender}
                    message={data.msg}
                    timestamp={
                        sentAt.toDateString() +
                        " " +
                        sentAt.toLocaleTimeString()
                    }
                    reactions={{}}
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
            setIsLoading(true);
            setLoadingState("FETCHING_MESSAGES");
            try {
                const fetchedMessages = await fetchMessages(chatId);
                setText(fetchedMessages);
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




    const sendPersonalMsg = async (msg) => {
        if (!sockCli.current) {
            console.log("Socket is not initialized yet.");
            return;
        }

        // Assuming you've authenticated and have the user's token
        let token = await fb.getToken();
        let userData = await axios.get(
            `http://localhost:8080/api/users/${user.uid}`,
            {
                headers: { Authorization: "Bearer " + token },
            }
        );

        let sentAt = new Date();
        const messageData = {
            senderID: user.uid, // Ensure this is the correct Firebase user ID
            sender: userInfo.data.username,
            chat: chatId, // The chat ID for the direct message
            msg: msg,
            sentAt: sentAt, // Convert the date to a Firebase timestamp if necessary
            reactions: [], // Starting with an empty array for reactions
        };

        // Add the message to the real-time socket chat
        setText((prevText) => [
            ...prevText,
            <MessageItem
                key={prevText.length}
                sender={messageData.sender}
                timestamp={
                    sentAt.toDateString() + " " + sentAt.toLocaleTimeString()
                }
                message={messageData.msg}
                reactions={{}} // This is where you'd add reactions if you have them
                userData={userInfo.data}
            />,
        ]);

        sockCli.current.emit("directMsg", messageData); // Send the direct message to the server
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
                        messages={text}
                        sendPersonalMsg={sendPersonalMsg}
                        userInfo={userInfo}
                        withUserInfo={withUserInfo}
                        switchToFriends = {openFriends}
                    />
                ) : (
                    <FriendsWindow />
                )}
            </div>
        </Template>
    );
}
