
"use client";

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
import {Dialog ,DialogTitle,DialogContent,DialogActions,Button,ListItemIcon,List, TextField} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { updateFriendAlias, blockUser, unblockUser } from '@/app/utils/user';
const fb  = require("_firebase/firebase");
import CustomAvatar from '@/components/ui/messagesComponents/avatar';
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const FriendTile = ({ friendData, openChat, setRefreshList,id, userInfo,handleAliasUpdate,handleFriendListUpdate, handleChatUpdate}) => {
  const { t } = useTranslation('dms');
  const { speak, stop, isTTSEnabled } = useTTS();
  // Function to generate avatar with initials
  const [user, loading] = fb.useAuthState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alias, setAlias] = useState('');
  useEffect(() => {
    // This checks if user and friendData.alias are defined to safely access user.uid
    console.log("Userinfo, ",userInfo);
    if (user && userInfo?.alias && userInfo?.alias[friendData.id]) {
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
    setAlias(userInfo?.aliases?.[friendData.id] || '');
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log("Our user", user);
    console.log('Option selected:', friendData);
    if(option === 'alias'){
    openDialog();}
  else if(option === 'block'){
  handleBlockUser().then(()=>{handleAliasUpdate(); handleFriendListUpdate();handleChatUpdate();});
  ;}
  };
  const handleDialogAction = async () => {
    if (selectedOption === 'alias' && alias.trim()) {
      const isSuccess = await updateFriendAlias(friendData.id, alias.trim(), user?.uid);
      if (isSuccess) {
        console.log(`Alias "${alias}" set for user:`, friendData);
        
        handleAliasUpdate(friendData.id, alias.trim()); // Call the update function passed as prop
        handleChatUpdate();
        handleFriendListUpdate();
      }
    } else if (selectedOption === 'block') {
      await blockUser(friendData.id);
      console.log('Blocking user:', friendData);
    }
    closeDialog();
  };


 
  // function stringAvatar(name = "User") {
  //   // Split the name into words, capitalize the first letter of each, and join the initials
  //   const initials = name.split(' ')
  //     .map(word => word[0] ? word[0].toUpperCase() : '') // Capitalize the first letter of each word
  //     .join('');
  
  //   return {
  //     sx: {
  //       bgcolor: stringToColor(name),
  //     },
  //     children: initials, // Use the capitalized initials
  //   };
  // }
  
  // function stringToColor(string = "User") {
  //   let hash = 0;
  //   let i;
  
  //   // Convert string to hash
  //   for (i = 0; i < string.length; i += 1) {
  //     hash = string.charCodeAt(i) + ((hash << 5) - hash);
  //   }
  
  //   // Convert hash to color
  //   let color = '#';
  //   for (i = 0; i < 3; i += 1) {
  //     const value = (hash >> (i * 8)) & 0xff;
  //     color += `00${value.toString(16)}`.slice(-2);
  //   }
  
  //   // Check if color is too light
  //   if (isColorLight(color)) {
  //     // If color is light, return a dark color or adjust the color as needed
  //     return { backgroundColor: color, color: '#000' }; // light color background, dark text
  //   } else {
  //     // If color is dark, return it with a light text color
  //     return { backgroundColor: color, color: '#fff' }; // dark color background, light text
  //   }
  // }
  
  // function isColorLight(color) {
  //   const hex = color.replace('#', '');
  //   const c_r = parseInt(hex.substr(0, 2), 16);
  //   const c_g = parseInt(hex.substr(2, 2), 16);
  //   const c_b = parseInt(hex.substr(4, 2), 16);
  //   const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
  //   return brightness > 155; // Brightness threshold, adjust if needed
  // }



  
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
  
        console.log(response.data.message); // Log the response message (e.g., "Chat created")
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
        handleFriendListUpdate();
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
        handleFriendListUpdate();
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
    } else if (!fb) {
      return <p> Firebase not defined </p>
    }
     else if (friendData.listType === 'blocked') {
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
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%' }}
          onMouseEnter={() => isTTSEnabled && speak("User notification settings button")} onMouseLeave={stop}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '50%', marginX: 1 }}
            onClick={() => handleChatClick(friendData)} onMouseEnter={() => isTTSEnabled && speak("Open chat with user button")}
            onMouseLeave={stop}>
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

  const handleUnblockUser = async () => {
    // Logic to unblock the user
    console.log('Unblocking user:', friendData);
    // Assume you have an unblockUser function similar to blockUser
    await unblockUser(friendData.id).then(()=>{handleFriendListUpdate(); handleAliasUpdate(); handleChatUpdate();});;
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
        <ListItemAvatar
        onMouseEnter={() => isTTSEnabled && speak(friendData.username)} onMouseLeave={stop}>
          <CustomAvatar username={friendData.username} />
        </ListItemAvatar>
        <ListItemText
         primary={
          userInfo?.data&& userInfo.data.alias && userInfo.data.alias[friendData.id]
            ? `${userInfo.data.alias[friendData.id]}`
            : friendData.username
        }
          primaryTypographyProps={{ color: '#000000' }}
          secondary={friendData.email}
          onMouseEnter={() => isTTSEnabled && speak(`${friendData.username}, ${friendData.email}`)}
          onMouseLeave={stop}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {renderActionIcons()}
        <IconButton
          edge="end"
          aria-label="more-options"
          onClick={openDialog}
          onMouseEnter={() => isTTSEnabled && speak("More settings button")}
          onMouseLeave={stop}
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
        <DialogTitle>{t('friend_settings')}</DialogTitle>
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
    ) :  ( <List>
            <ListItem button onClick={() => handleOptionClick('alias')}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={t('alias')} />
            </ListItem>
            <ListItem button onClick={() => handleOptionClick('block')}>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary={t('block')} />
            </ListItem>
          </List>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogAction} color="primary">
            {t('confirm')}
          </Button>
          <Button onClick={closeDialog} color="primary">
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default FriendTile;