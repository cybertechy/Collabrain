"use client";
import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
const fb = require("_firebase/firebase");
import {useAuthState } from "@/app/_firebase/firebase";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
 
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
 
const Leaderboard = () => {
  // State for team data, search query, and joined teams
  const [teamData, setTeamData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [teamJoined, setTeamJoined] = useState({});
  const [sortBy, setSortBy] = useState('score');
  const [user, loading] = useAuthState();
  const [clickedRow, setClickedRow] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
 
const fetchTeams = async () => {
  try {
    const token = await fb.getToken();
    const response = await axios.get(`${SERVERLOCATION}/api/teams?sort=${sortBy}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeamData(response.data.map((team, index) => ({ ...team, rank: index + 1  })));
  } catch (error) {
    console.error(error);
  }
};
 
useEffect(() => {
  fetchTeams();
}, [user, sortBy]);
 
 
 
 
const handleRowClick = (teamName) => {
  // Toggle the clicked row
  setClickedRow(clickedRow === teamName ? null : teamName);
};
 
 
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
 
    if (query === '') {
      fetchTeams(); // Reset the search
    } else {
      const filteredData = teamData.filter(
        (team) => team.name.toLowerCase().includes(query.toLowerCase())
      );
      setTeamData(filteredData);
    }
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Backspace' && searchQuery === '') {
      fetchTeams(); // Reset the search
    }
  };
 
 
  // Function to handle search button click
  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching for:", searchQuery);
  };
 
 
  // Function to handle join team button click
  const handleJoinTeam = (teamName) => {
    // Add the selected team to the list of joined teams
    setJoinedTeams([...joinedTeams, teamName]);
    // Update teamJoined state to mark this team as joined
    setTeamJoined({ ...teamJoined, [teamName]: true });
  };
 
  // Function to handle disconnect from team button click
  const handleDisconnectFromTeam = (teamName) => {
    // Remove the selected team from the list of joined teams
    setJoinedTeams(joinedTeams.filter(name => name !== teamName));
    // Update teamJoined state to mark this team as not joined
    setTeamJoined({ ...teamJoined, [teamName]: false });
  };
 
  return (
 
    <div className="container mx-auto p-24">
       
      <p className="text-3xl font-md text-start text-primary bg-white mb-4">Discover Teams</p>
      <div className= "border-gray-300 inner-shadow border-2 bg-aliceBlue rounded-md drop-shadow-md overflow-visible">
        {/* Search bar */}
        <div className="p-4 flex justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search team..."
            className="p-2 border border-gray-300 rounded-lg w-full"
           
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
          >
            <SearchIcon />
          </button>
        </div>
 
        {/* Header row for team data */}
        <div className="flex text-start justify-center bg-primary font-bold px-4 py-2">
          <span className="text-lg text-white w-1/4 ">Rank<EmojiEventsIcon className='pl-2 text-3xl'/></span>
          <span className="text-lg text-white w-1/4">Name</span>
          <span className="text-lg text-white w-1/4">Score</span>
          <span className="text-lg text-white w-1/4">Actions</span> {/* New column for actions */}
        </div>
             <div className="flex flex-col overflow-visible ">
          {teamData.map((team, index) => (
            <div
            key={index}
           
            className={`h-20 flex items-center justify-start border-b  border-gray-200 py-2 px-4 cursor-pointer relative transform transition-all duration-300 ${
              clickedRow === team.name ? 'scale-105 shadow-xl bg-secondary' : 'scale-100' ,'border-none' , 'rounded-md'
            }`}
            onClick={() => handleRowClick(team.name)}
            onMouseEnter={() => setHoveredRow(team.name)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              overflow: 'visible',
              backgroundColor: clickedRow === team.name ? '#C9D6DF' : hoveredRow === team.name ? '#C9D6DF' : 'aliceblue',
              transform: clickedRow === team.name ? 'scale(1.05)' : 'scale(1)',
            }}
          >
              <span className="text-lg w-1/4 "># {team.rank}</span>
              <span className="text-lg w-1/4 ">{team.name}</span>
              <span className="text-lg w-1/4 ">{team.score}</span>
              {teamJoined[team.name] ? (
                <React.Fragment>
                  <button
                    onClick={() => handleDisconnectFromTeam(team.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                  >
                    Leave Team
                  </button>
                  <button
                    className=" text-green-500 px-4 py-2 rounded-lg ml-2 cursor-default"
                    disabled
                  >
                    Joined
                  </button>
                </React.Fragment>
              ) : (
                <button
                  onClick={() => handleJoinTeam(team.name)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
                >
                  Join Team
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
 
      {/* Joined teams section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Joined Teams:</h2>
        <ul>
          {joinedTeams.map((teamName, index) => (
            <li key={index}>{teamName}</li>
          ))}
        </ul>
      </div>
    </div>
 
  );
};
 
export default Leaderboard;