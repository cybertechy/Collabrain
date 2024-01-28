// pages/FriendsWindow.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TopBar from './topBar';
import SearchBar from './searchBar';
import FriendTile from './friendTile';

const FriendsWindow = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder friend data
  const friendsList = [
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'Offline' },
    // ...more friends
  ];

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Add any additional logic for tab change if needed
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleMoreOptions = (friend) => {
    // Implement the logic for when more options is clicked
    console.log('More options clicked for:', friend.name);
  };

  const filteredFriends = searchQuery
  ? friendsList.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery)
    )
  : friendsList;
    return (
        <Box sx={{ width: '100%' }}>
          <TopBar activeTab={activeTab} onTabChange={handleTabChange} />
          <SearchBar onSearch={handleSearch} />
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredFriends.map((friend) => (
              <FriendTile key={friend.id} friendData={friend} onMoreOptions={handleMoreOptions} />
            ))}
          </List>
        </Box>
      );
    };

export default FriendsWindow;
