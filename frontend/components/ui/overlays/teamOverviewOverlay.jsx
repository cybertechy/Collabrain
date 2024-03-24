import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Switch } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import CustomAvatar from '../messagesComponents/avatar'; 
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const TeamOverviewOverlay = ({ onClose,teamData, members }) => {
  const { t } = useTranslation('team_overview');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [subPage, setSubPage] = useState('description'); // State for managing subpage
console.log("Team Data",teamData, members, "members")
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
                <DescriptionIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} onMouseEnter={() => isTTSEnabled && speak("Description section")} onMouseLeave={stop}/>
                {t('desc')}
              </button>
              <button className={`flex items-center justify-start p-2 w-full rounded-md mb-2 text-nowrap font-semibold ${subPage === 'leaderboard' ? 'bg-white text-primary' : ' hover:bg-gray-700'}`} onClick={() => handleSubPageChange('leaderboard')}>
                <LeaderboardIcon sx={{ color: '#81c3d7', mr: 1 , fontSize: '2.3rem' }} onMouseEnter={() => isTTSEnabled && speak("Leaderboard section")} onMouseLeave={stop}/>
                {t('leaderboard')}
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className='flex-grow p-4 overflow-auto'>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mt-3">{subPage === 'description' ? t('desc') : t('leaderboard')}</h2>
            <button
              className="absolute top-5 right-5 bg-transparent border-none cursor-pointer"
              onClick={onClose}
              onMouseEnter={() => isTTSEnabled && speak("Close Team Overview button")} onMouseLeave={stop}
            >
              <CloseIcon className="text-basicallydark" fontSize="large" />
            </button>
          </div>
          {/* Render different content based on selected subpage */}
          {subPage === 'description' && (
       <DescriptionContent 
       teamData={teamData}
       members = {members}
     />
          )}
          {subPage === 'leaderboard' && (
            <LeaderboardContent   teamData = {teamData} members = {members}/>
                  )}        </div>
      </div>
    </div>
  );
};

const DescriptionContent = ({ teamData, members }) => {
  const { t } = useTranslation('team_overview');
  const { speak, stop, isTTSEnabled } = useTTS();
    return (
        <div>
            {/* Centered team name with larger text */}
            <h3 className="text-4xl font-semibold mb-2 text-center">{teamData.name}</h3>
            <div className="text-center mb-4">
          
                {/* Divider under the team description */}
                <hr className="my-4 border-t border-gray-300 mx-auto w-3/4" />
            </div>

            <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">{t('members')}</h4>
                {/* Fixed height for the scrollable list of team members */}
                <div className="max-h-96 overflow-auto mx-auto" style={{ width: '90%' }}>
                    <List>
                        {members.map((member, index) => (
                            <ListItem key={index} divider className="justify-center">
                                <ListItemAvatar>
                                    <CustomAvatar username={member.username} /> {/* Assuming avatar based on name */}
                                </ListItemAvatar>
                                <ListItemText primary={member.username} secondary={member.role} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        </div>
    );
};


const LeaderboardContent = ({ teamData, members }) => {
  const { t } = useTranslation('team_overview');
  const { speak, stop, isTTSEnabled } = useTTS();
    // Sort members by score in descending order if not already sorted
    const sortedMembers = [members].sort((a, b) => b.score - a.score);
    console.log("SORTED MEMBERS", sortedMembers, "members", members)
    const podiumMembers = sortedMembers.slice(0, 3); // Top 3 members for the podium
    const otherMembers = sortedMembers.slice(3); // The rest of the members
console.log("PODIUM MEMBERS", podiumMembers, "OTHER MEMBERS", otherMembers)
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
              <span className="text-xl font-bold text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[0][1]?.username}</span>
            </div>
            <span className="mt-2">{podiumMembers[0][1]?.score} {t('points')}</span>
            <span className="text-sm mt-1  font-sans font-semibold bg-primary p-2 rounded-xl text-white">{t('2nd')}</span>
          </div>
          
          {/* First place (center, higher) */}
          <div className={`flex flex-col items-center mb-10`}>
            <div className={`${colors[0]} w-28 h-28 flex items-center justify-center rounded-full shadow-lg`}>
              <span className="text-xl font-bold  text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[0][0]?.username}</span>
            </div>
            <span className="mt-2">{podiumMembers[0][0]?.score} {t('points')}</span>
            <span className="text-sm mt-1 font-sans font-semibold bg-primary p-2 rounded-xl text-white">{t('1st')}</span>
          </div>
          
          {/* Third place (right side) */}
          <div className={`flex flex-col items-center mb-4`}>
            <div className={`${colors[2]} w-24 h-24 flex items-center justify-center rounded-full shadow-lg`}>
              <span className="text-xl font-bold text-primary text-center" style={{ padding: '0 10px' }}>{podiumMembers[0][2]?.username}</span>
            </div>
            <span className="mt-2">{podiumMembers[0][2]?.score} {t('points')}</span>
            <span className="text-sm mt-1 font-sans font-semibold bg-primary p-2 rounded-xl text-white">{t('3rd')}</span>
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
                      <CustomAvatar username={member.username} />
                  </ListItemAvatar>
                  <ListItemText primary={member.username} secondary={member.role} className="flex-grow" />

                  {/* Points */}
                  <span>{member.score} {t('points')}</span>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    );
};



export default TeamOverviewOverlay;