import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import MessageItem from "../chat/messageItem";
import { useState, useEffect } from "react";
import ShortTextIcon from '@mui/icons-material/ShortText';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function ChatWindow({ messages, sendPersonalMsg, withUserInfo, switchToFriends }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');

  useEffect(() => {
    if (withUserInfo) {
      setTitle(withUserInfo?.data?.username || 'User');
    }
  }, [withUserInfo]);

  const handleBackClick = () => {
    switchToFriends();
  };

  return (
    <div className="flex flex-col flex-grow relative">
      <div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <div className='text-lg font-semibold text-primary items-center justify-center flex flex-row'>
            <IconButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
            <div><CustomAvatar username={title} /></div>
            <span className="ml-2">{title}</span>
          </div>
        </Toolbar>
      </div>
      <div className="flex flex-col h-full">
        <div className="p-5 w-full scrollbar-thin scrollbar-thumb-primary text-basicallydark h-[60%] overflow-y-scroll message-container">
          {messages}
        </div>
        <div className="z-10 inset-x-0 flex items-center justify-center text-basicallylight">
          <MessageBox callback={sendPersonalMsg} />
        </div>
      </div>
    </div>
  );
}
