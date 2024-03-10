import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TopBar = ({ activeTab, onTabChange }) => {
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
        <Button sx={tabButtonStyle('all')} onClick={() => onTabChange('all')}>All</Button>
        <Button sx={tabButtonStyle('Recieved')} onClick={() => onTabChange('Recieved')}>Received</Button>
        <Button sx={tabButtonStyle('blocked')} onClick={() => onTabChange('blocked')}>Blocked</Button>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddFriendClick}
          sx={{
            bgcolor: activeTab === "addFriend" ? '#FFFFFF' : '#30475E',
            color: activeTab === "addFriend" ? '#30475E' : '#FFFFFF',
            '&:hover': {
              bgcolor: '#FFFFFF', // Ensure contrast remains on hover
              color: '#30475E',
            },
            marginLeft: 2,
          }}
        >
          Add Friend
        </Button>
      </Box>
    </Box>
  );
};

export default TopBar;
