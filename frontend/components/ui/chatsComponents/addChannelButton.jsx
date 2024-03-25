import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTTS } from "@/app/utils/tts/TTSContext";

const AddChannelButton = ({ onAddChannel }) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    return (
        <div className="flex justify-center items-center text-primary">
                
            <IconButton aria-label="add channel" onClick={onAddChannel}
            onMouseEnter={() => isTTSEnabled && speak("Add a Channel button")} onMouseLeave={stop}>
                <AddCircleOutlineIcon style={{ color: '#30475E' }} />
            </IconButton>
        </div>
    );
};

export default AddChannelButton;
