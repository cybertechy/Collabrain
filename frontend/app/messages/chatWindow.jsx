import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import MessageItem from "../chat/messageItem";
import { useState, useEffect } from "react";
import ShortTextIcon from '@mui/icons-material/ShortText';
import Avatar from '@mui/material/Avatar';
export default function ChatWindow({ messages, sendPersonalMsg, withUserInfo }) {
  const [title, setTitle] = useState(withUserInfo?.username || 'User');


  useEffect(() => {
    if (withUserInfo) {
      setTitle(withUserInfo.data.username || 'User');
    }
  }, [withUserInfo]);

  function stringAvatar(name = "User") {
    // Split the name into words, capitalize the first letter of each, and join the initials
    const initials = name.split(' ')
      .map(word => word[0] ? word[0].toUpperCase() : '') // Capitalize the first letter of each word
      .join('');

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials, // Use the capitalized initials
    };
  }

  function stringToColor(string = "User") {
    let hash = 0;
    let i;

    // Convert string to hash
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to color
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    // Check if color is too light
    if (isColorLight(color)) {
      // If color is light, return a dark color or adjust the color as needed
      return { backgroundColor: color, color: '#000' }; // light color background, dark text
    } else {
      // If color is dark, return it with a light text color
      return { backgroundColor: color, color: '#fff' }; // dark color background, light text
    }
  }

  function isColorLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155; // Brightness threshold, adjust if needed
  }
  return (
    <div className="flex flex-col flex-grow relative">
      <div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
          <div className='text-lg font-semibold text-primary items-center justify-center flex flex-row'>{<div><Avatar {...stringAvatar(title)} /></div>}{<span className="ml-2">{title}</span>}</div>
        </Toolbar>
      </div>
      <div className="flex flex-col h-[105vh]">
        <div className="p-5 w-full scrollbar-thin scrollbar-thumb-primary text-basicallydark h-[60%] overflow-y-scroll message-container">
          {messages}
        </div>
        <div className="z-10 inset-x-0 bottom-5 text-basicallylight">
          <MessageBox callback={sendPersonalMsg} />
        </div>
      </div>
      
    </div>
  );
}
