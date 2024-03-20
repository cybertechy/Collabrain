import Link from "next/link";
const { useRouter } = require("next/navigation");
import SidebarButtonIcon from "./sidebarSubComponents/sidebarButton";
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from "@mui/icons-material/Folder";
const fb = require("_firebase/firebase");
import SidebarItem from "./sidebarSubComponents/sidebarItem";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import StarRateIcon from "@mui/icons-material/StarRate";
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from "@mui/icons-material/Groups";
import ForumIcon from "@mui/icons-material/Forum";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import TeamOverlay from "../../overlays/TeamOverlay";
import TeamSidebarItem from "./sidebarSubComponents/sidebarTeamButton";
// Define the sidebar navigation items
import { usePathname } from "next/navigation";
import NewProjectOverlay from "../../overlays/NewProjectOverlay";
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery

import axios from "axios";
const navigationItems1 = [
	{ name: "My Brain", href: "/dashboard", icon: FolderIcon },
	{ name: "Shared With Me", href: "/shared-with-me", icon: PeopleIcon },

];

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;


const navigationItems2 = [
	{ name: "Direct Messages", href: "/messages", icon: ForumIcon },

];

const Sidebar = ({ teams = {}, isOpen, toggleSidebar }) => {
    const router = useRouter();
    // const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const toggleModal = () => { // Define toggleModal function
        setIsModalOpen(!isModalOpen);
    };
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" }); // Define breakpoint

    const toggleProjectModal = () => { 
        setIsProjectModalOpen(!isProjectModalOpen);
    };


	const pathname = usePathname();
	// const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [userTeams, setUserTeams] = useState(null);
	const [user, loading] = fb.useAuthState();
	useEffect(() =>
	{
		if (!user)
		{

            return;
        }
        const fetchUserTeams = async () => {
            try {
                // Make a GET request to retrieve user's team IDs
                const token = await fb.getToken();
                const response = await axios.get(`${SERVERLOCATION}/api/teams`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Replace with the actual auth token
                    },
                });
    
                // Check if the request was successful
                if (response.status === 200) {
                    const teamIds = response.data;
    
                    // Create an array of promises to fetch team information
                    const teamPromises = teamIds.map(async (teamId) => {
                        const teamResponse = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`, // Replace with the actual auth token
                            },
                        });
    
                        // Check if the request for team information was successful
                        if (teamResponse.status === 200) {
                            // Merge teamId with the team data
                            return {
                                teamId,
                                ...teamResponse.data
                            };
                        } else {
                            console.error('Failed to fetch team information:', teamResponse.statusText);
                            return null;
                        }
                    });
    
                    // Use Promise.all to wait for all promises to resolve
                    const teamsData = await Promise.all(teamPromises);
    
                    // Filter out any null values (failed requests)
                    const filteredTeamsData = teamsData.filter((teamInfo) => teamInfo !== null);
    
                    // Update the userTeams state with the array of team information
                    setUserTeams(filteredTeamsData);
                  
                } else {
                    throw new Error('Failed to fetch user teams');
                }
            } catch (error) {
                console.error('Error fetching user teams:', error);
                // You can handle errors and provide user feedback here
            }
        };
    
        // Call the function to fetch user teams when the component mounts
        fetchUserTeams();
    }, [user]);
    
    


    return (
        <aside
      className={`transition-all shadow-md h-screen pt-[height_of_navbar] z-10 duration-500 ease-in-out
     ${isOpen ? (isSmallScreen ? "w-full" : "lg:w-80 md:w-80") : "hidden"}
     ${isSmallScreen && isOpen ? "fixed top-0 left-0 z-40" : "lg:block md:block md:w-20"} // Adjusted for responsive design
      bg-basicallylight text-basicallydark`}
    >
            <div className="flex flex-col">
                <div className="flex items-center justify-center h-24">
                    <div className="flex items-center justify-center">
                        {isOpen ? (
                            <div className="flex items-center justify-center transition-all duration-1000 ease-in-out">
                                <div className="flex items-center justify-center ml-7 -mr-7">
                                <img
                                    className="transition-all duration-500 ease-in-out w-12"
                                    src="/assets/images/logo_whitebackground.png"
                                    alt="Collabrain Logo"
                                />
                                <p className="text-xl font-semibold transition-all duration-1000 ease-in-out cursor-context-menu">
                                    Collabrain
                                </p>
                                </div>
                                <CloseIcon
                                    className="text-xl ml-16 text-primary transition-all duration-1000 ease-in-out cursor-pointer"
                                    onClick={toggleSidebar}
                                    fontSize="large"
                                />
                            </div>
                        ) : (
                            <div className="flex-grow flex max-xsm:hidden">
                            <MenuIcon
                                className="h-6 w-6 mb-2 text-lg text-primary transition-all duration-500 ease-in-out"
                                onClick={toggleSidebar}
                                fontSize="large"
                            />
                            </div>
                        )}
                    </div>
                </div>
                <hr className="border-t-1 mx-4 border-solid border-gray-400 opacity-30"></hr>
                {/* Navigation items */}
             <nav className="flex flex-col p-4">
                    <SidebarButtonIcon
                        key={"New Project"}
                        text={"New Project"}
                        color="primary"
                        withShadow={true}
                        onClick={toggleProjectModal}
                        Icon={() => (
                            <AddIcon fontSize = "medium" className="  text-basicallylight"></AddIcon>
                        )}
                        //     <PlusIcon fontSize = "medium"className="h-4 w-4 pt-3 pb-3 pl-5 text-white"></PlusIcon>
                        // )}
                        isExpanded={isOpen}
                    />
                    {navigationItems1.map((item) => (
                        <SidebarItem
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            text={item.name}
                            isSelected={pathname === item.href}
                            isExpanded={isOpen} // pass isOpen as isExpanded
                        />
                    ))}
                    <hr className="border-t-1 mx-4 my-6 border-solid border-gray-400 opacity-30"></hr>
                    {navigationItems2.map((item) => (
                        <SidebarItem
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            text={item.name}
                            isSelected={pathname === item.href}
                            isExpanded={isOpen} // pass isOpen as isExpanded
                        />
                    ))}
                                      <SidebarButtonIcon
                key={"New Team"}
                text={"New Team"}
                color="primary"
                withShadow={true}
                onClick={toggleModal} // Use toggleModal to open the overlay
                Icon={() => (
                    <GroupAddIcon fontSize="medium" className="text-basicallylight"></GroupAddIcon>
                )}
                isExpanded={isOpen}
            />
            
            {isModalOpen && <TeamOverlay toggleModal={ toggleModal} modalVisible= {isModalOpen} />}
            {isProjectModalOpen && <NewProjectOverlay toggleModal={ toggleProjectModal} modalVisible= {isProjectModalOpen} />}
                

					<SidebarButtonIcon
						key={"Discover Teams"}
						text={"Discover Teams"}
						color="primary"
						withShadow={true}
						onClick={() => router.push("/leaderboard")}
						Icon={() => (
							<ExploreIcon fontSize="medium" className=" text-basicallylight"></ExploreIcon>
						)}
						isExpanded={isOpen}
					/>
					<div className={`h-full scrollbar-thin scrollbar-thumb-primary ${isOpen ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}`}>
						{userTeams ? userTeams?.map((team, index) => (
							<TeamSidebarItem key={index} team={team} isExpanded={isOpen} isSelected={pathname === `chat?teamId=${team.teamId}`} />
						)) : null}
					</div>

				</nav>
			</div>
		</aside>
	);
};

export default Sidebar;
