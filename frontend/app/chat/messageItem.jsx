import React from 'react';
import Avatar from '@mui/material/Avatar';

function stringAvatar(name = "User") {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

function stringToColor(string = "User") {
  let hash = 0;
  let i;

  /* Convert string to hash */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  /* Convert hash to color */
  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const MessageItem = ({ sender, timestamp, message, reactions, userData }) => {
  return (
    <div className="flex items-start space-x-2 p-2 border-b border-gray-300">
      <Avatar {...stringAvatar(userData.fname? (userData.fname + " " +  userData.lname):sender == "System" ? "System": "User")} /> {/* Replace with actual path */}
      <div className="flex flex-col">
        <div className="text-sm font-medium">{sender}</div>
        <div className="text-xs text-gray-500">{timestamp}</div>
        <div className="text-sm mt-1">{message}</div>
        {/* <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center">
            <EmojiLaugh className="w-4 h-4" />
            <span className="text-xs">{reactions.laugh}</span>
          </div>
          <div className="flex items-center">
            <EmojiSad className="w-4 h-4" /> 
            <span className="text-xs">{reactions.sad}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MessageItem;
