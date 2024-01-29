import React, { useState, useEffect, useRef } from 'react';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchBar from "./navbarSubComponents/NavbarSearchbar";
import LeaderboardNavbar from '../../leaderboard/leaderboardNavbar';
import {Tooltip}  from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import { isSidebarOpen } from "../sidebar/sidebar";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsOverlay from '../../overlays/settingsOverlay';
import Template from '../template';


const Navbar = ({ isOpen, toggleSidebar }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const leaderboardRef = useRef(null);
    const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); 
    const [showSettings, setShowSettings] = useState(false);
    const toggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
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

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navbarStyle = () => {
    if (!isOpen) {
        if (windowWidth < 400) {
            return (
                <MenuIcon
                                className="h-6 w-6 mb-2 text-lg text-white transition-all duration-500 ease-in-out"
                                onClick={toggleSidebar}
                                fontSize="large"
                            />
            
              
            )
        }
    }
}

    const tooltips = () => {
        return (
            <>
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
                    <NotificationsIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                     </Tooltip>
                     <Tooltip
            title={"Profile Settings"}
            enterDelay={1000}
            leaveDelay={200}
          
        > 
                    <AccountCircleIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                     </Tooltip>
                     </>

        )
    }

    return (
        <>
            <nav className="bg-purple-600 p-4 flex items-center justify-between">
                <div className="flex-grow flex">
                    {navbarStyle()}
                </div>
                {(windowWidth > 500) ? 
                (<div className="flex items-center space-x-10">
                    {tooltips()}
                </div>) 
                : 
                (<div className="flex items-center space-x-7">
                   {tooltips()}
                </div>)}
                
            </nav>

            {showLeaderboard && (
                <div ref={leaderboardRef}>
                    <LeaderboardNavbar />
                </div>
            )}
            {(
                <div >
                    <SettingsOverlay />
                </div>
            )}
        </>
    );
};

export default Navbar;
