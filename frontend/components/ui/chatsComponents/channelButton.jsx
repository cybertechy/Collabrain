import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Channel from './channel'; // Import the Channel component

const ChannelButton = ({ channels, onChannelSelect }) => {
    return (
        <div className='text-primary font-extrabold font-poppins'>
            {channels?.map((x, index) => (
                <Channel
                    key={index}
                    channelName={x.name}
                    onChannelSelect={onChannelSelect}
                />
            ))}
        </div>
    );
};

export default ChannelButton;
