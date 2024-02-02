// pages/FriendsWindow.js
import  { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TopBar from './topBar';
import SearchBar from './searchBar';
import FriendTile from './friendTile';

const FriendsWindow = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const friendsList = [
    { id: 1, name: 'John Doe', status: 'Online' , listType: "all"},
    { id: 2, name: 'Jane Smith', status: 'Offline', listType: "all"},
    // ...more friends
  ];
const [visibleList, setVisibleList] = useState(friendsList);
   
  // Placeholder friend data
  
 const pendingFriends = [
  { id: 1, name: 'Billy Irving', status: 'Online' , listType: "pending"},
  { id: 2, name: 'Sam Sulek', status: 'Offline', listType: "pending" },

 ];

 const blockedUsers = [
  { id: 1, name: 'Joel', status: 'Online' ,listType: "blocked"},

 ]
  // Handlers
  const handleTabChange = (tab) => {
  
    setActiveTab(tab);

  };
  useEffect(() => {
    if(activeTab === 'all'){
      setVisibleList(friendsList);
    } else if(activeTab === 'pending'){
      setVisibleList(pendingFriends);
    } else if(activeTab === 'blocked'){
      setVisibleList(blockedUsers);
    }
  }, [activeTab]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleMoreOptions = (friend) => {
    // Implement the logic for when more options is clicked
    console.log('More options clicked for:', friend.name);
  };

  const filteredFriends = searchQuery
  ? visibleList?.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery)
    )
  : visibleList;
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
