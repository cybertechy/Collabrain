'use client';
import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
const fb = require("_firebase/firebase");
import { useAuthState } from "@/app/_firebase/firebase";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Template from "@/components/ui/template/template";
import GroupsIcon from '@mui/icons-material/Groups';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const Leaderboard = () => {
  const [teamData, setTeamData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [user, loading] = useAuthState();
  const [clickedRow, setClickedRow] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const { t } = useTranslation('discover');
  const { speak, stop, isTTSEnabled } = useTTS();

  const fetchTeams = async () => {
    try {
      const token = await fb.getToken();
      const response = await axios.get(`${SERVERLOCATION}/api/teams?sort=score`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamData(response.data.map((team, index) => ({ ...team, rank: index + 1 })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchJoinedTeams = async () => {
      try {
        const token = await fb.getToken();
        const response = await axios.get(`${SERVERLOCATION}/api/teams?names=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Joined Team Data: ", response.data);
        setJoinedTeams(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJoinedTeams();
    fetchTeams();
  }, [user]);

  const handleRowClick = (teamName) => {
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

  const handleJoinTeam = async (teamId,teamName) => {
    try {
      const token = await fb.getToken();
      const response = await axios.post(`${SERVERLOCATION}/api/teams/${teamId}/users?invite=true`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setJoinedTeams([...joinedTeams, teamName]);
        console.log('Team joined successfully');
      } else {
        console.error('Error joining team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 lg:px-10 pt-8">
        <p className="text-3xl font-md text-start text-primary bg-white mb-4"
          onMouseEnter={() => isTTSEnabled && speak("Discover Teams")} onMouseLeave={stop}>{t('top')}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-primary"
            onMouseEnter={() => isTTSEnabled && speak("Joined Teams")} onMouseLeave={stop}>{t('joined_teams')}</p>
        </div>
        {joinedTeams.length > 0 ? (
          <div className="flex text-white flex-wrap gap-2 mt-3 mb-5">
            {joinedTeams.map((teamId, index) => (
              <div key={index} className="bg-primary rounded-lg p-2 flex items-center"
              onMouseEnter={() => isTTSEnabled && speak(`Team ${teamId}`)}
              onMouseLeave={stop}>
                <GroupsIcon className="mr-2 text-secondary" />
                <span>{teamData.find((team) => team.name === teamId)?.name || teamId}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className='mt-3 mb-5 text-gray-400'>{t('no_joins')}</p>
        )}

        <div className="border-gray-300 inner-shadow border-2 bg-aliceBlue rounded-md drop-shadow-md overflow-visible">
          {/* Search bar */}
          <div className="p-4 flex justify-between">
            <SearchIcon className='mt-1.5 mr-2 text-3xl text-primary' />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('search')}
              className="p-2 border border-gray-300 rounded-lg w-full"
              onMouseEnter={() => isTTSEnabled && speak("Type a team's name here to search")}
              onMouseLeave={stop}
            />
          </div>

          {/* Header row for team data */}
          <div className="flex text-start justify-start bg-primary font-bold px-4 py-2">
            <span className="text-lg text-white w-1/4" onMouseEnter={() => isTTSEnabled && speak("Team Rank")}
              onMouseLeave={stop}>{t('rank')}<EmojiEventsIcon className='pl-2 text-3xl' /></span>
            <span className="text-lg text-white w-1/4" onMouseEnter={() => isTTSEnabled && speak("Team Name")}
              onMouseLeave={stop}>{t('name')}</span>
            <span className="text-lg text-white w-1/4" onMouseEnter={() => isTTSEnabled && speak("Team Score")}
              onMouseLeave={stop}>{t('score')}</span>
            <span className="text-lg text-white w-1/4" onMouseEnter={() => isTTSEnabled && speak("Actions")}
              onMouseLeave={stop}>{t('actions')}</span>
          </div>

          <div className="flex flex-col overflow-visible">
            {teamData.map((team, index) => (
              <div
                key={index}
                className={`h-16 flex items-center justify-start border-b border-gray-200 py-2 px-4 cursor-pointer relative transform transition-all duration-300 ${clickedRow === team.name ? 'scale-100 shadow-xl bg-secondary' : 'scale-100', 'border-none', 'rounded-md'
                  }`}
                onClick={() => handleRowClick(team.name)}
                onMouseEnter={() => setHoveredRow(team.name)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  overflow: 'visible',
                  backgroundColor: clickedRow === team.name ? '#81c3d7' : hoveredRow === team.name ? '#C9D6DF' : 'aliceblue',
                  transform: clickedRow === team.name ? 'scale(1)' : 'scale(1)',
                }}
              >
                <span className="text-lg w-1/4 pl-2 text-primary "
                  onMouseEnter={() => isTTSEnabled && speak(`Rank number ${team.rank}`)} 
                  onMouseLeave={stop}># {team.rank}</span>
                <span className="text-lg w-1/4 text-start text-primary overflow-hidden"
                    onMouseEnter={() => isTTSEnabled && speak(`Team ${team.name}`)}
                    onMouseLeave={stop}>{team.name}</span>
                <span className="text-lg text-center w-1/4 text-primary"
                    onMouseEnter={() => isTTSEnabled && speak(`Score ${team.score}`)}
                    onMouseLeave={stop}>{team.score}</span>
                {joinedTeams.includes(team.name) ? (
                  <button
                    className=" text-green-500 px-4 py-2 rounded-lg ml-2 cursor-default"
                    disabled
                  >
                    {t('joined')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinTeam(team.id,team.name)}
                    className="bg-green-500 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg ml-2"
                    onMouseEnter={() => isTTSEnabled && speak("Join Team button")}
                    onMouseLeave={stop}
                  >
                    {t('join')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;