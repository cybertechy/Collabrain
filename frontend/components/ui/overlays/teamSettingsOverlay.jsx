import React, { useState } from 'react';
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


const TeamSettingsOverlay = ({ onClose }) => {
  const [sidebarPage, setSidebarPage] = useState('general'); // State for managing sidebar page
  const [serverName, setServerName] = useState('Your Server Name');
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [serverImage, setServerImage] = useState(null);

  const handleNameChange = (e) => {
    setServerName(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleVisibility = (event) => {
    setIsPublic(event.target.checked);
  };

  const handleImageUpload = (base64Image, fileType) => {
    setServerImage(base64Image);
  };

  const handleSidebarPageChange = (page) => {
    setSidebarPage(page);
  };

  const handleKickUser = (userId) => {
    console.log('Kick user with ID:', userId);
    // Implement user kick logic here
  };
  
  const handleBanUser = (userId) => {
    console.log('Ban user with ID:', userId);
    // Implement user ban logic here
  };

  const handleUnbanUser = (userId) => {

  } 
  const users = [
    { id: 1, name: "John Doe", avatar: "/path/to/avatar1.jpg" , role: 'Admin'},
    { id: 2, name: "Bucke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 3, name: "Cucke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 4, name: "Dudcke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 5, name: "Eucdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 6, name: "Fasdcdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 5, name: "Eucdke Doe", avatar: "/path/to/avatar2.jpg" , role: 'Member'},
    { id: 6, name: "Fasdcdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member' },
    { id: 5, name: "Eucdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 6, name: "Fasdcdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 5, name: "Eucdke Doe", avatar: "/path/to/avatar2.jpg", role: 'Member'},
    { id: 6, name: "Fasdcdke Doe", avatar: "/path/to/avatar2.jpg" , role: 'Admin'  },
    { id: 5, name: "Eucdke Doe", avatar: "/path/to/avatar2.jpg" , role: 'Member' },
    { id: 6, name: "Fasdcdke Doe", avatar: "/path/to/avatar2.jpg" , role:'Owner'},
  ];
  const handleRoleChange = (role, index) => {
  }
  return (
    <div className="fixed font-sans inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${sidebarPage === 'roles' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSidebarPageChange('roles')}>
                <AdminPanelSettingsIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
                Roles
              </button>
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
            {sidebarPage === 'roles' && (
          <RolesTeamSettingsOverlay
            onClose={onClose}
            users={users}
            onRoleChange={handleRoleChange}
          />
        )}
        {sidebarPage === 'userManagement' && (
  <UserManagementOverlay
  onClose={onClose}
    users={users}
    onKickUser={handleKickUser}
    onBanUser={handleBanUser}
  />
)}
{sidebarPage === 'bans' && (
  <BansOverlay
    onClose={onClose}
    bannedUsers={users}
    handleUnbanUser={handleUnbanUser}
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
          <UploadButton onUpload={handleImageUpload} photo={{ data: serverImage }} />
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

const RolesTeamSettingsOverlay = ({ onClose, users, onRoleChange }) => {
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
    return a.name.localeCompare(b.name);
  }).filter(user => user.name.toLowerCase().includes(searchQuery));
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
      <CustomAvatar username={user.name.split(' ')[0]} />
    </ListItemAvatar>
    <ListItemText primary={user.name} />
    <ListItemSecondaryAction>
      <Select
        value={user.role}
        onChange={(event) => onRoleChange(event.target.value, index)}
        sx={{ minWidth: 120 }}
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


const UserManagementOverlay = ({ onClose, users, onKickUser, onBanUser }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Update the search query as the user types
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery)
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
                <CustomAvatar username={user.name.split(' ')[0]} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
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

const BansOverlay = ({ onClose, bannedUsers, handleUnbanUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredBannedUsers = bannedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery)
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
                <CustomAvatar username={user.name.split(' ')[0]} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
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
