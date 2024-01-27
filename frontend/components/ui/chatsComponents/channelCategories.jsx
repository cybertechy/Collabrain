import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Channel from './channel'; // Import the Channel component

const ChannelCategories = ({ categoryName, channels, onChannelSelect }) => {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className='text-primary font-medium font-poppins'>
            <ListItem button onClick={handleClick}>
                <div className='flex flex-row items-center justify-center'>
                {open ? <ExpandLess className='mr-2' /> : <ExpandMore  className='mr-2'/>}
                <ListItemText primary={categoryName} className='uppercase' />
                </div>
          
               
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className='text-primary font-medium font-poppins' style={{ paddingLeft: '20px' }}> {/* Add padding here */}
                    {channels.map((channelName, index) => (
                        <Channel
                            key={index}
                            channelName={channelName}
                            onChannelSelect={onChannelSelect}
                        />
                    ))}
                </List>
            </Collapse>
        </div>
    );
};

export default ChannelCategories;
