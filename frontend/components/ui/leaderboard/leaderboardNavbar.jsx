import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { IconButton, Button } from '@mui/material';

const fb = require('_firebase/firebase');

const LeaderboardNavbar = ({ user }) => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState({
        remainingDays: 2,
        teams: []
    });
    const [showMore, setShowMore] = useState(false); // New state to control view more functionality

    useEffect(() => {
        setShowAnimation(true);
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        const token = await fb.getToken(); // Make sure this function properly retrieves the auth token

        try {
            const res = await axios.get(`http://localhost:8080/api/teams/search?page=0`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const teams = res.data.map((team, index) => ({
                rank: index + 1, // Rank is based on the sort order from the server
                displayName: team.name,
                xp: team.score
            }));

            setLeaderboardData(prevState => ({
                ...prevState,
                teams: teams.slice(0, 10) // Only keep the top 10 for viewing more
            }));
        } catch (err) {
            console.error("Failed to fetch leaderboard data:", err);
        }
    };

    const handleViewMore = () => {
        setShowMore(!showMore); // Toggle the state to show/hide more teams
    };

    return (
        <div className={`fixed right-5 w-[400px] h-min bg-primary text-basicallylight p-4 rounded-b-lg shadow-lg overflow-y-hidden z-50 ${
                showAnimation ? 'transition-all duration-300 ease-in-out transform scale-y-100' : 'transition-all duration-300 ease-in-out transform scale-y-0'
            }`}
            style={{ transformOrigin: 'top' }}
        >
            <div className="text-xl text-center mb-4 font-poppins">League Leaderboard</div>

            {/* Rest of the component remains unchanged */}

            <div className="border-t border-secondary pt-2">
                {/* Conditionally render teams based on showMore */}
                {leaderboardData.teams.slice(0, showMore ? 10 : 3).map((entry) => (
                    <div className="flex justify-between items-center py-2" key={entry.rank}>
                        <div className="flex items-center justify-center">
                            <span className="text-primary text-xl bg-basicallylight rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                {entry.rank}
                            </span>
                            <span className="ml-2">{entry.displayName}</span>
                        </div>
                        <div className="text-lg">{entry.xp} XP</div>
                    </div>
                ))}
                {leaderboardData.teams.length > 3 && ( // Only show if there are more than 3 teams
                    <div className="text-center mt-4">
                        <Button sx={{color:'white'}} variant="text" onClick={handleViewMore}>
                            {showMore ? 'View Less' : 'View More'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardNavbar;
