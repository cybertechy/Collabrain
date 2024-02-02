import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import Avatar from '@mui/material/Avatar';
import { grey } from '@mui/material/colors';

const ProfileBox = ({ userData, onMute, onDeafen, onSettings }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const avatarName = userData?.fname ? `${userData.fname} ${userData.lname}` : "User";
    const displayName = userData?.username || "User";
    const handleMute = () => {
        setIsMuted(!isMuted);
        onMute();
    };

    const handleDeafen = () => {
        setIsDeafened(!isDeafened);
        onDeafen();
    };

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
      console.log(userData)
    return (
        <div className=" bg-primary w-full text-white p-2 flex flex-col justify-between items-center shadow-lg">
            <div className="flex items-center flex-row mt-2">
            <Avatar {...stringAvatar(avatarName)} />
<span className="ml-2">{displayName}</span>
            </div>
            <div>
                <IconButton onClick={handleMute}>
                    {isMuted ? <MicOffIcon className="text-white" /> : <MicIcon className="text-white" />}
                </IconButton>
                <IconButton onClick={handleDeafen}>
                    {isDeafened ? <VolumeOffIcon className="text-white" /> : <VolumeUpIcon className="text-white" />}
                </IconButton>
                <IconButton onClick={onSettings}>
                    <SettingsIcon className="text-white" />
                </IconButton>
            </div>
        </div>
    );
};

export default ProfileBox;
