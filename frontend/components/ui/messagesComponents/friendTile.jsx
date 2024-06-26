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
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { useTTS } from "@/app/utils/tts/TTSContext";
import { updateFriendAlias,blockUser } from '@/app/utils/user';
const fb = require("_firebase/firebase");
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
import { unblockUser } from '@/app/utils/user';

import { ToastContainer, toast } from "react-toastify";
const FriendTile = ({ friendData, openChat, setRefreshList , userInfo,id, handleAliasUpdate, handleChatUpdate}) => {
  const { t } = useTranslation('dms');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [user, loading] = useAuthState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alias, setAlias] = useState('');

  useEffect(() => {
    // This checks if user and friendData.alias are defined to safely access user.uid
    console.log("Userinfo, ",userInfo);
    if (user && userInfo.aliases && userInfo.aliases[friendData.id]) {
    
      setAlias(userInfo.aliases[friendData.id]);
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
    setAlias(userInfo?.aliases?.[friendData.id] || '');
  };
  
  

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log("Our user", user);
    console.log('Option selected:', friendData);
    if(option === 'alias'){
    openDialog();}
  else if(option === 'block'){
  handleBlockUser().then(()=>{handleChatUpdate()});
  ;}
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
        toast.success("Friend request sent");
       
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
        toast.success("Friend request accepted");
        handleFriendListUpdate();
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
        toast.success("Friend request declined");
        handleFriendListUpdate();
        // Handle any UI updates or state changes here, such as removing the friend request from the list
      } catch (error) {
        console.error("Error declining friend request:", error);
      }
    };

    declineFriendRequest(); // Call the function to decline the friend request
  };
const renderActionIcons = () => {
  if (friendData.listType === 'blocked') {
    // Don't render any icons for blocked friends
    return null;
  } else if (friendData.listType === 'addFriend') {
    // Render the chat and add friend icons for users found during search
    return (
      <>
        <IconButton
          sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}
          onClick={() => handleChatClick(friendData)}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton
          sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}
          onClick={handleAddFriendClick}
        >
          <PersonAddIcon />
        </IconButton>
      </>
    );
  } else if (friendData.listType === 'pending') {
    // Render accept and decline icons for pending friend requests
    return (
      <>
        <IconButton
          sx={{
            background: 'success', // Use a theme color for success, adjusts background color to a success context, e.g., green
          
            borderRadius: '50%',
          }}
          onClick={handleAcceptFriendRequest}
        >
          <CheckCircleIcon sx={{ color: '#00FF00' }} /> {/* Adjusts the icon color */}
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: 'error', // Use a theme color for error, adjusts background color to an error context, e.g., red
           
            borderRadius: '50%',
          }}
          onClick={handleDeclineFriendRequest}
        >
          <CancelIcon sx={{ color: '#FF0000' }} /> {/* Adjusts the icon color */}
        </IconButton>
      </>
    );
  }
  // Render default icons for other list types ('all', etc.)
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
};



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUnblockUser = async () => {
    // Logic to unblock the user
    console.log('Unblocking user:', friendData);
    // Assume you have an unblockUser function similar to blockUser
    await unblockUser(friendData.id).then(()=>{handleChatUpdate()});;
    closeDialog();
  };

  const handleBlockUser = async () => {
    try {
        const token = await fb.getToken(); // Make sure this method correctly retrieves the current user's token
       const response =  await axios.post(`${SERVERLOCATION}/api/users/block/${friendData.id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('User blocked successfully', response.data);
        closeDialog();
    } catch (error) {
        console.error('Error blocking user:', error.response?.data || error.message);
        // Optionally, handle errors in the UI here
    }
  };

  const handleSetAlias = () => {
    // Add logic to set an alias for the user here
    console.log('Setting alias for user:', friendData);
    handleClose();
  };
  console.log("Friend Data in friend tile" , friendData);

  const handleAlias = () => {
    if (isTTSEnabled) {
      speak('Set Alias button');
    }
  };

  const handleBlock = () => {
    if (isTTSEnabled) {
      speak('Block User button');
    }
  };

  const handleLeave = () => {
    stop();
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
          <CustomAvatar username={friendData.username} />
        </ListItemAvatar>
        <ListItemText
  primary={
    userInfo.data&& userInfo.data.aliases && userInfo.data.aliases[friendData.id]
      ? `${userInfo.data.aliases[friendData.id]}`
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
        <DialogTitle onMouseEnter={() => isTTSEnabled && speak("Select an Option")}
              onMouseLeave={stop}>{t('friend_settings')}</DialogTitle>
        <DialogContent>
    {friendData.listType === 'blocked' ? (
        <List>
            <ListItem button onClick={handleUnblockUser}>
                <ListItemIcon>
                    <BlockIcon />
                </ListItemIcon>
                <ListItemText primary="Unblock User" />
            </ListItem>
        </List>
    ) : selectedOption === 'alias' ? (
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
          {/* <Button onClick={handleDialogAction} color="primary">
            Confirm
          </Button> */}
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default FriendTile;
