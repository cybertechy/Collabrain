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
  //  const avatarName = userData?.fname ? `${userData.fname} ${userData.lname}` : "User";
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
        <div className=" bg-primary w-full text-white p-2 flex flex-col justify-between items-center shadow-lg">
            <div className="flex items-center flex-row mt-2">
            <Avatar {...stringAvatar(displayName)} />
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
