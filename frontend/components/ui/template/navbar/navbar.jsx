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
import { ColorblindFilterProvider } from '../../../../app/utils/colorblind/ColorblindFilterContext';
import { useTTS } from "../../../../app/utils/tts/TTSContext";
import "../../../../app/utils/i18n"
import { useTranslation } from 'next-i18next';

const Navbar = ({ isOpen, toggleSidebar }) => {
    const { t } = useTranslation('sidebar');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const leaderboardRef = useRef(null);
    const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon
    const [showSettings, setShowSettings] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("profile");
    const settingsOverlayRef = useRef(null); 
    const toggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
    };
    const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);

    const toggleSettingsOverlay = () => {
        setShowSettingsOverlay(!showSettingsOverlay); // Toggle the state
    };
    
    
    const handleCloseSettings = () => {
        setShowSettingsOverlay(false);
    };
    const handleOpenSettings = (screen) => {
        setCurrentScreen(screen);
        setShowSettingsOverlay(true); // Use setShowSettingsOverlay to show the settings overlay.
      };
      
      useEffect(() => {
        import('jquery').then(jQuery => {
            window.jQuery = window.$ = jQuery.default;
            require('../../../../app/utils/tts/articulate');
        });
    }, []);
    
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

    const tooltips = () => {
        return (
            <ColorblindFilterProvider>
            <>
            <Tooltip
            title={t('leaderboard')}
            enterDelay={1000}
            leaveDelay={200}
            onMouseEnter={() => isTTSEnabled && speak("Leaderboard")}
            onMouseLeave={stop}
            > 
                    <EmojiEventsIcon
                        ref={leaderboardToggleRef} // Attach the ref here
                        onClick={toggleLeaderboard}
                        className="cursor-pointer"
                        style={{ color: "#FFFFFF" }}
                    />
                    </Tooltip>
                    <Tooltip
            title={
                t('notifications')
            }
            enterDelay={1000}
            leaveDelay={200}
            onMouseEnter={() => isTTSEnabled && speak("Notifications")}
            onMouseLeave={stop}
        > 
                    <NotificationsIcon
                        className="cursor-pointer"
                        style={{ color: "#FFFFFF" }}
                    />
                     </Tooltip>
                     <Tooltip
            title={t('profile_set')}
            enterDelay={1000}
            leaveDelay={200}
            onMouseEnter={() => isTTSEnabled && speak("Profile Settings")}
            onMouseLeave={stop}
        > 
                    <AccountCircleIcon
                        className="cursor-pointer"
                        style={{ color: "#FFFFFF" }}
                        onClick={toggleSettingsOverlay}
                    />
                     </Tooltip>
                     </>
                     </ColorblindFilterProvider>

        )
    }

    return (
        <>
            <nav className="bg-primary p-4 flex items-center justify-between">
                <div className={`flex-grow flex xsm:hidden ${isOpen ? "hidden" : ""}`}>
                    <MenuIcon
                    className="h-6 w-6 mb-2 text-lg text-basicallylight transition-all duration-500 ease-in-out"
                    onClick={toggleSidebar}
                    fontSize="large"
                    onMouseEnter={() => isTTSEnabled && speak("Open sidebar button")}
                    onMouseLeave={stop}
                    />
                </div>
                <div className={`h-1 hidden xsm:block transition-all duration-1000 ease-in-out ${isOpen ? "max-sm:hidden" : ""}`}></div>
                <div className="flex items-end space-x-10 lg:space-x-7">
                    {tooltips()}
                </div>                
            </nav>

            {showLeaderboard && (
                <div ref={leaderboardRef}>
                    <LeaderboardNavbar />
                </div>
            )}
          {showSettingsOverlay && (
    <div ref={settingsOverlayRef}>
        <SettingsOverlay onClose={handleCloseSettings} />
    </div>
)}
        </>
    );
};

export default Navbar;
