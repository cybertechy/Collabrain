import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Channel from './channel'; // Import the Channel component
import { useTTS } from "@/app/utils/tts/TTSContext";

const ChannelButton = ({ channels, onChannelSelect }) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    return (
        <div className='text-primary font-extrabold font-poppins'>
            {channels?.map((x, index) => (
                <Channel
                    key={index}
                    channelName={x.name}
                    onChannelSelect={onChannelSelect}
                    onMouseEnter={() => isTTSEnabled && speak(`Channel ${channelName}`)}
                    onMouseLeave={stop}
                />
            ))}
        </div>
    );
};

export default ChannelButton;
