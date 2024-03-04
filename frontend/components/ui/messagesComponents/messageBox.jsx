import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from '@/components/ui/messagesComponents/EmojiPicker';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
export default function MessageBox({onSendMessage, replyTo, onReply}) {
  if(replyTo){
    console.log("Reply to is ",replyTo);
  }
  const { handleSubmit, reset, setValue, getValues, watch, register } = useForm({
    defaultValues: {
      message: '',
      attachments: [],
    },
  });
  const inputMsg = useRef();  
   const fileInputRef = useRef();
  const message = watch('message');
   const attachments = watch('attachments');
  const [emojiPickerAnchorEl, setEmojiPickerAnchorEl] = useState(null);
  
  const emojiButtonRef = useRef(null); // Add this line

  // Modify handleEmojiPickerOpen to use the ref
  const handleEmojiPickerOpen = () => {
    setEmojiPickerAnchorEl(emojiButtonRef.current);
  };
  const handleEmojiPickerClose = () => {
    setEmojiPickerAnchorEl(null);
  };

  const isEmojiPickerOpen = Boolean(emojiPickerAnchorEl);

  const onSubmit = (data) => {
    console.log("In message box, data is",data); // Debug to check the structure of 'data'
    if (onSendMessage) {
        onSendMessage(data.message, data.attachments, replyTo);
    }
    reset({ message: '', attachments: [] });
    onReply(null); 
};

  const handleCancelReply = () => {
    onReply(null); // Clear the replyTo state
  };
  const addEmoji = (emoji) => {
    if (inputMsg.current) {
      const cursorPosition = inputMsg.current.selectionStart || 0;
      const currentValue = inputMsg.current.value;
      const newText = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
      
      // Update the form state
      setValue('message', newText, { shouldValidate: true });
  
      // Manually update the input's displayed value
      inputMsg.current.value = newText;
  
      // Optionally, focus the input and set the cursor position right after the inserted emoji
      inputMsg.current.focus();
      const newCursorPosition = cursorPosition + emoji.length;
      inputMsg.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  };
  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    console.log(files); // Debugging: Log selected files
    setValue('attachments', files, { shouldValidate: true });
  };
  const renderReplyToSnippet = (replyTo) => {
    if (!replyTo) return null;
    
    // Extract the first 20 characters of the replyTo message
    const snippet = replyTo.message.length > 20 
      ? replyTo.message.substring(0, 20) + "..."
      : replyTo.message;
  
    return (
      <div className=" p-2 rounded-lg">
        <span className="font-bold text-md">{replyTo.sender}: </span>
        <span className="text-md">{snippet}</span>
      </div>
    );
  };
  const handleSendButtonClick = () => {
    if (inputMsg.current.value.trim() === "") return; // don't send empty message
    onSendMessage(inputMsg.current.value);
    inputMsg.current.value = ""; // clear input
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center rounded-lg w-full p-3 mx-5 bg-[#30475E] relative">
    
    {replyTo && (
        <div className="flex items-center justify-between p-2  rounded-lg bg-[#406882] text-white">
          {renderReplyToSnippet(replyTo)}
          <IconButton onClick={handleCancelReply} size="small" className="text-white">
            <CloseIcon className='text-white' />
          </IconButton>
        </div>
      )}
    <IconButton ref={emojiButtonRef} onClick={handleEmojiPickerOpen} size="small" className="absolute left-4 z-10 text-white">
      <EmojiEmotionsIcon className='text-basicallylight' />
    </IconButton>
    <IconButton size="small" className="absolute left-12 z-10 text-white" onClick={() => fileInputRef.current.click()}>
      <AttachFileIcon className='text-basicallylight' />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleAttachmentChange}
        style={{ display: 'none' }}
      />
    </IconButton>
      <input
        {...register('message')}
        ref={inputMsg}
        className="flex-1 bg-transparent p-4 pl-20 pr-40 text-white placeholder-white outline-none border-none"
        placeholder="Enter a Message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendButtonClick();
          }
        }}
      />
      {attachments.length > 0 && (
        <span className="absolute right-20 z-10 text-white text-sm">
          {attachments.length} file(s) attached
        </span>
      )}
      <IconButton type="submit" onClick={handleSendButtonClick} size="small" className="absolute right-4 z-10 text-white">
        <SendIcon className='text-basicallylight'/>
      </IconButton>
      <Popover
  open={isEmojiPickerOpen}
  anchorEl={emojiPickerAnchorEl}
  onClose={handleEmojiPickerClose}
  anchorOrigin={{
    vertical: 'top', // This positions the anchor point at the top of the anchorEl
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'bottom', // This will make the Popover "grow" upwards from the bottom
    horizontal: 'left',
  }}
>
  <EmojiPicker onSelect={addEmoji} />
</Popover>

    </form>
  );
}
