
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const TopBar = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('dms');
  const { speak, stop, isTTSEnabled } = useTTS();
  // Directly use `activeTab` to control button styles and logic
  const tabButtonStyle = (tabName) => ({
    color: activeTab === tabName ? '#30475E' : '#9DA5AF', // Color for active/inactive tabs
    borderBottom: activeTab === tabName ? '2px solid #30475E' : 'none',
    borderRadius: '0', // Remove rounding of buttons
    '&:hover': {
      borderBottom: '2px solid #30475E', // Highlight on hover
      opacity: 1,
    },
    marginRight: 2,
    textTransform: 'none', // Default text style
  });

  // Toggle "Add Friend" tab or switch back to "all"
  const handleAddFriendClick = () => {
    onTabChange(activeTab === 'addFriend' ? 'all' : 'addFriend');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <Box>
        <Button id="all" sx={tabButtonStyle('all')} onClick={() => onTabChange('all')}
        onMouseEnter={() => isTTSEnabled && speak("All Friends section")} onMouseLeave={stop}>{t('all_btn')}</Button>
        <Button id="received" sx={tabButtonStyle('Recieved')} onClick={() => onTabChange('Recieved')}
        onMouseEnter={() => isTTSEnabled && speak("Received friend requests section")} onMouseLeave={stop}>{t('received_btn')}</Button>
        <Button id="blocked" sx={tabButtonStyle('blocked')} onClick={() => onTabChange('blocked')}
        onMouseEnter={() => isTTSEnabled && speak("Blocked Users section")} onMouseLeave={stop}>{t('blocked_btn')}</Button>
        <Button id="addFriend" sx={tabButtonStyle('addFriend')} onClick={() => onTabChange('addFriend')}
        onMouseEnter={() => isTTSEnabled && speak("Search Users section")} onMouseLeave={stop}>{t('search_users')}</Button>

      </Box>
    </Box>
  );
};

export default TopBar;
