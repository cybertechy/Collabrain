// components/TopBar.js
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TopBar = ({ activeTab, onTabChange }) => {
  // Helper function to determine button styling
  const tabButtonStyle = (tabName) => ({
    color: activeTab === tabName ? '#972FFF' : '#9DA5AF', // Tailwind primary color for active, secondary for inactive
    borderBottom: activeTab === tabName ? '2px solid #972FFF' : 'none',
    borderRadius: '0', // Removes the rounding of the buttons
    '&:hover': {
      borderBottom: '2px solid #972FFF',
      opacity: 1,
    },
    marginRight: 2,
    textTransform: 'none', // Keeps the text style as default
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <Box>
        <Button sx={tabButtonStyle('all')} onClick={() => onTabChange('all')}>
          All
        </Button>
        <Button sx={tabButtonStyle('pending')} onClick={() => onTabChange('pending')}>
          Pending
        </Button>
        <Button sx={tabButtonStyle('blocked')} onClick={() => onTabChange('blocked')}>
          Blocked
        </Button>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => onTabChange('addFriend')}
        sx={{
          bgcolor: '#972FFF', // Tailwind primary color
          color: '#FFFFFF',
          '&:hover': {
            bgcolor: '#7f22ff', // A slightly darker shade for hover effect
          },
        }}
      >
        Add Friend
      </Button>
    </Box>
  );
};

export default TopBar;
