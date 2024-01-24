import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px', // Rounded border
    '& fieldset': {
      border: 'none', // Remove border
    },
    '&:hover fieldset': {
      borderColor: 'red', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green', // Border color when focused
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 1,
    },
    '& .MuiInputBase-input': {
      color: 'white', // Text color
    },
  },
});

export default function MessageBox(props) {
  let inputMsg = useRef();

  return (
    <div className='bg-transparent p-3 rounded-md'>
      <CustomTextField
        size='small'
        fullWidth={true}
        minRows={1}
        maxRows={3}
        inputProps={{ maxLength: 2000 }}
        id="outlined-textarea"
        placeholder="Message"
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
