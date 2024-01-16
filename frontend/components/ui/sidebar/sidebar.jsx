import Link from "next/link";
const { useRouter } = require("next/navigation");
import SidebarButtonIcon from "./sidebarSubComponents/sidebarButton";
import PlusIcon from "../../../public/assets/svg/sidebaricons/plusicon.svg";
import FolderIcon from "@mui/icons-material/Folder";
import SidebarItem from "./sidebarSubComponents/sidebarItem";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import StarRateIcon from "@mui/icons-material/StarRate";
import GroupsIcon from "@mui/icons-material/Groups";
import ForumIcon from "@mui/icons-material/Forum";
import CallIcon from "@mui/icons-material/Call";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
// Define the sidebar navigation items
import { usePathname } from "next/navigation";
const navigationItems1 = [
    { name: "My Brain", href: "/dashboard", icon: FolderIcon },
    { name: "Shared With Me", href: "/shared-with-me", icon: PeopleIcon },
    { name: "Recent", href: "/recent", icon: HistoryIcon },
    { name: "Starred", href: "/starred", icon: StarRateIcon },
];

const navigationItems2 = [
    { name: "Teams", href: "/teams", icon: GroupsIcon },
    { name: "Messages", href: "/messages", icon: ForumIcon },
    { name: "Calls", href: "/calls", icon: CallIcon },
];

const Sidebar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const pathname = usePathname(); // corrected from 'usePathname()'
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
                            <PlusIcon className="h-4 w-4 text-gray-500"></PlusIcon>
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
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
