import React, { useState, useEffect, useRef } from 'react';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchBar from "./navbarSubComponents/NavbarSearchbar";
import LeaderboardNavbar from '../../leaderboard/leaderboardNavbar';
import { Tooltip } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import { isSidebarOpen } from "../sidebar/sidebar";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsOverlay from '../../overlays/settingsOverlay';
import Template from '../template';

const Navbar = ({ isOpen, toggleSidebar }) =>
{
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

	const tooltips = () =>
	{
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
					title={"Profile Settings"}
					enterDelay={1000}
					leaveDelay={200}

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
				<div className="md:hidden">
					<MenuIcon
						className="h-6 w-6 text-white cursor-pointer"
						onClick={toggleSidebar}
					/>
				</div>
				<div className="flex-grow">
					<div className="flex justify-end space-x-4">
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
