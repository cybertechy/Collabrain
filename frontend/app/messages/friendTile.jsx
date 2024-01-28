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
      </Box>

      <ListItemText primary={friendData.name} primaryTypographyProps={{ color: 'black' }} secondary={friendData.status} />
      <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}>
          <NotificationsNoneIcon />
        </IconButton>
        <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%', marginX: 1 }}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      <IconButton edge="end" aria-label="more-options" onClick={() => onMoreOptions(friendData)}>
        <MoreVertIcon />
      </IconButton>
    </ListItem>
  );
};
export default FriendTile;
