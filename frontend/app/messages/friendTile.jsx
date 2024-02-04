// components/FriendTile.js

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
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Import the "add friend" icon
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import {Dialog ,DialogTitle,DialogContent,DialogActions,Button,ListItemIcon,List} from '@mui/material';
import React, { useState } from 'react';
const fb  = require("_firebase/firebase");
const FriendTile = ({ friendData, onMoreOptions, id, setRefreshList, refreshList }) => {
  // Function to generate avatar with initials
  const [user, loading] = fb.useAuthState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    openDialog();
  };

  const handleDialogAction = () => {
    closeDialog();
    if (selectedOption === 'alias') {
      // Handle setting an alias logic here
      console.log('Setting alias for user:', friendData.username);
    } else if (selectedOption === 'block') {
      // Handle blocking user logic here
      console.log('Blocking user:', friendData.username);
    }
  };


  const [anchorEl, setAnchorEl] = useState(null);
  function stringAvatar(name = "User") {
    // Split the name into words, capitalize the first letter of each, and join the initials
    const initials = name.split(' ')
      .map(word => word[0] ? word[0].toUpperCase() : '') // Capitalize the first letter of each word
      .join('');
  
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials, // Use the capitalized initials
    };
  }
  
  function stringToColor(string = "User") {
    let hash = 0;
    let i;
  
    // Convert string to hash
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Convert hash to color
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    // Check if color is too light
    if (isColorLight(color)) {
      // If color is light, return a dark color or adjust the color as needed
      return { backgroundColor: color, color: '#000' }; // light color background, dark text
    } else {
      // If color is dark, return it with a light text color
      return { backgroundColor: color, color: '#fff' }; // dark color background, light text
    }
  }
  
  function isColorLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155; // Brightness threshold, adjust if needed
  }
  function handleChatClick(friend) {
    console.log('Chat clicked for:', friend.username);
    if(!user) return;
    // Create a new chat with the current user and the selected friend
    const createChat = async () => {
      try {
        const token = await fb.getToken();
        
        // Replace 'your_server_url' with your actual server URL
        const response = await axios.post('http://localhost:8080/api/chats/', {
          members: [id], // Include the current user and the friend in the chat
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log(response.data.message); // Log the response message (e.g., "Chat created")
  
        // Handle any UI updates or navigation to the newly created chat here
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    };
  
    createChat(); // Call the function to create the chat
  }
  function handleAddFriendClick() {
    // Make a POST request to send a friend request
    const sendFriendRequest = async () => {
      try {
        const token = await fb.getToken();
  
       
        const response = await axios.post(`http://localhost:8080/api/users/friends/request/${id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log(response.data.message); // Log the response message (e.g., "Friend request sent")
  
       
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    };
  
    sendFriendRequest(); // Call the function to send the friend request
  }

  const handleAcceptFriendRequest = () => {
    // Make a POST request to accept the friend request
    const acceptFriendRequest = async () => {
      try {
        const token = await fb.getToken();

        console.log(token);
        const response = await axios.post(`http://localhost:8080/api/users/friends/${friendData.user}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.message); // Log the response message (e.g., "Friend request accepted")
        setRefreshList
        // Handle any UI updates or state changes here, such as changing the friend's listType to 'accepted'
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    };

    acceptFriendRequest(); // Call the function to accept the friend request
  };

  const handleDeclineFriendRequest = () => {
    // Make a DELETE request to decline the friend request
    const declineFriendRequest = async () => {
      try {
        const token = await fb.getToken();

        // Replace 'your_server_url' with your actual server URL
        const response = await axios.delete(`http://localhost:8080/api/users/friends/request/${friendData.user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { type: "decline" }, // Specify the type as "decline"
        });

        console.log(response.data.message); // Log the response message (e.g., "Friend request declined")

        // Handle any UI updates or state changes here, such as removing the friend request from the list
      } catch (error) {
        console.error("Error declining friend request:", error);
      }
    };

    declineFriendRequest(); // Call the function to decline the friend request
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
              color: 'green', // Apply green color to CheckCircleIcon
            }}
            onClick={handleAcceptFriendRequest}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '50%',
              marginX: 1,
              color: 'red', // Apply red color to CancelIcon
            }}
            onClick={handleDeclineFriendRequest}
          >
            <CancelIcon />
          </IconButton>
        </>
      );
    } else if (friendData.listType === 'blocked') {
      // Render nothing for blocked friends
      return null;
    } else if (friendData.listType === 'addFriend') {
      // Render chat and add friend icons for searching users
      return (
        <>
          <IconButton
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '50%',
              marginX: 1,
            }}
            onClick={() => handleChatClick(friendData)}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '50%',
               // Apply blue color to PersonAddIcon
            }}
            onClick={() => handleAddFriendClick(friendData)}
          >
            <PersonAddIcon /> {/* Use the PersonAddIcon for "add friend" */}
          </IconButton>
        </>
      );
    } else {
      // Default rendering for 'all' and other types
      return (
        <>
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%', marginX: 1 }}
            onClick={() => handleChatClick(friendData)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </>
      );
    }
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlockUser = () => {
    // Add logic to block the user here
    console.log('Blocking user:', friendData.username);
    handleClose();
  };

  const handleSetAlias = () => {
    // Add logic to set an alias for the user here
    console.log('Setting alias for user:', friendData.username);
    handleClose();
  };

  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemAvatar>
          <Avatar {...stringAvatar(friendData.username)} />
        </ListItemAvatar>
        <ListItemText
          primary={friendData.username}
          primaryTypographyProps={{ color: '#000000' }}
          secondary={friendData.email}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderActionIcons()}
        <IconButton
          edge="end"
          aria-label="more-options"
          onClick={openDialog}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Select an Option</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={() => handleOptionClick('alias')}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Set Alias" />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick('block')}>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary="Block User" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogAction} color="primary">
            Confirm
          </Button>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default FriendTile;