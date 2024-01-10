import Link from "next/link";
const { useRouter } = require("next/navigation");
import ButtonIcon from "../button/buttonWithIcon";
import PlusIcon from "../../../public/assets/svg/sidebaricons/plusicon.svg";
import FolderIcon from '@mui/icons-material/Folder';
import SidebarItem from "./sidebarSubComponents/sidebarItem";
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import StarRateIcon from '@mui/icons-material/StarRate';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import CallIcon from '@mui/icons-material/Call';
// Define the sidebar navigation items
import { usePathname } from 'next/navigation'
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
    const pathname = usePathname();
    return (
        <aside className="w-72 bg-white text-black h-screen">
            <div className="flex flex-col">
                {/* Logo or title */}
                {console.log(router.pathname)}
                {console.log(router)
}
                <div className="flex items-center justify-center h-20 ">
                    <div className="flex items-center justify-center space-x-2">
                        <img className="w-12 mb-2" src="/assets/images/logo_whitebackground.png" alt="Collabrain Logo" />
                        <p className="text-xl font-poppins">Collabrain</p>
                    </div>
                </div>
                <hr className="border-t-1 mx-4 border-solid border-gray-400 opacity-30"></hr>
                {/* Navigation items */}
                <nav className="flex flex-col p-4">
                    <ButtonIcon
                        key={"New Project"}
                        text={"New Project"}
                        color="primary"
                        withShadow={true}
                        onClick={() => router.push("/new-project")}
                        Icon={() => <PlusIcon className="h-4 w-4 text-gray-500"></PlusIcon>}
                    />
                    {navigationItems1.map((item) => (
                        <SidebarItem
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            text={item.name}
                            isSelected={pathname === item.href}
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
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;