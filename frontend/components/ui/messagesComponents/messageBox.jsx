import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from '@/components/ui/messagesComponents/EmojiPicker';
import Popover from '@mui/material/Popover';

export default function MessageBox(props) {
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
    if (props.onSendMessage) {
      props.onSendMessage(data.message, data.attachments);
    }
    reset({ message: '', attachments: [] });
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
  const handleSendButtonClick = () => {
    if (inputMsg.current.value.trim() === "") return; // don't send empty message
    props.callback(inputMsg.current.value);
    inputMsg.current.value = ""; // clear input
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center rounded-lg w-full p-3 mx-5 bg-[#30475E] relative">
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
