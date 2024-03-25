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
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
const CallButton = dynamic(() => import("_components/ui/call/call"), { ssr: false });
import { set } from 'react-hook-form';
import Badge from '@mui/material/Badge';
const fb = require('_firebase/firebase');
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { fetchUser } from '@/app/utils/user';
import {useRouter} from 'next/navigation';
const Navbar = ({ isOpen, toggleSidebar }) =>
{
    const router = useRouter();
    const [user, loading] = fb.useAuthState();
    const { t } = useTranslation('navbar');
    const { speak, stop, isTTSEnabled } = useTTS();
	const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
	const leaderboardRef = useRef(null);
    const notificationsRef = useRef(null);
	const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon
    const notificationsToggleRef = useRef(null);
    const [teamInvites, setTeamInvites] = useState([]); // State to store team invites
    const [makeUpdate, setMakeUpdate] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowLeaderboard(false);
    };

    useEffect(() => {
        const fetchAndSetTeamInvites = async () => {
            if (!user) return; // Make sure the user is authenticated

            try {
                console.log("TRYING TO FETCH")
                const x = await fetchUser(user.uid); // Call the async function to fetch invites
                setUserInfo(x);
                
                const invites = x.teamInvites;
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
    const toggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
        setShowNotifications(false);

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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tooltips = () => {
        return (
            <>
                <CallButton />

                {userInfo?.role == "platform manager" &&(  <Tooltip
                    title={t('platform management')}
                    enterDelay={1000}
                    leaveDelay={200}
                    onMouseEnter={() => isTTSEnabled && speak("Platform Management")}
                    onMouseLeave={stop}
                >
                    <MonitorHeartIcon
                        className="cursor-pointer"
                        style={{ color: "#FFFFFF" }}
                        onClick={()=>{router.push("/platformManager")}}
                    />
                </Tooltip>)}
              {userInfo?.role == "content moderator" &&( <Tooltip
                    title={t('content moderation')}
                    enterDelay={1000}
                    leaveDelay={200}
                    onMouseEnter={() => isTTSEnabled && speak("Content Moderation")}
                    onMouseLeave={stop}
                >
                    <ManageAccountsIcon
                        className="cursor-pointer"
                        style={{ color: "#FFFFFF" }}
                        onClick={()=>{router.push("/contentModeration")}}
                    />
                </Tooltip>
 )}
                
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
                    <NotificationIconWithBadge />
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
            {showNotifications && (
                <div ref={notificationsRef}>
                    <NotificationOverlay teamInvites={teamInvites} onUpdate={() => { setMakeUpdate(makeUpdate + 1) }} />
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