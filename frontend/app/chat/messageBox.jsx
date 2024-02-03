import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px', // Rounded border
    backgroundColor: 'transparent', // Background color similar to Discord
    '& fieldset': {
      border: '1px solid #30475E', // Light border
    },
    '&:hover fieldset': {
      borderColor: '#30475E', // Slightly darker border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#30475E', // Discord's brand color on focus
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#30475E', // Placeholder text color
      opacity: 1,
    },
    '& .MuiInputBase-input': {
      color: '#000000', // Text color
    },
  },
});

export default function MessageBox(props) {
  let inputMsg = useRef();

  return (
    <div className='bg-basicallylight w-full p-3 rounded-md'> {/* Updated container style */}
      <CustomTextField
        size='large'
        fullWidth={true}
        minRows={1}
        maxRows={3}
        inputProps={{ maxLength: 2000 }}
        id="outlined-textarea"
        placeholder="Enter a Message"
        inputRef={inputMsg}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputMsg.current.value.trim() === "") return; // don't send empty message
            props.callback(inputMsg.current.value);
            inputMsg.current.value = ""; // clear input
          }
        }}
        multiline
      />
    </div>
  );
}
