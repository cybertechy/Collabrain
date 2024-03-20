import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import CustomAvatar from './avatar';

const userProfileBox = ({ userData, onMute, onDeafen, onSettings }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [displayName, setDisplayName] = useState("User");
    const [avatarName, setAvatarName] = useState("User");
    useEffect(() => {
      
       userData?.data?.username ? setDisplayName(userData.data?.username) : setDisplayName("User");
         userData?.data?.fname ? setAvatarName(`${userData.data?.fname} ${userData.data?.lname}`) : setAvatarName("User");
    }, [userData]);
    const handleMute = () => {
        setIsMuted(!isMuted);
        onMute();
    };

    const handleDeafen = () => {
        setIsDeafened(!isDeafened);
        onDeafen();
    };
    const formatDisplayName = (name) => {
        if (name.length > 14) {
            return name.substring(0, 11) + '...';
        }
        return name;
    };
    return (
        <div className="bg-primary w-64 text-white p-4 flex flex-col h-full items-center shadow-xl rounded-t-lg">
            <div className="flex items-center flex-row mt-2 space-x-2 ">
                <CustomAvatar username={displayName} />
                <span className="font-semibold">{formatDisplayName(displayName)}</span>
            </div>
           
        </div>
    );
};

export default userProfileBox;
