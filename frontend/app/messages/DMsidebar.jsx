import { List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material';
import { Add as AddIcon, Message as MessageIcon } from '@mui/icons-material';
import React from 'react';
import ProfileBox from '../../components/ui/chatsComponents/profileBox';
import { useState } from 'react';
// Reusable Direct Message Item Component
const DirectMessageItem = ({ name, message, avatar, onClick, userInfo }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

   

    function stringAvatar(name = "User") {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
        };
      }
      
      function stringToColor(string = "User") {
        let hash = 0;
        let i;
      
        /* Convert string to hash */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        /* Convert hash to color */
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
      
        return color;
      }
      
  return (
    <ListItem button onClick={onClick} className="border-b border-gray-200">
      <ListItemAvatar>
        <Avatar {...stringAvatar(name[0])} />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={message} />
    </ListItem>
  );
};

// Direct Messages Sidebar Component
const DMSideBar = ({ friendsHandler, directMessages , userData}) => {

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

  return (
    <div className="flex flex-col h-full w-1/5 bg-neutral shadow-md">
        <div className="flex-grow flex flex-col justify-between">
            <div>
                <IconButton onClick={friendsHandler} className="text-black w-full" style={{ borderRadius: 0 }}>
                    <MessageIcon className='text-black'/>
                    <span className='ml-2 text-black'>Friends</span>
                </IconButton>

                <div className="flex justify-around items-center p-2 border-b text-black border-gray-200">
                    <h2 className="text-lg font-normal font-poppins">Direct Messages</h2>
                    <IconButton onClick={handleAddDM}>
                        <AddIcon className='text-black'/>
                    </IconButton>
                </div>

                <List className="overflow-auto text-black">
                    {directMessages.map((dm, index) => (
                        <DirectMessageItem
                            key={index}
                            name={dm.name}
                            message={dm.message}
                            avatar={dm.avatar}
                            onClick={() => console.log(`Clicked on ${dm.name}`)}
                        />
                    ))}
                </List>
            </div>

            <div>
                <ProfileBox
                    userInfo={userData.data}
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
