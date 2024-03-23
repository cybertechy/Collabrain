import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloseIcon from "@mui/icons-material/Close";
import { Switch } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { CameraAlt } from '@mui/icons-material';
import {TextField, Button, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Select, MenuItem, List } from '@mui/material';
import CustomAvatar from '../messagesComponents/avatar'; // Ensure this path is correct
import UploadButton from '../button/uploadButton'; // Ensure this path is correct
import { addMedia } from '@/app/utils/storage';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const fb = require("_firebase/firebase");
import {patchTeamData} from '@/app/utils/teams';

const TeamSettingsOverlay = ({ onClose, teamData, onUpdate, members , bannedMembers, userId}) => {
  const [sidebarPage, setSidebarPage] = useState('general'); // State for managing sidebar page
  const [serverName, setServerName] = useState(teamData?.name ? teamData.name :'Your Server Name');
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(teamData?.visibility ? teamData.visibility === "public"? true : false : true);
  const [serverImage, setServerImage] = useState(teamData?.teamImageID ? teamData.teamImageID : null);
  const [users, setUsers] = useState(members ? members : []); // Assuming `teamData.members` contains the team's members
  console.log("banned members", bannedMembers)
  const handleNameChange = (e) => {
    setServerName(e.target.value);
  };
  // useEffect(() => {
  //   const fetchAllMembers = async () => {
  //     if (teamData && teamData.members && teamData.owner) {
  //       const memberPromises = Object.keys(teamData.members).map(async memberId => {
  //         const userInfo = await fetchUser(memberId); // Assuming fetchUser returns user info for a given ID
  //         return {
  //           ...userInfo,
  //           role: memberId === teamData.owner ? 'owner' : teamData.members[memberId].role
  //         };
  //       });

  //       Promise.all(memberPromises).then(completeMembers => {
  //         setUsers(completeMembers);
  //       });
  //     }
  //   };

  //   fetchAllMembers();
  // }, [teamData.members]);

  const toggleEdit = () => {
    if (isEditing) { // Check if currently editing, then save
      const data = { name: serverName };
      console.log("updating name to ", serverName)
      patchTeamData(teamData.teamId, data).then( ()=>{onUpdate()}); // Assuming `teamData.teamId` contains the team's ID
      toast.success("Team name updated successfully!");
     
    }
    setIsEditing(!isEditing);
  };

  const toggleVisibility = (event) => {
    const newVisibility = event.target.checked ? "public" : "private";
    setIsPublic(event.target.checked);
    const data = { visibility: newVisibility };
    console.log("updating visibility to ", newVisibility)
    patchTeamData(teamData.teamId, data).then( ()=>{onUpdate()});
    toast.success(`Team visibility updated to ${newVisibility}!`);
    
  };

  const handleImageUpload = async (base64Image, fileType) => {
    

    try {
        const type = "team"; // Assuming 'team' is the type for team images
        const response = await addMedia(fileType, base64Image, type); // Upload the image and get the media ID

        if (response && response.mediaId) {
            // Now update the team's image ID on the backend
            const token = await fb.getToken();
            const patchData = {
                teamImageID: response.mediaId // Assuming this is how you want to structure the data
            };

            await axios.patch(`${SERVERLOCATION}/api/teams/${teamData.teamId}`, { data: patchData }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setServerImage(patchData.teamImageID); // Update UI with the uploaded image
            toast.success("Team image updated successfully!");
            onUpdate();
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error("Error updating team image:", error);
        toast.error("Error updating team image. Please try again.");
    }
};

  const handleSidebarPageChange = (page) => {
    setSidebarPage(page);
  };

  const handleKickUser = async (userId) => { // Assume teamId is passed or available in context
    const teamId = teamData.teamId; // Assuming teamData contains your team's ID and is available in your component
    try {
      const token = await fb.getToken(); // Assume this method retrieves the current user's auth token
      const response = await axios.delete(`${SERVERLOCATION}/api/teams/${teamId}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('User kicked successfully:', response.data.message);
        // Optionally, refresh the team data to reflect the removal
        toast.success("User kicked successfully");
        onUpdate(); // If you have a method to refresh team/member data
      } else {
        throw new Error('Failed to kick user');
      }
    } catch (error) {
      console.error('Error kicking user:', error.response?.data?.error || error.message);
      // Optionally, display an error notification to the user
    }
  };
  
  const handleBanUser = async (userId) => {
    const teamId = teamData.teamId; // Assuming teamData contains your team's ID and is available in your component
    console.log("banning user", userId, teamId)
    try {
      const token = await fb.getToken(); // Assuming fb.getToken() gets your Firebase auth token
      const response = await axios.post(`${SERVERLOCATION}/api/teams/${teamId}/ban/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('User banned successfully');
        toast.success("User banned successfully");
        onUpdate(); // Assuming onUpdate() is a method to refresh data
      } else {
        throw new Error('Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error.response || error);
      toast.error("Error banning user. Please try again.");
    }
  };
  
  const handleUnbanUser = async (userId) => {
    const teamId = teamData.teamId; // Similarly, ensure teamData and teamId are available
    try {
      const token = await fb.getToken(); // Get the auth token
      const response = await axios.delete(`${SERVERLOCATION}/api/teams/${teamId}/ban/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('User unbanned successfully');
        toast.success("User unbanned successfully");
        onUpdate(); // Refresh data
      } else {
        throw new Error('Failed to unban user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error.response || error);
      toast.error("Error unbanning user. Please try again.");
    }
  };
 
  const handleRoleChange = async (newRole, userId) => {
    try {
      const token = await fb.getToken(); // Assuming fb.getToken() gets your Firebase auth token
      const teamId = teamData.teamId; // Assuming teamData contains your team's ID
      const url = `${SERVERLOCATION}/api/teams/${teamId}/users/${userId}`;
  
      const response = await axios.patch(url, {
        role: newRole.toLowerCase(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Assuming the API response includes the updated user object or similar confirmation
        console.log('Role updated successfully', response.data);
        // Update local state to reflect the role change
        const updatedUsers = users.map(user => {
          if (user.id === userId) {
            return { ...user, role: newRole };
          }
          return user;
        });
        setUsers(updatedUsers);
  
        toast.success("Role updated successfully!");
        onUpdate(); // Assuming onUpdate() is a method passed down to fetch the latest team data
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error.response || error);
      toast.error("Error updating role. Please try again.");
    }
  };
  return (
    <div className="fixed font-sans inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <ToastContainer/>
      <div className="relative mx-auto w-full max-w-6xl shadow-lg rounded-md bg-white flex" style={{ height: '80%' }}>
        {/* Sidebar */}
        <div className="flex flex-col rounded-l-md bg-primary text-white" style={{ width: '20%', height: '100%' }}>
         <div className="p-2">
            {/* <h3 className="mt-2 font-bold text-2xl mb-4 text-center">Settings</h3> */}
            <div className="flex-grow ">
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap  font-semibold ${sidebarPage === 'general' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSidebarPageChange('general')}>
                <SettingsIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
                General
              </button>
              {userId == teamData?.owner && (<button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${sidebarPage === 'roles' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSidebarPageChange('roles')}>
                <AdminPanelSettingsIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
                Roles
              </button>)}
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${sidebarPage === 'userManagement' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSidebarPageChange('userManagement')}>
  <GroupIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
  User Management
</button>

<button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${sidebarPage === 'bans' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSidebarPageChange('bans')}>
  <RemoveCircleIcon sx={{ color: '#81c3d7', mr: 1, fontSize: '2.3rem'  }} />
                Bans
              </button>
              
            </div>
          </div>
        </div>
        {/* Main Content */}
        {sidebarPage === 'general' && (
            <GeneralTeamSettingsOverlay
              onClose={onClose}
              serverName={serverName}
              isEditing={isEditing}
              toggleEdit={toggleEdit}
              isPublic={isPublic}
              toggleVisibility={toggleVisibility}
              serverImage={serverImage}
              handleNameChange={handleNameChange}
              handleImageUpload={handleImageUpload}
            />
          )}
            {sidebarPage === 'roles' && userId == teamData?.owner && (
          <RolesTeamSettingsOverlay
            onClose={onClose}
            users={users}
            onRoleChange={handleRoleChange}
            teamData = {teamData}
          />
        )}
        {sidebarPage === 'userManagement' && (
  <UserManagementOverlay
  onClose={onClose}
    users={users}
    onKickUser={handleKickUser}
    onBanUser={handleBanUser}
    teamData = {teamData}
    userId = {userId}
  />
)}
{sidebarPage === 'bans' && (
  <BansOverlay
    onClose={onClose}
    bannedUsers={bannedMembers}
    handleUnbanUser={handleUnbanUser}
    userId = {userId}
  />
)}

        
      </div>
    </div>
  );
};

const GeneralTeamSettingsOverlay = ({ onClose, serverName, isEditing, toggleEdit, isPublic, toggleVisibility, serverImage, handleNameChange, handleImageUpload }) => {
  return (
    <div className='flex-grow p-4 overflow-auto'>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mt-3">General</h2>
        <button
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon className="text-basicallydark" fontSize="large" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <UploadButton onUpload={handleImageUpload} id={serverImage } type = {"team"}/>
        </div>
        <div className="flex justify-center mb-4">
          <label className="block uppercase text-gray-700 text-lg font-bold mr-4">Server Name</label>
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={serverName}
            onChange={handleNameChange}
            disabled={!isEditing}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={toggleEdit}
            className="ml-4 bg-primary hover:bg-gray-700  text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="flex justify-center items-center">
          <label className="block uppercase text-gray-700 text-lg font-bold mr-4">Server Visibility</label>
        </div>
        <div className="flex justify-center items-center">
          <Switch 
            checked={isPublic} 
            onChange={toggleVisibility}
            sx={{
              transform: 'scale(1.5)',
              '& .MuiSwitch-track': {
                backgroundColor: '#81c3d7', // Secondary color for the track
              },
              '& .MuiSwitch-thumb': {
                color: '#30475E', // Primary color for the thumb
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#81c3d7', // Use secondary color for the track when checked
              },
              '&.Mui-checked .MuiSwitch-thumb': {
                color: '#30475E', // Ensure the thumb stays the primary color even when checked
              },
            }}
          />
          <span className="ml-2">{isPublic ? 'Public' : 'Private'}</span>
        </div>
      </div>
    </div>
  );
};

const RolesTeamSettingsOverlay = ({ onClose, users, onRoleChange, teamData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const getRoleWeight = (role) => {
    switch (role) {
      case 'Owner': return 1;
      case 'Admin': return 2;
      case 'Member': return 3;
      default: return 4;
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const sortedUsers = [...users].sort((a, b) => {
    const roleWeightA = getRoleWeight(a.role);
    const roleWeightB = getRoleWeight(b.role);
    if (roleWeightA !== roleWeightB) {
      return roleWeightA - roleWeightB;
    }
    // If roles are the same, compare by name
    return (a.fname+a.lname).localeCompare(b.fname+b.lname);
  }).filter(user => (user.fname+user.lname).toLowerCase().includes(searchQuery) && (teamData?.banned||[]).includes(user.id) === false);
  return (
    <div className='flex-grow p-4 overflow-auto flex flex-col'>
      <style>
        {`
          .list-item-marker {
            list-style: none; /* Remove default marker */
          }
        `}
      </style>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mt-3">Roles</h2>
        <button
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon className="text-basicallydark" fontSize="large" />
        </button>
      </div>
      {/* Fixed title above the scrollable user list */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex-grow overflow-y-auto"> {/* Adjust max height as needed */}
      <List sx={{ listStyle: 'none', padding: 0 }}> {/* Apply styles to List */}
      {sortedUsers.map((user, index) => (
            <ListItem key={index}   sx={{ 
              marginBottom: '8px', // Adjust the spacing as needed
            }}> {/* disableGutters removes padding */}
               <ListItemAvatar>
      <CustomAvatar username={user.username} />
    </ListItemAvatar>
    <ListItemText primary={user.username} />
    <ListItemSecondaryAction>
      <Select
        value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        onChange={(event) => onRoleChange(event.target.value, user.id)}
        sx={{ minWidth: 120 }}
        disabled={user.role === 'owner'} 
      >
        <MenuItem value="Member">Member</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Owner" disabled>Owner</MenuItem>
      </Select>
    </ListItemSecondaryAction>
  </ListItem>
))}</List>

      </div>
    </div>
  );
};


const UserManagementOverlay = ({ onClose, users, onKickUser, onBanUser , teamData, userId}) => {
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Update the search query as the user types
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(user => 
    (user.fname+user.lname).toLowerCase().includes(searchQuery) && user.role !== 'owner' && (teamData?.banned || []).includes(user.id) === false && user.id !== userId
  );
  return (
    <div className='flex-grow p-4 overflow-auto flex flex-col'>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mt-3">User Management</h2>
        <button
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon className="text-basicallydark" fontSize="large" />
        </button>
      </div>
      {/* Scrollable List */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <List sx={{ listStyle: 'none', padding: 0 }}>
          {filteredUsers.map((user, index) => (
            <ListItem key={index} sx={{ marginBottom: '8px' }}>
              <ListItemAvatar>
                <CustomAvatar username={user.username} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
              <ListItemSecondaryAction>
              <button
                  className="px-4 py-2 border-2 border-red-500 text-red-500 mr-2 hover:bg-red-500 hover:text-white transition-colors duration-200 ease-in-out"
                  onClick={() => onKickUser(user.id)}
                >
                  Kick
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white hover:bg-gray-800 transition-colors duration-200 ease-in-out"
                  onClick={() => onBanUser(user.id)}
                >
                  Ban
                </button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

const BansOverlay = ({ onClose, bannedUsers, handleUnbanUser, userId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredBannedUsers = bannedUsers.filter(user =>
    (user.fname + user.lname).toLowerCase().includes(searchQuery)&& user.id !== userId
  );

  return (
    <div className='flex-grow p-4 overflow-auto flex flex-col'>
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mt-3">Bans</h2>
      <button
        className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
        onClick={onClose}
      >
        <CloseIcon className="text-basicallydark" fontSize="large" />
      </button>
    </div>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={handleSearchChange}
        />
      </div>
      {/* Banned users list */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 160px)' }}>
        {/* Adjust 160px based on your actual header and search bar height */}
        <List sx={{ listStyle: 'none', padding: 0 }}>
          {filteredBannedUsers.map((user, index) => (
            <ListItem key={user.id} sx={{ marginBottom: '8px' }}>
              <ListItemAvatar>
                <CustomAvatar username={user.username} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
              <ListItemSecondaryAction>
                <button
                  className="px-4 py-2 bg-primary text-white hover:bg-gray-800 transition-colors duration-200 ease-in-out"
                  onClick={() => handleUnbanUser(user.id)}
                >
                  Unban
                </button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};
export default TeamSettingsOverlay;
