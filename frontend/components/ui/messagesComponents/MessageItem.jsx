import React, { useState, useRef, useEffect } from 'react';
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import Linkify from 'react-linkify';
import EmojiPicker from './EmojiPicker';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
const commonReactions = [
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '👎', label: 'thumbs down' },
  { emoji: '😂', label: 'laugh' },
  { emoji: '❤️', label: 'heart' },
  { emoji: '😮', label: 'surprise' },
  { emoji: '🙏', label: 'pray' },
  { emoji: '😢', label: 'sad' },
];

function MessageItem({ sender, timestamp, message, messageId, attachments, reactions, onReact }) {
  if (attachments){

    console.log(attachments);
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

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };


  const renderReactions = (reactions) => {
    return Object.entries(reactions).map(([emoji, count], index) => (
      <div key={index} className="flex items-center mr-2">
        <span>{emoji}</span>
        <span className="ml-2 text-sm">{count}</span>
      </div>
    ));
  };

  const renderMediaAttachments = (attachments) => {
    return attachments.map((attachment, index) => {
      console.log('Attachment:', attachment); // Debugging: Log attachment object
  
      if (attachment.type.startsWith('image/')) {
        const blobUrl = URL.createObjectURL(attachment);
        return <img key={index} src={blobUrl} alt="attachment" className="max-w-full h-auto" />;
      } else if (attachment.type === 'video') {
        return <video key={index} controls src={attachment.url} className="max-w-full h-auto"></video>;
      } else if (attachment.type === 'file') {
        return <a key={index} href={attachment.url} download={attachment.name} className="text-blue-500 underline">{attachment.name}</a>;
      }
      return null;
    });
  };
  

  const handleEmojiSelect = (emoji) => {
    onReact(emoji); // Assuming `onReact` is a prop function for handling reaction
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  return (
    <div 
      className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded-lg relative" 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
    >
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
        <div className="mt-2 flex">
          {reactions && renderReactions(reactions)}
        </div>
      </div>
      {showEmojiPicker && (
  <div className="absolute right-100 top-10 flex items-center bg-white z-100" style={{ transform: 'translateX(-100%)' }}>
    <EmojiPicker onSelect={handleEmojiSelect} />
  </div>)}
      {(isHovering) && (
        <div className="absolute -top-10 flex items-center bg-white rounded-full shadow-lg p-1" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          {commonReactions.map((reaction, index) => (
            <IconButton key={index} size="small" onClick={() => onReact(reaction.emoji)} title={reaction.label}>
            <span className="text-xl" style={{ opacity: 1, color: 'black' }}>{reaction.emoji}</span>
          </IconButton>
          
          ))}
          <IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <AddIcon />
          </IconButton>
        
        </div>)
      }
        
   
    </div>
  );
}

export default MessageItem;
