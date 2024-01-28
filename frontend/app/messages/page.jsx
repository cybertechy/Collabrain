"use client";

import { useState, useEffect, useRef } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import { Timestamp } from "firebase/firestore";
import Sidebar from "../../components/ui/template/sidebar/sidebar";
import DMSideBar from "./DMsidebar";
import MessageItem from "../chat/messageItem";
const { useRouter } = require('next/navigation');
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
    const [showChat, setShowChat] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [text, setText] = useState([]);
    const sockCli = useRef(null);
    useEffect(() => {
        if (!user) return;

        sockCli.current = socket.init('http://localhost:8080');
        sockCli.current.on('teamMsg', (data) => {
            console.log("Received message from server");
            setText((prevText) => [
                ...prevText,
                <h1 key={prevText.length} className="text-black">{`${data.sender}: ${data.msg}`}</h1>,
            ]);
        });

        return () => sockCli.current.off('teamMsg');
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
        if (!user) return;

        fb.getToken().then((token) => {
            axios.get(`http://localhost:8080/api/team/LoH1iHOGowBzcYDXEqnu/channel/General/messages`, {
                headers: { "Authorization": "Bearer " + token }
            }).then((res) => {
                console.log(res.data);
                let data = res.data;
                let msgs = data.map((messageData, i) => (
                    <MessageItem
                        key={i}
                        sender={messageData.sender}
                        timestamp={fb.fromFbTimestamp(new Timestamp(messageData.sentAt.seconds, messageData.sentAt.nanoseconds)).toLocaleTimeString()}
                        message={messageData.message}
                        reactions={{}}
						userData = {userInfo.data}
                    />
                ));
                setText(msgs);
            }).catch((err) => console.log(err));
        });
    }, [user]);
	

	const sendPersonalMsg = async (msg) =>
	{
		if (!sockCli.current)
		{
			console.log('Socket is not initialized yet.');
			return;
		}

		let token = await fb.getToken();
		let userData = await axios.get(`http://localhost:8080/api/users/${user.uid}`,
			{ headers: { "Authorization": "Bearer " + token } });
			
		
			let sentAt = new Date();
			const messageData = {
				senderID: fb.getUserID(),
				sender: userInfo.data.username,
			  team: "LoH1iHOGowBzcYDXEqnu",
			  channel: "General",
			  msg: msg,
			  sentAt: fb.toFbTimestamp(sentAt),
			};

		// Add the message to the real-time socket chat
		setText((prevText) => [
			...prevText,
			<MessageItem 
			  key={prevText.length} 
			  sender={messageData.sender}
			  timestamp={sentAt.toLocaleTimeString()} 
			  message={messageData.msg} 
			  reactions={{}} // Add reactions if you have them
			  userData = {userInfo.data}
			/>,
		  ]);

		sockCli.current.emit('teamMsg', messageData); // Send the message to the server
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


    const directMessages = [
        {
          name: 'Jane Doe',
          message: 'Hey, how are you?',
          avatar: 'https://i.pravatar.cc/300?img=1', // This is a placeholder avatar URL
        },
        {
          name: 'John Smith',
          message: 'Sent a photo',
          avatar: 'https://i.pravatar.cc/300?img=2',
        },
        {
          name: 'Alice Johnson',
          message: 'Can we meet tomorrow?',
          avatar: 'https://i.pravatar.cc/300?img=3',
        },
      ];
    
      // Handler for the friends button
      const handleFriendsClick = () => {
        // Toggles the display between ChatWindow and FriendsWindow
        setShowChat((prevShowChat) => !prevShowChat);
      };
    
	return (
        <Template>
            <div className="flex flex-row flex-grow">
                <DMSideBar userData={userInfo} friendsHandler={handleFriendsClick} directMessages={directMessages} />
                {showChat ? (
                    <ChatWindow messages={text} sendPersonalMsg={sendPersonalMsg} userInfo={userInfo} title="General" />
                ) : (
                    <FriendsWindow />
                )}
                {/* <ChatWindow messages={text} sendPersonalMsg={sendPersonalMsg} userInfo={userInfo} /> */}
            </div>
        </Template>
	);
}