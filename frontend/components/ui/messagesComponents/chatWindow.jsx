import MessageBox from "./messageBox";
import Toolbar from '@mui/material/Toolbar';
import { useState, useEffect, useRef } from "react"; // Import useRef here
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import MessageItem from "./MessageItem";

export default function ChatWindow({ messages, setMessages, sendPersonalMsg, withUserInfo, withUserId, userInfo, switchToFriends, onReact, onReply, replyTo, onEdit, onDelete, chatId }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');
  const [avatar, setAvatar] = useState(withUserInfo?.username || 'User');
  const messagesEndRef = useRef(null); // Create a ref for the scrolling target

  useEffect(() => {
    console.log("withUserInfo", withUserInfo, userInfo, withUserId);
  
    if (withUserInfo && userInfo && withUserId) {
      // Attempt to retrieve an alias. If it doesn't exist, use the username.
      const userAlias = userInfo.data.alias ? userInfo.data.alias[withUserId] : null;
      const username = withUserInfo.data.username || 'User';
  
      setTitle(userAlias || username);
      // Assuming you want to set the avatar to the username for now, as your original logic suggests.
      setAvatar(username);
    }
  }, [withUserInfo, userInfo, withUserId]);

  useEffect(() => {
    // Scroll to the bottom whenever the messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // console.log("Messages in Chat window", messages);
  return (
    <div className="flex flex-col flex-grow relative">
      <div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <IconButton onClick={switchToFriends}>
            <ArrowBackIcon />
          </IconButton>
          <CustomAvatar username={avatar} />
          <span className="ml-2">{title}</span>
        </Toolbar>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-auto overflow-y-scroll p-5 mb-[76px]  max-h-[calc(90vh-160px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-220px)] xl:max-h-[calc(100vh-240px)]">
          {messages?.map((message) => (
            <MessageItem key={message?.key} {...message?.props} title={title} onReact={onReact} onReply={onReply} onEdit={onEdit} onDelete={onDelete} userInfo={userInfo} chatId={chatId}
            />
          ))}
        </div>
        <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
        <div className="absolute bottom-0 left-0 right-0 p-3  bg-white md:px-[2rem]" >
          <MessageBox onSendMessage={sendPersonalMsg} replyTo={replyTo} onReply={onReply} />
        </div>
      </div>
    </div> )
}
