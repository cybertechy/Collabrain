// pages/FriendsWindow.js
import  { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TopBar from './topBar';
import SearchBar from './searchBar';
import FriendTile from './friendTile';
import Typography from '@mui/material/Typography'; 
import axios from 'axios';
const fb = require("_firebase/firebase");

const FriendsWindow = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [visibleList, setVisibleList] = useState([]);
  const [RecievedFriends, setRecievedFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const searchDelay = 500;
  const searchTimerRef = useRef(null);

  const searchUsers = async (username) => {
    try {
      const token = await fb.getToken();
      const response = await axios.get(`http://localhost:8080/api/users/search`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          username: username,
        },
      });

      const usersWithListType = response.data.map((user) => ({
        ...user,
        listType: 'addFriend',
      }));

      return usersWithListType;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    if (activeTab === 'addFriend' && searchQuery.trim() !== '') {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        const fetchSearchResults = async () => {
          try {
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
            console.log("Search results:", results);
          } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
          }
        };

        fetchSearchResults();
      }, searchDelay);
    }
  }, [searchQuery, activeTab]);

  const getFriends = async () => {
    try {
      const token = await fb.getToken();
      const response = await axios.get("http://localhost:8080/api/users/f/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { friends } = response.data;
      setFriendsList(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const token = await fb.getToken();
      const response = await axios.get("http://localhost:8080/api/users/friends/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const friendRequests = response.data.map(async (friendRequest) => {
        // Fetch user data for each friend request by ID
        const userResponse = await axios.get(`http://localhost:8080/api/users/${friendRequest.user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Add the 'listType' property with a value of 'pending' to each friend request
        return {
          ...friendRequest,
          listType: 'pending',
          username: userResponse.data.username,
          name: userResponse.data.fname + " " + userResponse.data.lname,
          senderData: userResponse.data, 
        };
      });
  
      // Use Promise.all to wait for all user data to be fetched
      const receivedFriendRequests = await Promise.all(friendRequests);
      
      console.log("Recieved Friends", receivedFriendRequests);
      setRecievedFriends(receivedFriendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      getFriends();
    } else if (activeTab === 'Recieved') {
      getFriendRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    let list = [];
    switch (activeTab) {
      case 'all':
        list = Array.isArray(friendsList) ? friendsList : [];
        break;
      case 'Recieved':
        list = Array.isArray(RecievedFriends) ? RecievedFriends : [];
        break;
      case 'blocked':
        list = Array.isArray(blockedUsers) ? blockedUsers : [];
        break;
      case 'addFriend':
        // Only use searchResults if they are an array and not empty, otherwise default to an empty array
        list = Array.isArray(searchResults) && searchResults.length > 0 ? searchResults : [];
        break;
      default:
        list = [];
    }
  
    if (searchQuery && activeTab !== 'addFriend') {
      // Ensure list is an array before attempting to filter, to prevent "filter is not a function" errors
      list = list.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  
    setVisibleList(list);
  }, [activeTab, friendsList, RecievedFriends, blockedUsers, searchResults, searchQuery]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleMoreOptions = (friend) => {
    console.log('More options clicked for:', friend.username);
  };

  const renderSearchResultsOrMessage = () => {
    if (activeTab === 'addFriend') {
      if (searchQuery && searchResults.length > 0) {
        // Render search results
        return searchResults.map((user) => (
          <FriendTile key={user.id} friendData={user} onMoreOptions={handleMoreOptions} />
        ));
      } else {
        // Render a message to encourage searching
        return <Typography variant="body1" sx={{ p: 2 }}>Start typing to search for friends to add.</Typography>;
      }
    } else {
      // Render filtered friends for other tabs
      const filteredFriends = searchQuery
  ? Array.isArray(visibleList)
    ? visibleList.filter((friend) => friend.name && friend.name.toLowerCase().includes(searchQuery))
    : []
  : visibleList;

      
  return filteredFriends.map((friend, index) => (
    <FriendTile key={index} id = {friend.id} friendData={friend} onMoreOptions={handleMoreOptions} />
  ));
    }
  };

  
    return (
      <Box sx={{ width: '100%' }}>
      <TopBar activeTab={activeTab} onTabChange={handleTabChange} />
      <SearchBar onSearch={handleSearch} />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {visibleList.length > 0 ? (
          visibleList.map((friend, index) => (
            <FriendTile key = {index} id={friend.id} friendData={friend} onMoreOptions={handleMoreOptions} />
          ))
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            {activeTab === 'addFriend' ? 'Start typing to search for friends to add.' : 'No friends found.'}
          </Typography>
        )}
      </List>
    </Box>
      );
    };

export default FriendsWindow;
