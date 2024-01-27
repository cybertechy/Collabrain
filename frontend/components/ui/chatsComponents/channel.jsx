import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ShortTextIcon from '@mui/icons-material/ShortText'; // This can act as a hash

import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)({
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Adjust hover color as needed
    },
    '& .MuiListItemText-primary': {
        color: '#972FFF', // Set text color to black
    },
    '& .MuiListItemIcon-root': {
        minWidth: 'auto', // Reduce the space if needed
        marginRight: '8px', // Add some space between the icon and the text
        opacity: 0.7, // Slightly lower opacity
    },
});

const Channel = ({ channelName, onChannelSelect }) => {
    return (
        <StyledListItem button onClick={() => onChannelSelect(channelName)}>
            <ListItemIcon>
                <ShortTextIcon style={{ color: '#972FFF', opacity: '0.7' }} /> {/* This represents the hash icon */}
            </ListItemIcon>
            <ListItemText primary={channelName} />
        </StyledListItem>
    );
};

export default Channel;
