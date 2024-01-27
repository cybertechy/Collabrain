import React, { useState, useEffect, useRef } from 'react';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "../overlays/settingsOverlay";
import SearchBar from "./navbarSubComponents/NavbarSearchbar";
import LeaderboardNavbar from '../leaderboard/leaderboardNavbar';
import {Tooltip}  from '@mui/material';
import SettingsOverlay from '../overlays/settingsOverlay';
const Navbar = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const leaderboardRef = useRef(null);
    const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon
    const [showSettings, setShowSettings] = useState(false); 
  
    const toggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
    };
   

    // Function to toggle the SettingsOverlay
    const toggleSettings = () => {
        console.log("toggleSettings called");
        setShowSettings(!showSettings);
        console.log("showSettings:", showSettings);
    };
    useEffect(() => {
        function handleClickOutside(event) {
            if (leaderboardRef.current && !leaderboardRef.current.contains(event.target) &&
                leaderboardToggleRef.current && !leaderboardToggleRef.current.contains(event.target)) {
                setShowLeaderboard(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="bg-purple-600 p-4 flex items-center justify-between">
                <div className="flex-grow flex justify-center items-center mx-16">
                    {/* <SearchBar /> */}
                </div>
                <div className="flex items-center space-x-10">
                <Tooltip
            title={"Leaderboard"}
            enterDelay={1000}
            leaveDelay={200}
          
        > 
                    <EmojiEventsIcon
                        ref={leaderboardToggleRef} // Attach the ref here
                        onClick={toggleLeaderboard}
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                    </Tooltip>
                    <Tooltip
            title={
                "Notifications"
            }
            enterDelay={1000}
            leaveDelay={200}
          
        > 
                    <NotificationsNoneIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                     </Tooltip>
                     <Tooltip
            title={"Profile Settings"}
            enterDelay={1000}
            leaveDelay={200}
          
        > <AccountCircleIcon
        className="cursor-pointer"
        style={{ color: "white" }}
        onClick={toggleSettings} // Attach onClick handler here
    />
                     </Tooltip>
                   
                </div>
            </nav>

            {showLeaderboard && (
                <div ref={leaderboardRef}>
                    <LeaderboardNavbar />
                </div>
            )}
               {showSettings && <SettingsOverlay setOpenModal={setShowSettings} modalVisible={showSettings} />} 

        </>
    );
};

export default Navbar;
