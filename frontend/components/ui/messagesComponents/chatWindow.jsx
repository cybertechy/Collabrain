import MessageBox from "./messageBox";
import Toolbar from '@mui/material/Toolbar';
import { useState, useEffect, useRef } from "react"; // Import useRef here
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import MessageItem from "./MessageItem";

export default function ChatWindow({ messages, setMessages, sendPersonalMsg, withUserInfo, switchToFriends }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');
  const messagesEndRef = useRef(null); // Create a ref for the scrolling target
  const handleReact = (messageId, emoji) => {
    // Assuming messages is an array of message objects in the parent component
    setMessages(messages => messages.map(message => {
      if (message.id === messageId) {
        const newReactions = { ...message.reactions };
        if (newReactions[emoji]) {
          newReactions[emoji] += 1;
        } else {
          newReactions[emoji] = 1;
        }
        return { ...message, reactions: newReactions };
      }
      return message;
    }));
  };
  useEffect(() => {
    if (withUserInfo) {
      setTitle(withUserInfo?.data?.username || 'User');
    }
  }, [withUserInfo]);

  useEffect(() => {
    // Scroll to the bottom whenever the messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log("MESSAGES ARE ", messages);

  return (
    <div className="flex flex-col flex-grow h-full relative">
      <div className="flex-none">
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <IconButton onClick={switchToFriends}>
            <ArrowBackIcon />
          </IconButton>
          <CustomAvatar username={title} />
          <span className="ml-2">{title}</span>
        </Toolbar>
      </div>
      <div className="flex-auto overflow-y-scroll p-5 mb-[76px] max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-220px)] xl:max-h-[calc(100vh-240px)]">
        {messages?.map((message, index) => (
          <MessageItem key={index} {...message.props} onReact = {handleReact}/>
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3  bg-white" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <MessageBox callback={sendPersonalMsg} />
      </div>
    </div>
  );
}
