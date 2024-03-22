import React, { useState, useEffect, useRef } from 'react';
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LeaderboardNavbar from '../../leaderboard/leaderboardNavbar';
import { Tooltip } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsOverlay from '../../overlays/settingsOverlay';
import { useTTS } from "../../../../app/utils/tts/TTSContext";
import "../../../../app/utils/i18n"
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
const CallButton = dynamic(() => import("_components/ui/call/call"), { ssr: false });


const Navbar = ({ isOpen, toggleSidebar, setShowCallScreen, setCallVideoStreams, callVideoStreams, 
				  toggleAudio, toggleVideo, leaveCall, micEnabled, videoEnabled, setLeaveCall }) =>
{
	const { t } = useTranslation('navbar');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const leaderboardRef = useRef(null);
    const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon
    const [showSettings, setShowSettings] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("profile");
    const settingsOverlayRef = useRef(null); 
	const toggleLeaderboard = () =>
	{
		setShowLeaderboard(!showLeaderboard);
	};
	const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);

	const toggleSettingsOverlay = () =>
	{
		setShowSettingsOverlay(!showSettingsOverlay); // Toggle the state
	};
    

	const handleCloseSettings = () =>
	{
		setShowSettingsOverlay(false);
	};

	const handleOpenSettings = (screen) =>
	{
		setCurrentScreen(screen);
		setShowSettingsOverlay(true); // Use setShowSettingsOverlay to show the settings overlay.
	};
      
	useEffect(() =>
	{
		function handleClickOutside(event)
		{
			if (leaderboardRef.current && !leaderboardRef.current.contains(event.target) &&
				leaderboardToggleRef.current && !leaderboardToggleRef.current.contains(event.target))
			{
				setShowLeaderboard(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
		{
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

    const tooltips = () => {
        return (
            <>
				<CallButton setShowCallScreen={setShowCallScreen} setCallVideoStreams={setCallVideoStreams} callVideoStreams={callVideoStreams}
							toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveCall={leaveCall} micEnabled={micEnabled} videoEnabled={videoEnabled} 
							setLeaveCall={setLeaveCall} />
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
                		"Notifications"
            		}
            		enterDelay={1000}
            		leaveDelay={200}
          
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

		);
	};

	return (
		<>
			<nav className="bg-primary p-4 flex items-center justify-between">
				{/* Only show MenuIcon on small screens */}
				<div className="sm:hidden">
					<MenuIcon
						className="h-6 w-6 text-white cursor-pointer"
						onClick={toggleSidebar}
						onMouseEnter={() => isTTSEnabled && speak("Open sidebar button")}
						onMouseLeave={stop}
                    />
                </div>
				<div className="flex-grow">
					<div className="flex justify-end space-x-4 items-center">
						{tooltips()}
					</div>
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