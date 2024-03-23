import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Switch } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import CustomAvatar from '../messagesComponents/avatar'; 
const TeamOverviewOverlay = ({ onClose }) => {
  const [subPage, setSubPage] = useState('description'); // State for managing subpage

  const handleSubPageChange = (page) => {
    setSubPage(page);
  };

  return (
    <div className="fixed font-sans inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="relative mx-auto w-full max-w-6xl shadow-lg rounded-md bg-white flex" style={{ height: '80%' }}>
        {/* Sidebar */}
        <div className="flex flex-col rounded-l-md bg-primary text-white" style={{ width: '20%', height: '100%' }}>
          <div className="p-2">
            
            <div className="flex-grow">
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap  font-semibold ${subPage === 'description' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSubPageChange('description')}>
                <DescriptionIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
                Description
              </button>
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${subPage === 'leaderboard' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSubPageChange('leaderboard')}>
                <LeaderboardIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} />
                Leaderboard
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className='flex-grow p-4 overflow-auto'>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mt-3">{subPage === 'description' ? 'Description' : 'Leaderboard'}</h2>
            <button
              className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
              onClick={onClose}
            >
              <CloseIcon className="text-basicallydark" fontSize="large" />
            </button>
          </div>
          {/* Render different content based on selected subpage */}
          {subPage === 'description' && (
       <DescriptionContent 
       teamData={{ name: "Awesome Team", description: "This is the best team ever!", members: [
         { name: "John Doe", role: "Admin" },
         { name: "Jane Doe", role: "Member" },
         { name: "John Doe", role: "Admin" },
         { name: "Jane Doe", role: "Member" },
         { name: "John Doe", role: "Admin" },
         { name: "Jane Doe", role: "Member" },
         { name: "John Doe", role: "Admin" },
         { name: "Jane Doe", role: "Member" },
       ]}}
     />
          )}
          {subPage === 'leaderboard' && (
            <LeaderboardContent   teamData={{ name: "Awesome Team", description: "This is the best team ever!", members: [
                { name: "Johdd Doe", role: "Admin" , score: 100},
                { name: "Jane Doe", role: "Member" , score: 90},
                { name: "John Doe", role: "Admin" , score: 80},
                { name: "Jane Doe", role: "Member", score: 70 },
                { name: "John Doe", role: "Admin", score: 70 },
                { name: "Jane Doe", role: "Member", score: 70 },
                { name: "John Doe", role: "Admin", score: 70 },
               
                { name: "Jane Doe", role: "Member", score: 70 },
                { name: "Jane Doe", role: "Member", score: 70 },
                { name: "Jane Doe", role: "Member", score: 70 },
              ]}} />
          )}
        </div>
      </div>
    </div>
  );
};

const DescriptionContent = ({ teamData }) => {
    return (
        <div>
            {/* Centered team name with larger text */}
            <h3 className="text-4xl font-semibold mb-2 text-center">{teamData.name}</h3>
            <div className="text-center mb-4">
                <p>{teamData.description}</p>
                {/* Divider under the team description */}
                <hr className="my-4 border-t border-gray-300 mx-auto w-3/4" />
            </div>

            <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Team Members</h4>
                {/* Fixed height for the scrollable list of team members */}
                <div className="max-h-96 overflow-auto mx-auto" style={{ width: '90%' }}>
                    <List>
                        {teamData.members.map((member, index) => (
                            <ListItem key={index} divider className="justify-center">
                                <ListItemAvatar>
                                    <CustomAvatar username={member.name.split(' ')[0]} /> {/* Assuming avatar based on name */}
                                </ListItemAvatar>
                                <ListItemText primary={member.name} secondary={member.role} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        </div>
    );
};


const LeaderboardContent = ({ teamData }) => {
    // Sort members by score in descending order if not already sorted
    const sortedMembers = [...teamData.members].sort((a, b) => b.score - a.score);

    const podiumMembers = sortedMembers.slice(0, 3); // Top 3 members for the podium
    const otherMembers = sortedMembers.slice(3); // The rest of the members

    // Colors for the podium places
    const colors = {
        0: 'bg-[#ffd700]', // First place: Gold
        1: 'bg-[#c0c0c0]', // Second place: Silver
        2: 'bg-[#cd7f32]'  // Third place: Bronze
    };

    return (
      <div>
        {/* Podium */}
        <div className="flex justify-center items-end gap-8 mb-6 overflow-hidden">
          {/* Second place (left side) */}
          <div className={`flex flex-col items-center mb-4`}>
            <div className={`${colors[1]} w-24 h-24 flex items-center justify-center rounded-full shadow-lg`}>
              <span className="text-xl font-bold text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[1].name}</span>
            </div>
            <span className="mt-2">{podiumMembers[1].score} Points</span>
            <span className="text-sm mt-1  font-sans font-semibold bg-primary p-2 rounded-xl text-white">2nd</span>
          </div>
          
          {/* First place (center, higher) */}
          <div className={`flex flex-col items-center mb-10`}>
            <div className={`${colors[0]} w-28 h-28 flex items-center justify-center rounded-full shadow-lg`}>
              <span className="text-xl font-bold  text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[0].name}</span>
            </div>
            <span className="mt-2">{podiumMembers[0].score} Points</span>
            <span className="text-sm mt-1 font-sans font-semibold bg-primary p-2 rounded-xl text-white">1st</span>
          </div>
          
          {/* Third place (right side) */}
          <div className={`flex flex-col items-center mb-4`}>
            <div className={`${colors[2]} w-24 h-24 flex items-center justify-center rounded-full shadow-lg`}>
              <span className="text-xl font-bold text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[2].name}</span>
            </div>
            <span className="mt-2">{podiumMembers[2].score} Points</span>
            <span className="text-sm mt-1 font-sans font-semibold bg-primary p-2 rounded-xl text-white">3rd</span>
          </div>
        </div>
  
        {/* List of other members */}
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-1 overflow-auto">
            <List>
              {otherMembers.map((member, index) => (
                <ListItem key={index} divider className="flex justify-between">
                  {/* Ranking Number */}
                  <span className="mr-2 font-bold">#{index + 4}</span>

                  {/* Avatar and Name */}
                  <ListItemAvatar>
                      <CustomAvatar username={member.name.split(' ')[0]} />
                  </ListItemAvatar>
                  <ListItemText primary={member.name} secondary={member.role} className="flex-grow" />

                  {/* Points */}
                  <span>{member.score} Points</span>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    );
};



export default TeamOverviewOverlay;