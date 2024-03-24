import React, { useState, useEffect, useRef, forwardRef } from 'react';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LeaderboardNavbar from '../../leaderboard/leaderboardNavbar';
import NotificationOverlay from '../../notifications/notificationsOverlay';
import { Tooltip } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsOverlay from '../../overlays/settingsOverlay';
import dynamic from 'next/dynamic';
const CallButton = dynamic(() => import("_components/ui/call/call"), { ssr: false });
import { set } from 'react-hook-form';
import Badge from '@mui/material/Badge';
const fb = require('_firebase/firebase');

import { fetchUser } from '@/app/utils/user';const Navbar = ({ isOpen, toggleSidebar }) =>
{
    const [user, loading] = fb.useAuthState();
	const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
	const leaderboardRef = useRef(null);
    const notificationsRef = useRef(null);
	const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle ico
    const notificationsToggleRef = useRef(null);
    const [teamInvites, setTeamInvites] = useState([]); // State to store team invites
    const [makeUpdate, setMakeUpdate] = useState(0);
    const toggleNotifications = () => {
      setShowNotifications(!showNotifications);
      setShowLeaderboard(false);
    };
    useEffect(() => {
        const fetchAndSetTeamInvites = async () => {
            if (!user) return; // Make sure the user is authenticated
    
            try {
                console.log("TRYING TO FETCH")
                const userInfo = await fetchUser(user.uid); // Call the async function to fetch invites
                console.log("FETCHED", userInfo)
                const invites = userInfo.teamInvites;
                console.log("FINISHED FETCHING", invites)
                setTeamInvites(invites); // Update the state with fetched invites
            } catch (error) {
                console.error('Error fetching team invites:', error);
            }
        };
    
        fetchAndSetTeamInvites();
    }, [user, makeUpdate]);
	const [showSettings, setShowSettings] = useState(false);
	const [currentScreen, setCurrentScreen] = useState("profile");
	const settingsOverlayRef = useRef(null);
	const toggleLeaderboard = () =>
	{
		setShowLeaderboard(!showLeaderboard);
        setShowNotifications(false);

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
      const NotificationIconWithBadge = React.forwardRef((props, ref) => {
        return (
            <Badge color="primary" variant="dot" invisible={teamInvites?.length === 0}>
                <NotificationsIcon
                    {...props} // Spread the received props here
                    ref={ref}
                    onClick={toggleNotifications}
                    className="cursor-pointer"
                    style={{ color: "#FFFFFF" }}
                />
            </Badge>
        );
    });
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (leaderboardRef.current && !leaderboardRef.current.contains(event.target) &&
                leaderboardToggleRef.current && !leaderboardToggleRef.current.contains(event.target)) {
                setShowLeaderboard(false);
            } if (notificationsRef.current && !notificationsRef.current.contains(event.target) &&
            notificationsToggleRef.current && !notificationsToggleRef.current.contains(event.target)) {
                setShowNotifications(false);
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
				<CallButton />
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
					  <NotificationIconWithBadge/>
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
				<div className="sm:hidden">
					<MenuIcon
						className="h-6 w-6 text-white cursor-pointer"
						onClick={toggleSidebar}
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
            {showNotifications && (
                <div ref={notificationsRef}>
                    <NotificationOverlay teamInvites={teamInvites} onUpdate={()=>{setMakeUpdate(makeUpdate+1)}}/>
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