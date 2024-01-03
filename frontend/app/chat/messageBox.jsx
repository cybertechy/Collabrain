import TextField from '@mui/material/TextField';

export default function MessageBox()
{
	return (
		<div className='bg-white p-3 rounded-md'>
			<TextField
				size='small'
				fullWidth={true}
				minRows={1}
				maxRows={3}
				id="outlined-textarea"
				placeholder="Message"
				multiline
			/>
		</div>
	);
}