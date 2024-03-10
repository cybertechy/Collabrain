import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ onSelect }) => {
  return (
    <Picker
      data={data}
      onEmojiSelect={(emoji) => {
        onSelect(emoji.native);
      }}
      theme="auto" // or 'light' or 'dark'
    />
  );
};

export default EmojiPicker;