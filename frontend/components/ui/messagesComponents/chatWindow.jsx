import MessageBox from "./messageBox";
import Toolbar from '@mui/material/Toolbar';
import { useState, useEffect, useRef } from "react"; // Import useRef here
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import MessageItem from "./MessageItem";

export default function ChatWindow({ messages, setMessages, sendPersonalMsg, withUserInfo,withUserId,userInfo, switchToFriends ,onReact, onReply, replyTo , onEdit, onDelete,chatId }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');
  const [avatar,setAvatar] = useState(withUserInfo?.username || 'User');
  const messagesEndRef = useRef(null); // Create a ref for the scrolling target

  useEffect(() => {
    if (withUserInfo && userInfo && userInfo.data) {
      console.log("asdas",userInfo);
      setTitle(userInfo?.data?.alias[withUserId] ? userInfo?.data?.alias[withUserId]: withUserInfo?.data?.username || 'User');
      setAvatar(withUserInfo?.data?.username || 'User');
    }
  }, [withUserInfo, userInfo]);

  useEffect(() => {
    // Scroll to the bottom whenever the messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 
// console.log("Messages in Chat window", messages);
  return (
    <div className="flex flex-col flex-grow h-full relative">
      <div className="flex-none">
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <IconButton onClick={switchToFriends}>
            <ArrowBackIcon />
          </IconButton>
          <CustomAvatar username={avatar} />
          <span className="ml-2">{title}</span>
        </Toolbar>
      </div>
      <div className="flex-auto overflow-y-scroll p-5 mb-[76px]  max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-220px)] xl:max-h-[calc(100vh-240px)]">
       <div className="mt-10"></div>
        {messages?.map((message) => (
          <MessageItem key={message?.key} {...message?.props} title = {title} onReact = {onReact} onReply ={onReply} onEdit = {onEdit} onDelete = {onDelete}   userInfo={userInfo} chatId = {chatId}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3  bg-white" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <MessageBox onSendMessage={sendPersonalMsg} replyTo = {replyTo} onReply = {onReply}/>
      </div>
    </div>
  );
}
