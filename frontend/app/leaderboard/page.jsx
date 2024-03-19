"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from "_firebase/firebase"; // Assuming this function retrieves the authentication token

const Leaderboard = () => {
  const [teamData, setTeamData] = useState([]);

  // Fetch team data from backend API
  useEffect(() => {
    const fetchData = async () => {
        try {
          const token = await getToken(); // Retrieve authentication token
          const response = await axios.get('http://localhost:8080/api/teams', {
            headers: { Authorization: `Bearer ${token}` } // Include token in headers
          });
          
          // Check if response contains data
          if (response && response.data) {
            // If data is present, set teamData state with the received data
            setTeamData(response.data);
            console.log(data)
          } else {
            console.error('Error: Response data is not available');
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      
    };

    fetchData();
  }, []);

  // Function to handle joining a team
  const joinTeam = async (teamId) => {
    try {
      const token = await getToken(); // Retrieve authentication token
      const response = await axios.post(`http://localhost:8080/api/teams`, null, {
        headers: { Authorization: `Bearer ${token}` } // Include token in headers
      });
      
      // Update teamData state to reflect the change
      setTeamData(prevData => {
        return prevData.map(team => {
          if (team.teamID === teamId) {
            team.joined = true;
          }
          return team;
        });
      });
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-center bg-white py-4 mb-4">Team Leaderboard</h1>
      <div className="container mx-auto">
        <div className="bg-gray-200 shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col">
            {/* Render team data */}
            {teamData.map((team, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                <span className="text-lg">{team.rank}</span>
                <span className="text-lg">{team.name}</span>
                <span className="text-lg">{team.score}</span>
                {/* Conditionally render Join Team button based on whether user has joined */}
                {team.joined ? (
                  <button className="text-lg bg-green-500 text-white px-4 py-2 rounded" disabled>Joined</button>
                ) : (
                  <button onClick={() => joinTeam(team.teamID)} className="text-lg bg-blue-500 text-white px-4 py-2 rounded">Join Team</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;








