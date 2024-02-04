import { List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material';
import { Add as AddIcon, Message as MessageIcon } from '@mui/icons-material';
import React from 'react';
import ProfileBox from '../../components/ui/chatsComponents/profileBox';
import { useState } from 'react';
import { Button } from '@mui/material';
// Reusable Direct Message Item Component
const DirectMessageItem = ({ name, message, avatar, onClick }) => {
   
  
   

  function stringAvatar(name = "User") {
    // Split the name into words, capitalize the first letter of each, and join the initials
    const initials = name.split(' ')
      .map(word => word[0] ? word[0].toUpperCase() : '') // Capitalize the first letter of each word
      .join('');
  
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials, // Use the capitalized initials
    };
  }
  
  function stringToColor(string = "User") {
    let hash = 0;
    let i;
  
    // Convert string to hash
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Convert hash to color
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    // Check if color is too light
    if (isColorLight(color)) {
      // If color is light, return a dark color or adjust the color as needed
      return { backgroundColor: color, color: '#000' }; // light color background, dark text
    } else {
      // If color is dark, return it with a light text color
      return { backgroundColor: color, color: '#fff' }; // dark color background, light text
    }
  }
  
  function isColorLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155; // Brightness threshold, adjust if needed
  }
  
      
  return (
    <ListItem button onClick={onClick} className="border-b border-gray-200">
      <ListItemAvatar>
        <Avatar {...stringAvatar(name[0])} />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={message}   />
    </ListItem>
  );
};

// Direct Messages Sidebar Component
const DMSideBar = ({ friendsHandler, directMessages , userData}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const onMute = () => {
  }
  const onDeafen = () => {
  }
    const handleMute = () => {
        setIsMuted(!isMuted);
        onMute();
    };

    const handleDeafen = () => {
        setIsDeafened(!isDeafened);
        onDeafen();
    };
    const handleSettings = () => {
    console.log('Settings opened');
  };
  const handleAddDM = () => {
    // Logic to handle adding a new direct message
    console.log('Add Direct Message');
  };

  console.log(userData)
  const buttonStyle = {
    textTransform: 'none',
    justifyContent: 'start', // Aligns content to the left inside the button
    width: '100%', // Ensures button takes full available width
    borderBottom: '2px solid rgb(229, 231, 235)', // Changes border color to rgb(229, 231, 235)
    borderRadius: '0' // Removes roundedness
  };
return (
    <div className="flex flex-col h-full w-1/5 bg-neutral shadow-md">
        <div className="flex-grow flex flex-col justify-between">
            <div>
                <Button style={buttonStyle} onClick={()=>{}}>
                    <div className='flex justify-around items-center p-2 w-full  text-primary border-gray-200'>
                        <h2 className="text-lg font-normal font-poppins">Friends</h2>
                        <MessageIcon className='text-primary'/>
                    </div>
                </Button>
                
                {/* <Button style={buttonStyle} onClick={handleAddDM}>
                    <div className="flex justify-around items-center p-2 w-full text-primary border-gray-200">
                        <h2 className="text-lg font-normal font-poppins">Direct Messages</h2>
                        <AddIcon className='text-primary'/>
                    </div>
                </Button> */}


<List className="overflow-auto text-basicallydark">
  
  {
   Array.isArray(directMessages) &&
  directMessages?.map((dm, index) => (
    <DirectMessageItem
      key={index}
      data = {dm.members[1]}
      name={dm.members[1].fname + " " + dm.members[1].lname} // Assuming the first member is the recipient
      message={dm.lastMessage ? dm.lastMessage.message : 'Enter your first message!'} // Display the last message if available
      avatar={dm.members[1].id} // You can use the member ID or another identifier for the avatar
      onClick={() => console.log(`Clicked on ${dm.members[1].username}`)}
    />
  ))}
</List>
            </div>

            <div>
                <ProfileBox
                    userData={userData?.data}
                    onMute={handleMute}
                    onDeafen={handleDeafen}
                    onSettings={handleSettings}
                />
            </div>
        </div>
    </div>
);

};
export default DMSideBar;
