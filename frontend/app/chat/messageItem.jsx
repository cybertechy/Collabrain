import React from 'react';
import Avatar from '@mui/material/Avatar';
// import { ReactComponent as EmojiLaugh } from './path-to-laugh-emoji.svg'; // Replace with actual path to your emoji SVG
// import { ReactComponent as EmojiSad } from './path-to-sad-emoji.svg'; // Replace with actual path to your emoji SVG

const MessageItem = ({ sender, timestamp, message, reactions }) => {
  return (
    <div className="flex items-start space-x-2 p-2 border-b border-gray-300">
      <Avatar alt={sender} src="/assets/images/imagenotFound.jpg" className="w-8 h-8 " /> {/* Replace with actual path */}
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
