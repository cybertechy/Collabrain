import React, { useState, useRef, useEffect } from 'react';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import Linkify from 'react-linkify';

import IconButton from '@mui/material/IconButton';
import ReplyIcon from '@mui/icons-material/Reply';
const commonReactions = [
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '👎', label: 'thumbs down' },
  { emoji: '😂', label: 'laugh' },
  { emoji: '❤️', label: 'heart' },
  { emoji: '😮', label: 'surprise' },
  { emoji: '🙏', label: 'pray' },
  { emoji: '😢', label: 'sad' },
];

function MessageItem({ sender, timestamp, message, messageId, attachments, reactions, onReact, onReply, replyTo }) {
  if (reactions && reactions.length>0){

   console.log(`reactions are` , reactions)
  }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Ref for the emoji picker
  const CustomLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
      {children}
    </a>
  );
  const [isHovering, setIsHovering] = useState(false);
  const extractUrls = (message) => {
    if (!message) return []; // Ensure message is not undefined or empty
    const urlRegex = /https?:\/\/[^\s]+/g;
    return message.match(urlRegex) || [];
  };
  

  

  // Extract URLs from the current message
  const urls = extractUrls(message);
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

 

  const renderMediaAttachments = (attachments) => {
    return (attachments || []).map((attachment, index) => {
      if (!attachment || typeof attachment !== 'object') return null; // Ensure attachment is defined and is an object
  
      console.log('Attachment:', attachment); // Debugging: Log attachment object
  
      if (attachment && attachment.type.startsWith('image/')) {
        const blobUrl = URL.createObjectURL(attachment);
        return <img key={index} src={blobUrl} alt="attachment" className="max-w-full h-auto" />;
      } else if (attachment && attachment.type === 'video') {
        return <video key={index} controls src={attachment.url} className="max-w-full h-auto"></video>;
      } else if (attachment && attachment.type === 'file') {
        return <a key={index} href={attachment.url} download={attachment.name} className="text-blue-500 underline">{attachment.name}</a>;
      }
      return null;
    });
  };
  

 
  const handleReply = () => {
    onReply({sender:sender, timestamp:timestamp, message:message, messageId:messageId, attachments:attachments}); // Pass the entire message object
  };
  
  return (
    <div className="relative border-b-2 hover:bg-gray-100" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    {replyTo &&  (
      <div className="bg-gray-100 p-3 rounded-lg mb-2">
        <span className = "text-md font-poppins font-semibold"> Replying To </span>
        <span className="text-md font-poppins font-semibold">{replyTo.sender}: </span>
        {/* Truncate reply message if needed */}
        <span className="text-md">{replyTo.message.length > 20 ? replyTo.message.substring(0, 20) + "..." : replyTo.message}</span>
      </div>
    )}
    <div className="flex gap-4 p-2">
      <CustomAvatar username={sender} />
      <div className="flex flex-col">
     
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{sender}</span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
          <CustomLink href={decoratedHref} key={key}>{decoratedText}</CustomLink>
        )}>
          <p className="whitespace-pre-wrap break-words max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">{message}</p>
      {urls.map((url, index) => (
        <div key={index} className="iframe-container my-2">
          <iframe 
            src={url} 
            title="URL Preview" 
            width="300" 
            height="200"
            style={{ border: 'none' }}
            //sandbox="allow-scripts allow-same-origin"
            > {/* Use sandbox for added security */}
          </iframe>
        </div>
      ))}
        </Linkify>
        {attachments && (
          <div className="mt-2 flex flex-wrap gap-2">
            {renderMediaAttachments(attachments)}
          </div>
        )}
        {reactions && Object.keys(reactions).length > 0 && (
  <div className="mt-2 flex">
    {Object.entries(reactions).map(([emoji, count], index) => (
      <div key={index} className="flex items-center mr-2">
        <span>{emoji}</span>
        <span className="ml-2 text-sm">{count}</span>
      </div>
    ))}
  </div>
)}
      </div>
      </div>
      {(isHovering) && (
        <div className={`absolute inset-x-0 top-0 flex justify-between items-center p-1 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute -top-10 left-0 flex items-center bg-white rounded-full border-2 shadow-lg p-1" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {commonReactions.map((reaction, index) => {
        // Check if the current reaction is included in the message's reactions
        const isReacted = reactions && reactions[reaction.emoji];
        return (
            <IconButton 
                key={index} 
                size="small" 
                onClick={() => {onReact(messageId, reaction.emoji)}}
                // Apply a different style if the reaction is already selected
                style={{ backgroundColor: isReacted ? '#f0f0f0' : 'transparent' }}
                title={reaction.label}>
                <span className="text-xl" style={{ opacity: 1, color: isReacted ? 'black' : 'grey' }}>
                    {reaction.emoji}
                </span>
            </IconButton>
        );
    })}
          {/* <IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <AddIcon />
          </IconButton>
         */}
         
        </div>
        {/* {showEmojiPicker && (
          <div className="absolute items-center mt-2 bg-white z-50" style={{ transform: 'translateX(-100%)', position: 'absolute', right: '0' }}>
            <EmojiPicker onSelect={handleEmojiSelect} />
          </div>
        )} */}
        <div className="absolute -top-10  right-0 flex items-center bg-white rounded-t-full shadow-xl border-2 p-1" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          {/* Render common reactions and AddIcon button */}
          <IconButton size="small" onClick={() => handleReply()} title="Reply">
            <ReplyIcon />
          </IconButton>
        </div>
          
        </div>
        )
      }
        
   
    </div>
  );
}

export default MessageItem;
