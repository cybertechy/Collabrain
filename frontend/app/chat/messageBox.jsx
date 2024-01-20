import TextField, { textFieldClasses } from '@mui/material/TextField';
import { useRef } from 'react';

export default function MessageBox(props)
{
	let inputMsg = useRef();
	return (
		<div className='bg-[#40444b] p-3 rounded-md'>
			<TextField
				sx={{ "& fieldset": { border: 'none' } }}
				size='small'
				fullWidth={true}
				minRows={1}
				maxRows={3}
				inputProps={{ maxLength: 2000, style: { color: 'white' } }}
				id="outlined-textarea"
				placeholder="Message"
				inputRef={inputMsg}
				onKeyDown={(e) =>
				{
					if (e.key === 'Enter' && !e.shiftKey)
					{
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