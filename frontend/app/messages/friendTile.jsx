// components/FriendTile.js
import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'; // Example icon, replace with the one you need
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Example icon, replace with the one you need
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for "accept"
import CancelIcon from '@mui/icons-material/Cancel'; // Icon for "reject"

const FriendTile = ({ friendData, onMoreOptions }) => {
  // Function to generate avatar with initials
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
    };
  };

  // Function to generate a color from a string
  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };
  const renderActionIcons = () => {
    if (friendData.listType === 'pending') {
      // Render Tick and Cross for pending friends
      return (
        <>
        <IconButton 
          sx={{ 
            bgcolor: 'action.hover', 
            borderRadius: '50%',
            color: 'green' // Apply green color to CheckCircleIcon
          }}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            bgcolor: 'action.hover', 
            borderRadius: '50%', 
            marginX: 1,
            color: 'red' // Apply red color to CancelIcon
          }}
        >
          <CancelIcon />
        </IconButton>
      </>
      
      );
    } else if (friendData.listType === 'blocked') {
      // Render nothing for blocked friends
      return null;
    } else {
      // Default rendering for 'all' and other types
      return (
        <>
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%', marginX: 1 }}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </>
      );
    }
  };

  return (
    <ListItem 
      sx={{ 
        bgcolor: 'background.paper', 
        '&:hover': { bgcolor: 'action.hover' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} 
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemAvatar>
          <Avatar {...stringAvatar(friendData.name)} />
        </ListItemAvatar>
        <ListItemText primary={friendData.name} primaryTypographyProps={{ color: '#000000' }} secondary={friendData.status} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderActionIcons()}
        <IconButton edge="end" aria-label="more-options" onClick={() => onMoreOptions(friendData)}>
          <MoreVertIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};
export default FriendTile;
