import React, { useState, useRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from '@/components/ui/messagesComponents/EmojiPicker';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { set } from 'react-hook-form';
export default function MessageBox({ onSendMessage, replyTo, onReply }) {
  const { t } = useTranslation('msg_box');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [emojiPickerAnchorEl, setEmojiPickerAnchorEl] = useState(null);
  const emojiButtonRef = useRef(null);
  const inputMsg = useRef();
  const fileInputRef = useRef();

  const isEmojiPickerOpen = Boolean(emojiPickerAnchorEl);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Cannot send an empty message.");
      setMessage('');
      setAttachments([]);
      return;
    }

    const attachmentsAsBase64 = await Promise.all(attachments.map(async (file) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve({ base64: reader.result, type: file.type, name: file.name });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }));

    const isAttachmentTooLarge = attachmentsAsBase64.some(attachment => {
      const sizeInBytes = attachment.base64.length * (3/4) - attachment.base64.split('==').length - 2;
      return sizeInBytes > 9000000; // 9 MB in bytes
    });

    if (isAttachmentTooLarge) {
      toast.error("Attachments cannot exceed 9 MB.");
      return;
    }

    onSendMessage(message, attachmentsAsBase64);
    setMessage('');
    setAttachments([]);
  };

  const handleCancelReply = () => {
    onReply(null);
  };

  const addEmoji = (emoji) => {
    if (inputMsg.current) {
      const cursorPosition = inputMsg.current.selectionStart || 0;
      const newText = message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);

      setMessage(newText);
      setTimeout(() => {
        inputMsg.current.focus();
        inputMsg.current.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }, 0);
    }
  };

  const handleAttachmentChange = (event) => {
    setAttachments(Array.from(event.target.files));
  };

  const handleEmojiPickerOpen = () => {
    setEmojiPickerAnchorEl(emojiButtonRef.current);
  };

  const handleEmojiPickerClose = () => {
    setEmojiPickerAnchorEl(null);
  };

  const renderReplyToSnippet = (replyTo) => {
    if (!replyTo) return null;

    const snippet = replyTo.message.length > 20 ? `${replyTo.message.substring(0, 20)}...` : replyTo.message;

    return (
      <div className="p-2 rounded-lg">
        <span className="font-bold text-md">{replyTo.sender}: </span>
        <span className="text-md">{snippet}</span>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center rounded-lg w-full p-2 mx-1 bg-[#30475E] relative">
      <ToastContainer />
      {replyTo && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#406882] text-white">
          {renderReplyToSnippet(replyTo)}
          <IconButton onClick={handleCancelReply} size="small" className="text-white">
            <CloseIcon className='text-white' />
          </IconButton>
        </div>
      )}
      <IconButton ref={emojiButtonRef} onClick={handleEmojiPickerOpen} size="small" className="absolute left-4 z-10 text-white"
      onMouseEnter={() => isTTSEnabled && speak("Choose Emoji button")} onMouseLeave={stop}>
        <EmojiEmotionsIcon className='text-basicallylight' />
      </IconButton>
      <IconButton size="small" className="absolute left-12 z-10 text-white" onClick={() => fileInputRef.current.click()}
      onMouseEnter={() => isTTSEnabled && speak("Attach Files button")} onMouseLeave={stop}>
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
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        ref={inputMsg} 
        className="flex-1 bg-transparent p-4 pl-20 pr-40 text-white placeholder-white outline-none border-none" 
        placeholder={t('enter_msg')}
        onMouseEnter={() => isTTSEnabled && speak("Type your message here")}
        onMouseLeave={stop}
      />
      {attachments.length > 0 && (
        <span className="absolute right-20 z-10 text-white text-sm">
          {attachments.length} {t('files_attached')}
        </span>
      )}
      <IconButton type="submit" size="small" className="absolute right-4 z-10 text-white"
      onMouseEnter={() => isTTSEnabled && speak("Send Message button")} onMouseLeave={stop}>
        <SendIcon className='text-basicallylight'/>
      </IconButton>
      <Popover
        open={isEmojiPickerOpen}
        anchorEl={emojiPickerAnchorEl}
        onClose={handleEmojiPickerClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <EmojiPicker onSelect={addEmoji} />
      </Popover>
    </form>
  );
}
