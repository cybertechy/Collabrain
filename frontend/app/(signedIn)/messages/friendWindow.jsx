// pages/FriendsWindow.js
import  { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TopBar from './topBar';
import SearchBar from './searchBar';
import FriendTile from '@/components/ui/messagesComponents/friendTile';
import Typography from '@mui/material/Typography'; 
import axios from 'axios';
const fb = require("_firebase/firebase");
import addFriendLottie from "@/public/assets/json/addFriendLottie.json";
import allFriendsLottie from "@/public/assets/json/allFriendsLottie.json";
import blockedLottie from "@/public/assets/json/blockedLottie.json";
import recievedRequestsLottie from "@/public/assets/json/recievedRequestsLottie.json";
import Lottie from "lottie-react";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const FriendsWindow = ({userInfo, handleAliasUpdate, handleChatUpdate}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [visibleList, setVisibleList] = useState([]);
  const [RecievedFriends, setRecievedFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [refreshList, setRefreshList] = useState(0);
  const [directMessages, setDirectMessages] = useState([]);
  const [searching, setSearching] = useState(false);
  const [user, loading] = fb.useAuthState();
  const searchDelay = 500;
  const searchTimerRef = useRef(null);
  

  const searchUsers = async (username) => {
    try {
      const token = await fb.getToken();
      const response = await axios.get(`${SERVERLOCATION}/api/users/search`, {
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
  
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'addFriend' && searchQuery.trim() !== '') {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
  
      searchTimerRef.current = setTimeout(() => {
        // Check if a previous abortController is stored in the ref
        if (abortControllerRef.current) {
          abortControllerRef.current.abort(); // Abort the previous request
        }
  
        // Create a new instance of AbortController for the new request
        const abortController = new AbortController();
        const { signal } = abortController;
  
        // Store the abortController in its own ref for potential future aborts
        abortControllerRef.current = abortController;
  
        const fetchSearchResults = async () => {
          try {
            setSearching(true);
            const token = await fb.getToken();
            const response = await axios.get(`${SERVERLOCATION}/api/users/search`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              params: {
                username: searchQuery,
              },
              signal, // Pass the signal to axios to allow request cancellation
            });
  
            const usersWithListType = response.data.map((user) => ({
              ...user,
              listType: 'addFriend',
            }));
  
            // Only update the search results if the request was not aborted
            if (!signal.aborted) {
              setSearchResults(usersWithListType);
              console.log("Search results:", usersWithListType);
            }
            setSearching(false);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.log("Search request cancelled:", error);
              setSearching(false);
            } else {
              console.error("Error fetching search results:", error);
              setSearchResults([]);
              setSearching(false);
            }
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
      const response = await axios.get(`${SERVERLOCATION}/api/users/f/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const friends = response.data.friends;
  
      // Create an array of promises to fetch detailed information for each friend
      const friendPromises = friends.map(async (friendId) => {
        const friendResponse = await axios.get(`${SERVERLOCATION}/api/users/${friendId}`, {
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
      const response = await axios.get(`${SERVERLOCATION}/api/users/friends/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("friend Request recieved ", response.data);
      const friendRequests = response.data.map(async (friendRequest) => {
        // Fetch user data for each friend request by ID
        const userResponse = await axios.get(`${SERVERLOCATION}/api/users/${friendRequest}`, {
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
          <FriendTile key={user.id} friendData={user} onMoreOptions={handleMoreOptions}  handleChatUpdate={handleChatUpdate}/>
        ));
      }else if (searchQuery && searchResults.length === 0) {
        // Render a message indicating no results found for the search
        return (
          <p>
            No results found for "{searchQuery}". Try a different search.
          </p>
        );
      } else {
        // Render a message to encourage searching
        return <p>Start typing to search for friends to add.</p>;
      }
    } else {
      // Render filtered friends for other tabs
      const filteredFriends = searchQuery
  ? Array.isArray(visibleList)
    ? visibleList.filter((friend) => friend.name && friend.name.toLowerCase().includes(searchQuery))
    : []
  : visibleList;

      
  return filteredFriends.map((friend, index) => (
    <FriendTile key={index} id = {friend.id} friendData={friend} onMoreOptions={handleMoreOptions} userInfo = {userInfo} handleAliasUpdate = {handleAliasUpdate}  handleChatUpdate={handleChatUpdate}/>
  ));
    }
  };

  const renderEmptyState = () => {
    let animationData;
    let message;
    let searchingMessage = "Searching for friends...";
  
    switch (activeTab) {
      case 'all':
        animationData = allFriendsLottie;
        message = "This is where your friends can be found.";
        break;
      case 'Recieved':
        animationData = recievedRequestsLottie;
        message = "You will find your received friend requests here.";
        break;
      case 'blocked':
        animationData = blockedLottie;
        message = "You will find your blocked users here.";
        break;
      case 'addFriend':
      default:
        animationData = addFriendLottie;
        if (searching) {
          message = searchingMessage;
        } else {
          message = searchQuery && searchResults.length === 0 ? `No results found for "${searchQuery}". Try a different search.` : "Start typing to search for friends to add.";
        }
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
  // {visibleList.length > 0 ? (
  //   visibleList.map((friend, index) => (
  //     <FriendTile key={index} id={friend.id} friendData={friend} onMoreOptions={handleMoreOptions} />
  //   ))
  // ) : renderEmptyState()}
    return (
      <Box sx={{ width: '100%' }}>
      <TopBar activeTab={activeTab} onTabChange={handleTabChange} />
      <SearchBar onSearch={handleSearch} />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {visibleList.length > 0 ? (
          visibleList.map((friend, index) => (
            <FriendTile key = {index} id={friend.id} friendData={friend} onMoreOptions={handleMoreOptions} handleAliasUpdate = {handleAliasUpdate}  userInfo = {userInfo} handleChatUpdate={handleChatUpdate} />
          ))
        ) : (
          // <Typography variant="body1" sx={{ p: 2 }}>
          <div>
          {renderEmptyState()}
          </div>
          // </Typography>
        )}
      </List>
    </Box>
      );
    };

export default FriendsWindow;