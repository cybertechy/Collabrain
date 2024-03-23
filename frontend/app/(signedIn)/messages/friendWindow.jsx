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
import addFriendLottie from "@/public/assets/json/addFriendLottie.json";
import allFriendsLottie from "@/public/assets/json/allFriendsLottie.json";
import blockedLottie from "@/public/assets/json/blockedLottie.json";
import recievedRequestsLottie from "@/public/assets/json/recievedRequestsLottie.json";
import Lottie from "lottie-react";
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const FriendsWindow = () => {
  const { t } = useTranslation('dms');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [visibleList, setVisibleList] = useState([]);
  const [RecievedFriends, setRecievedFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [refreshList, setRefreshList] = useState(0);
  const [directMessages, setDirectMessages] = useState([]);
  const [user, loading] = fb.useAuthState();
  const searchDelay = 500;
  const searchTimerRef = useRef(null);

  const searchUsers = async (username) => {
    try {
      const token = await fb.getToken();
      const response = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/search`, {
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
      if (!token) {
        return;
      }
      const response = await axios.get("https://collabrain-backend.cybertech13.eu.org/api/users/f/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const friends = response.data.friends;
  
      // Create an array of promises to fetch detailed information for each friend
      const friendPromises = friends.map(async (friendId) => {
        const friendResponse = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return {
          id: friendId,
          ...friendResponse.data,
        };
      });
  
      // Use Promise.all to wait for all friend data to be fetched
      const detailedFriends = await Promise.all(friendPromises);
  
      setFriendsList(detailedFriends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const token = await fb.getToken();
      const response = await axios.get("https://collabrain-backend.cybertech13.eu.org/api/users/friends/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("friend Request recieved ", response.data);
      const friendRequests = response.data.map(async (friendRequest) => {
        // Fetch user data for each friend request by ID
        const userResponse = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/${friendRequest}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User Response", userResponse.data);
        // Add the 'listType' property with a value of 'pending' to each friend request
        return {
          id:friendRequest,
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
  }, [activeTab, user]);

  
  useEffect(() => {
    let list = [];
    switch (activeTab) {
      case 'all':
        list = friendsList;
        break;
      case 'Recieved':
        list = RecievedFriends;
        break;
      case 'blocked':
        list = blockedUsers;
        break;
      case 'addFriend':
        list = searchResults;
        break;
      default:
        break;
    }
  
    if (searchQuery && activeTab !== 'addFriend') {
      list = list.filter(friend => friend.name?.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const renderEmptyState = () => {
    let animationData;
    let message;
  
    switch (activeTab) {
      case 'all':
        animationData = allFriendsLottie;
        message = t('all');
        break;
      case 'Recieved':
        animationData = recievedRequestsLottie;
        message = t('received');
        break;
      case 'blocked':
        animationData = blockedLottie;
        message = t('blocked');
        break;
      case 'addFriend':
      default:
        animationData = addFriendLottie;
        message = t('search_friends');
        break;
    }
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Lottie animationData={animationData} style={{ width: 400, height: 400 }} />
       <p className='font-sans text-xl font-light'>{message}</p>
      </Box>
    );
  };
  
  // Inside the return statement of the FriendsWindow component, replace the old "No friends found" messages with:
  {visibleList.length > 0 ? (
    visibleList.map((friend, index) => (
      <FriendTile key={index} id={friend.id} friendData={friend} onMoreOptions={handleMoreOptions} />
    ))
  ) : renderEmptyState()}
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
          {renderEmptyState()}
          </Typography>
        )}
      </List>
    </Box>
      );
    };

export default FriendsWindow;
