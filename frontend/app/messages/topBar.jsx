// components/TopBar.js
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TopBar = ({ activeTab, onTabChange }) => {
  // Helper function to determine button styling
  const [isAddFriendSelected, setIsAddFriendSelected] = React.useState(false);

  const tabButtonStyle = (tabName) => ({
    color: activeTab === tabName ? '#30475E' : '#9DA5AF', // Tailwind primary color for active, secondary for inactive
    borderBottom: activeTab === tabName ? '2px solid #30475E' : 'none',
    borderRadius: '0', // Removes the rounding of the buttons
    '&:hover': {
      borderBottom: '2px solid #30475E',
      opacity: 1,
    },
    marginRight: 2,
    textTransform: 'none', // Keeps the text style as default
  });
  const handleAddFriendClick = () => {
    const newSelectedState = !isAddFriendSelected;
    setIsAddFriendSelected(newSelectedState);
    if (newSelectedState) {
      onTabChange('addFriend');
    } else {
      onTabChange('all'); // Or any other default state you'd like
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <Box>
        <Button sx={tabButtonStyle('all')} onClick={() => {onTabChange('all'); setIsAddFriendSelected(!isAddFriendSelected); }}>
          All
        </Button>
        <Button sx={tabButtonStyle('Recieved')} onClick={() => {onTabChange('Recieved');setIsAddFriendSelected(!isAddFriendSelected);}}>
          Recieved
        </Button>
        <Button sx={tabButtonStyle('blocked')} onClick={() => {onTabChange('blocked');setIsAddFriendSelected(!isAddFriendSelected);}}>
          Blocked
        </Button>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddFriendClick}
        sx={{
          bgcolor: activeTab === "addFriend" ? '#81c3d7' : '#30475E', // Toggle color based on selection
          color: activeTab === "addFriend" ? '#30475E' : '#FFFFFF',
          '&:hover': {
            bgcolor: '#81c3d7',
            color: '#30475E'
          },
        }}
      >
        Add Friend
      </Button>
    </Box>
  );
};

export default TopBar;
