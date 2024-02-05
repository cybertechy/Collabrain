"use client";

import { useState, useEffect, useRef } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import Sidebar from "../../components/ui/template/sidebar/sidebar";
import DMSideBar from "./DMsidebar";
import MessageItem from "../chat/messageItem";
const { useRouter , useSearchParams} = require('next/navigation');

const axios = require("axios");
const fb = require("_firebase/firebase");
const socket = require("_socket/socket");
import ChatWindow from "./chatWindow";
import FriendsWindow from "./friendWindow";
import ShortTextIcon from '@mui/icons-material/ShortText'; // This can act as a hash
import Template from "@/components/ui/template/template";


export default function Messages() {
    const router = useRouter();
    const [user, loading] = fb.useAuthState();
    const [channelsData, setChannelsData] = useState([]);
   
    const [userInfo, setUserInfo] = useState(null);
    const [text, setText] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);
    const params = useSearchParams();
    const [withUserInfo, setWithUserInfo] = useState(null);
    const [showChat, setShowChat] = useState(false);

    const withUser = params.get('user');
    const chatId = params.get('chatID');
    
    let sockCli = useRef(null);

    useEffect(() => {
        if (!user) return;

        sockCli.current = socket.init('http://localhost:8080') || {};
        sockCli.current.on('directMsg', (data) => {
            console.log("Received message from server");
            setText((prevText) => [
                ...prevText,
                <MessageItem
                    key={prevText.length}
                    sender={data.sender}
                    message={data.msg}
                    timestamp={sentAt.toLocaleTimeString()}
                    reactions={{}}
                />,
            ]);
        });

        return () => sockCli.current.off('directMsg');
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchUser = async () => {
            try {
                const token = await fb.getToken();
                const response = await axios.get(`http://localhost:8080/api/users/${user.uid}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                setUserInfo({ data: response.data });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserInfo({ data: { username: "User" } });
            }
        };

        fetchUser();
    }, [user]);
    
    useEffect(() => {
        if (!user|| !withUser) return;

        const fetchUser = async () => {
            try {
                const token = await fb.getToken();
                const response = await axios.get(`http://localhost:8080/api/users/${withUser}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                setWithUserInfo({ data: response.data });
               
            } catch (error) {
                console.error('Error fetching user data:', error);
                setWithUserInfo({ data: { username: "User" } });
            }
        };

        fetchUser();
    }, [user, withUser]);
    useEffect(() => {
        if (!user || !chatId) return;
    
        const fetchMessages = async () => {
            try {
                const token = await fb.getToken();
                const response = await axios.get(`http://localhost:8080/api/chats/${chatId}/messages`, { 
                    headers: { "Authorization": "Bearer " + token }
                });
                const fetchedMessages = response.data.map((messageData, i) => (
                    <MessageItem
                        key={i}
                        sender={messageData.sender}
                        timestamp={new Date(messageData.sentAt.seconds * 1000).toLocaleTimeString()}
                        message={messageData.message}
                        reactions={messageData.reactions || {}}
                        userData={userInfo.data}
                    />
                ));
                setText(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        // Initial fetch
        fetchMessages();
    
        // Set up an interval for refetching messages every 5 seconds
        const intervalId = setInterval(fetchMessages, 5000);
    
        // Clear the interval when the component unmounts or when user or chatId changes
        return () => clearInterval(intervalId);
    }, [user, chatId]);
    
    
    
    useEffect(() => {
        if (!user) return;
    
        // Fetch direct messages using the new function
        fetchDirectMessages().then((directMessages) => {
          // Update the state with the fetched direct messages
          setDirectMessages(directMessages);
        });
      }, [user]);
	const fetchDirectMessages = async () => {
        try {
          const token = await fb.getToken();
          const response = await axios.get("http://localhost:8080/api/chats/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          // Assuming the response data contains the list of direct messages
          console.log("Direct messages:", response.data);
          return response.data;
        } catch (error) {
          console.error("Error fetching direct messages:", error);
          return [];
        }
      };

      const sendPersonalMsg = async (msg) => {
        if (!sockCli.current) {
            console.log('Socket is not initialized yet.');
            return;
        }
    
        // Assuming you've authenticated and have the user's token
        let token = await fb.getToken();
        let userData = await axios.get(`http://localhost:8080/api/users/${user.uid}`, { 
            headers: { "Authorization": "Bearer " + token } 
        });
    
        
       
    
        let sentAt = new Date();
        const messageData = {
            senderID: user.uid, // Ensure this is the correct Firebase user ID
            sender: userInfo.data.username,
            chat: chatId, // The chat ID for the direct message
            msg: msg,
            sentAt: fb.toFbTimestamp(sentAt), // Convert the date to a Firebase timestamp if necessary
            reactions: [] // Starting with an empty array for reactions
        };
    
        // Add the message to the real-time socket chat
        setText((prevText) => [
            ...prevText,
            <MessageItem 
                key={prevText.length} 
                sender={messageData.sender}
                timestamp={sentAt.toLocaleTimeString()} 
                message={messageData.msg} 
                reactions={{}} // This is where you'd add reactions if you have them
                userData={userInfo.data}
            />,
        ]);
    
        sockCli.current.emit('directMsg', messageData); // Send the direct message to the server
    };
    
	if (loading|| !user )
    return (
        <div className="flex flex-col items-center justify-around min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold mb-5 text-primary">Trying to sign in</h1>
                <div className="loader mb-5"></div>

                <p className="text-lg font-bold text-primary mb-5 ">
                    If you're not signed in, sign in&nbsp;
                    <span className="underline cursor-pointer" onClick={() => router.push("/")}>
                        here
                    </span>
                </p>
            </div>
        </div>
    );


   
    
      // Handler for the friends button
      const openFriends = () => {
        // Toggles the display between ChatWindow and FriendsWindow
        setShowChat(false);
      };
      const openChat = (id) => {
        router.push("/messages?user="+id);
       
      }
      
	return (
        <Template>
            <div className="flex flex-row flex-grow">
                <DMSideBar
                    userData={userInfo}
                    friendsHandler={() => setShowChat(false)}
                    directMessages={directMessages}
                    chatHandler={(id, user) => {router.push(`/messages?chatID=${id}&user=${user}`) }}
                />
                {withUser ? (
                    <ChatWindow
                        messages={text}
                        sendPersonalMsg={sendPersonalMsg}
                        userInfo={userInfo}
                        withUserInfo={withUserInfo}
                        
                    />
                ) : (
                    <FriendsWindow />
                )}
            </div>
        </Template>
	);
}