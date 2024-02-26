import MessageBox from "./messageBox";
import Toolbar from '@mui/material/Toolbar';
import { useState, useEffect } from "react";
import ShortTextIcon from '@mui/icons-material/ShortText';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
export default function ChatWindow({ messages, sendPersonalMsg, withUserInfo, switchToFriends }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');

  useEffect(() => {
    if (withUserInfo) {
      setTitle(withUserInfo?.data?.username || 'User');
    }
  }, [withUserInfo]);

  return (
    <div className="flex flex-col flex-grow h-full "> {/* Ensure full height */}
      <div className="flex-none"> {/* Toolbar stays out of scroll context */}
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <IconButton onClick={switchToFriends}>
            <ArrowBackIcon />
          </IconButton>
          <CustomAvatar username={title} />
          <span className="ml-2">{title}</span>
        </Toolbar>
      </div>
      <div className="flex-auto overflow-auto p-5"> {/* Messages scrollable area */}
        {messages.map((message, index) => (
          <MessageItem key={index} {...message} /> // Assuming you spread message properties
        ))}
      </div>
      <div className="flex items-center justify-center p-3 bg-white"> {/* Message box fixed at bottom */}
        <MessageBox callback={sendPersonalMsg} />
      </div>
    </div>
  );
}

