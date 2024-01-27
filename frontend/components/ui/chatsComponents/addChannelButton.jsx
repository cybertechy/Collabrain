import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AddChannelButton = ({ onAddChannel }) => {
    return (
        <div className="flex justify-center items-center text-primary">
                
            <IconButton aria-label="add channel" onClick={onAddChannel}>
                <AddCircleOutlineIcon style={{ color: '#972FFF' }} />
            </IconButton>
        </div>
    );
};

export default AddChannelButton;
