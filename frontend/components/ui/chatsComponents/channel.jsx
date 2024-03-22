import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ShortTextIcon from '@mui/icons-material/ShortText';

const { useSearchParams } = require('next/navigation');
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ isSelected }) => ({
    '& .MuiListItemText-primary': {
        color: isSelected ? 'white' : '#30475E',
        fontWeight: isSelected ? 'bold' : 'normal',
    },
    '& .MuiListItemIcon-root': {
        minWidth: 'auto',
        marginRight: '8px',
        opacity: 0.7,
    },
    backgroundColor: isSelected ? '#81c3d7' : 'inherit',
    '& .MuiListItemIcon-root svg': {
        color: isSelected ? 'white' : '#81c3d7',
        opacity: 0.7,
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        color: '#30475E', // Text color on hover
    },
}));

const Channel = ({ channelName, onChannelSelect }) => {
    const params = useSearchParams();
    const paramchannelName = params.get('channelName');
    const isSelected = paramchannelName === channelName;

    return (
        <StyledListItem
            isSelected={isSelected}
            onClick={() => onChannelSelect(channelName)}
        >
            <ListItemIcon>
                <ShortTextIcon style={{ color: isSelected ? 'white' : '#C9D6DF', opacity: '0.7' }} />
            </ListItemIcon>
            <ListItemText primary={channelName} />
        </StyledListItem>
    );
};

export default Channel;
