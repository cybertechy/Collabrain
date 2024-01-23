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
import TeamOverlay from "../create_join_team/TeamOverlay"
// Define the sidebar navigation items
import { usePathname } from "next/navigation";
const navigationItems1 = [
    { name: "My Brain", href: "/dashboard", icon: FolderIcon },
    { name: "Shared With Me", href: "/shared-with-me", icon: PeopleIcon },
];

const navigationItems2 = [
    
    { name: "Direct Messages", href: "/messages", icon: ForumIcon },
   
];

const Sidebar = (teams = {}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const toggleModal = () => { // Define toggleModal function
        setIsModalOpen(!isModalOpen);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const pathname = usePathname(); 
    
    return (
        <aside
            className={`transition-all shadow-md h-screen pt-[height_of_navbar] z-10 duration-500 ease-in-out ${
                isOpen ? "w-72" : "w-20"
            } bg-white text-black`}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-center h-24">
                    <div className="flex items-center justify-center">
                        {isOpen ? (
                            <div className="flex items-center justify-center transition-all duration-1000 ease-in-out">
                                <img
                                    className="transition-all duration-500 ease-in-out w-12 mb-2"
                                    src="/assets/images/logo_whitebackground.png"
                                    alt="Collabrain Logo"
                                />
                                <p className="text-xl font-poppins transition-all duration-1000 ease-in-out">
                                    Collabrain
                                </p>
                                <CloseIcon
                                    className="text-lg ml-16 text-primary transition-all duration-1000 ease-in-out cursor-pointer"
                                    onClick={toggleSidebar}
                                    fontSize="large"
                                />
                            </div>
                        ) : (
                            <MenuIcon
                                className="h-6 w-6 mb-2 text-lg text-primary transition-all duration-500 ease-in-out cursor-pointer"
                                onClick={toggleSidebar}
                                fontSize="large"
                            />
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
                        onClick={() => router.push("/new-project")}
                        Icon={() => (
                            <AddIcon fontSize = "medium" className="  text-white"></AddIcon>
                        )}
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
                    <GroupAddIcon fontSize="medium" className="text-white"></GroupAddIcon>
                )}
                isExpanded={isOpen}
            />

{isModalOpen && <TeamOverlay toggleModal={ toggleModal} modalVisible= {isModalOpen} />}
                       {/* {teams.map(team => (
                    <SidebarItem
                        key={team.name}
                        href={`/team/${team.uid}`} // Assuming each team has a unique ID and a page
                        icon={GroupsIcon} // You can use a default icon for teams
                        text={team.name}
                        isSelected={pathname === `/team/${team.uid}`}
                        isExpanded={isOpen}
                    />
                ))} */}

                                       <SidebarButtonIcon
                        key={"Discover Teams"}
                        text={"Discover Teams"}
                        color="primary"
                        withShadow={true}
                        onClick={() => router.push("/new-project")}
                        Icon={() => (
                            <ExploreIcon fontSize = "medium"className=" text-white"></ExploreIcon>
                        )}
                        isExpanded={isOpen}
                    />
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
