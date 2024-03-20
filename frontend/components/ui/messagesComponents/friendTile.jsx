import React, { useState, useEffect } from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemIcon,
  TextField,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useAuthState } from '_firebase/firebase';
import CustomAvatar from './avatar';
import { updateFriendAlias,blockUser } from '@/app/utils/user';
const fb = require("_firebase/firebase");
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const FriendTile = ({ friendData, openChat, setRefreshList , userInfo,id, handleAliasUpdate, handleChatUpdate}) => {
  const [user, loading] = useAuthState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alias, setAlias] = useState('');

  useEffect(() => {
    // This checks if user and friendData.alias are defined to safely access user.uid
    console.log("Userinfo, ",userInfo);
    if (user && userInfo.alias && userInfo.alias[friendData.id]) {
    
      setAlias(userInfo.alias[friendData.id]);
    } else {
      setAlias('');
    }
  }, [user, userInfo, friendData]);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedOption('');
    // Resetting alias to the current value in userInfo
    setAlias(userInfo?.alias?.[friendData.id] || '');
  };
  
  

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log("Our user", user);
    console.log('Option selected:', friendData);
    openDialog();
  };

  const handleDialogAction = async () => {
    if (selectedOption === 'alias' && alias.trim()) {
      const isSuccess = await updateFriendAlias(friendData.id, alias.trim());
      if (isSuccess) {
        console.log(`Alias "${alias}" set for user:`, friendData);
        handleAliasUpdate(friendData.id, alias.trim()); // Call the update function passed as prop
      }
    } else if (selectedOption === 'block') {
      await blockUser(friendData.id);
      console.log('Blocking user:', friendData);
    }
    closeDialog();
  };
  
  

  function handleChatClick(friend) {
    console.log('Chat clicked for:', friend.username);
    if(!user) return;
    // Create a new chat with the current user and the selected friend
    const createChat = async () => {
      try {
        const token = await fb.getToken();
        
        // Replace 'your_server_url' with your actual server URL
        const response = await axios.post(`${SERVERLOCATION}/api/chats/`, {
          members: [id], // Include the current user and the friend in the chat
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log(response.data); // Log the response message (e.g., "Chat created")
                handleChatUpdate();
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
        
        console.log(id);
        const response = await axios.post(`${SERVERLOCATION}/api/users/friends/request/${id}`, null, {
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
        const response = await axios.post(`${SERVERLOCATION}/api/users/friends/${friendData.id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.message); // Log the response message (e.g., "Friend request accepted")
        
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
        console.log(friendData)
        const response = await axios.delete(`${SERVERLOCATION}/api/users/friends/request/${friendData.id}`, {
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
    console.log('Blocking user:', friendData);
    handleClose();
  };

  const handleSetAlias = () => {
    // Add logic to set an alias for the user here
    console.log('Setting alias for user:', friendData);
    handleClose();
  };
console.log("Friend Data in friend tile" , friendData);
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
          <CustomAvatar username={friendData.username} />
        </ListItemAvatar>
        <ListItemText
  primary={
    userInfo.data&& userInfo.data.alias && userInfo.data.alias[friendData.id]
      ? `${userInfo.data.alias[friendData.id]}`
      : friendData.username
  }
  secondary={friendData.email}
  primaryTypographyProps={{ color: 'text.primary' }}
/>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderActionIcons()}
        <IconButton edge="end" onClick={() => setDialogOpen(true)}>
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
  {selectedOption === 'alias' ? (
    <TextField
      autoFocus
      margin="dense"
      id="alias"
      label="Alias"
      type="text"
      fullWidth
      variant="standard"
      value={alias}
      onChange={(e) => setAlias(e.target.value)}
    />
  ) : (
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
  )}
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
