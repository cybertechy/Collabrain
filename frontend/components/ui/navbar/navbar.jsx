import React, { useState, useEffect, useRef } from 'react';
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchBar from "./navbarSubComponents/NavbarSearchbar";
import LeaderboardNavbar from '../leaderboard/leaderboardNavbar';

const Navbar = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const leaderboardRef = useRef(null);
    const leaderboardToggleRef = useRef(null); // Ref for the leaderboard toggle icon

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

    return (
        <>
            <nav className="bg-purple-600 p-4 flex items-center justify-between">
                <div className="flex-grow flex justify-center items-center mx-16">
                    {/* <SearchBar /> */}
                </div>
                <div className="flex items-center space-x-10">
                    <EmojiEventsIcon
                        ref={leaderboardToggleRef} // Attach the ref here
                        onClick={toggleLeaderboard}
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                    <NotificationsNoneIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                    <AccountCircleIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                    <SettingsIcon
                        className="cursor-pointer"
                        style={{ color: "white" }}
                    />
                </div>
            </nav>

            {showLeaderboard && (
                <div ref={leaderboardRef}>
                    <LeaderboardNavbar />
                </div>
            )}
        </>
    );
};

export default Navbar;
