"use client"
import React, { useEffect, useState } from 'react';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { IconButton } from '@mui/material';
import ButtonIcon from '../button/buttonWithIcon';

const LeaderboardNavbar = ({ user = {
    rank: 0,
    displayName: 'User',
    xp: 0,
    positionShift: 0,
}}) => {
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        setShowAnimation(true);
    }, []);

    const leaderboardData = {
        remainingDays: 2,
    };

    const userLeaderboardData = [
        { rank: 1, displayName: 'User 1', xp: 2000 },
        { rank: 2, displayName: 'User 2', xp: 2000 },
        { rank: 3, displayName: 'User 3', xp: 2000 },
    ];

    return (
        <div
            className={`fixed right-5 w-[400px] h-min bg-primary text-white p-4 rounded-b-lg shadow-lg overflow-y-hidden z-50 ${
                showAnimation ? 'transition-all duration-300 ease-in-out transform scale-y-100' : 'transition-all duration-300 ease-in-out transform scale-y-0'
            }`}
            style={{ transformOrigin: 'top' }} // BEGIN: Add transform origin to top
        >
            <div className="text-xl text-center mb-4 font-poppins">League Leaderboard</div>

            <div className="flex flex-row border-white border-2 justify-around items-center rounded-xl mb-4 mx-5 relative">
                <div className="flex flex-col justify-between items-center p-3 w-full">
                    <div className="text-xs uppercase font-bold font-poppins">Today</div>
                    <div className="text-sm text-center">
                        <SwapVertIcon className="mr-1" fontSize="small" />
                        {user.positionShift || '?'} places
                    </div>
                </div>

                {/* White Divider Line */}
                <div className="absolute  m-auto border-l-2 border-white h-3/4"></div>

                <div className="flex flex-col justify-between items-center  p-3 w-full">
                    <div className="text-xs uppercase font-bold font-poppins">Time left</div>
                    <div className="text-sm text-center">
                        <QueryBuilderIcon className="mr-1" fontSize="small" />
                        {leaderboardData.remainingDays || '?'} days
                    </div>
                </div>
            </div>

            <div className="border-t border-secondary pt-2">
                {/* Leaderboard Entries */}
                {userLeaderboardData.map((entry) => (
                    <div className="flex justify-between items-center py-2" key={entry.rank}>
                        <div className="flex items-center justify-center">
                            <span className="text-primary text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                {entry.rank}
                            </span>
                            <span className="ml-2">{entry.displayName}</span>
                        </div>
                        <div className="text-lg">{entry.xp} XP</div>
                    </div>
                ))}

                {/* Current User's Position */}
                <div className="flex justify-between  items-center p-3 bg-white text-primary mt-4 rounded">
                    <div className="flex items-center">
                        {/* Use the user object to display the user's name */}
                        <span className="font-bold">#{user.rank}</span>
                        <span className="ml-2 ">{user.displayName || 'User'}</span>
                    </div>
                    <div>{user.xp || '0'} XP</div>
                </div>
                {/* <div className = "w-full mt-4 font-bold uppercase font-poppins text-xs text-white text-center justify-center items-center ">VIEW MORE</div> */}
            </div>
        </div>
    );
};



export default LeaderboardNavbar;