import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import CustomAvatar from './avatar';
import { useTTS } from "../../../app/utils/tts/TTSContext";

const userProfileBox = ({ userData, onMute, onDeafen, onSettings }) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [displayName, setDisplayName] = useState("User");
    const [avatarName, setAvatarName] = useState("User");
    useEffect(() => {
        console.log("USER DATA IN PROFILE BOX",userData)
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

    const handleHover = () => {
        if (isTTSEnabled) {
            speak(`My username is ${displayName}`);
        }
    };

    const handleLeave = () => {
        stop();
    };

    return (
        <div className="bg-primary w-full text-white p-4 flex flex-col h-full items-center shadow-xl rounded-t-lg">
            <div className="flex items-center flex-row mt-2 space-x-2">
                <CustomAvatar username={displayName} />
                <span className="font-semibold"
                onMouseEnter={handleHover} onMouseLeave={handleLeave}>{displayName}</span>
            </div>
            <div className="flex mt-4 space-x-2">
                <IconButton onClick={handleMute} className="hover:bg-primary-dark rounded-full">
                    {isMuted ? <MicOffIcon className="text-white" onMouseEnter={() => isTTSEnabled && speak("Unmute Microphone")}
                onMouseLeave={stop} /> : <MicIcon className="text-white" onMouseEnter={() => isTTSEnabled && speak("Mute Microphone")}
                onMouseLeave={stop} />}
                </IconButton>
                <IconButton onClick={handleDeafen} className="hover:bg-primary-dark rounded-full">
                    {isDeafened ? <VolumeOffIcon className="text-white" onMouseEnter={() => isTTSEnabled && speak("Turn the sound on")}
                onMouseLeave={stop} /> : <VolumeUpIcon className="text-white" onMouseEnter={() => isTTSEnabled && speak("Turn the sound off")}
                onMouseLeave={stop}/>}
                </IconButton>
                <IconButton onClick={onSettings} className="hover:bg-primary-dark rounded-full">
                    <SettingsIcon className="text-white" onMouseEnter={() => isTTSEnabled && speak("Settings")}
                onMouseLeave={stop} />
                </IconButton>
            </div>
        </div>
    );
};

export default userProfileBox;
