import Link from "next/link";
const { useRouter } = require("next/navigation");
import ButtonIcon from "../button/buttonWithIcon";
import PlusIcon from "../../../public/assets/svg/sidebaricons/plusicon.svg";
// Define the sidebar navigation items
const navigationItems = [
    { name: "New Project", href: "/new-project", icon: "plus", button: true },
    { name: "My Brain", href: "/my-brain", icon: "brain" },
    { name: "Shared With Me", href: "/shared-with-me", icon: "users" },
    // ...other navigation items
];
const Sidebar = () => {
    const router = useRouter(); // Corrected to useRouter

    return (
        <aside className="w-64 bg-white text-black h-screen">
            <div className="flex flex-col">
                {/* Logo or title */}
                <div className="flex items-center justify-center h-20 ">
            {/* Use a div instead of span to be able to apply flex */}
            <div className="flex items-center justify-center space-x-2"> 
                <img
                    className="w-12 mb-2"
                    src="/assets/images/logo_whitebackground.png" // Make sure the path is correct
                    alt="Collabrain Logo" // Always include an alt for accessibility
                />
                <p className="text-xl font-poppins">Collabrain</p>
            </div>
            
        </div>
        <hr className="border-t-1 mx-4 border-solid border-gray-400 opacity-30"></hr>
                {/* Navigation items */}
                <nav className="flex flex-col p-4">
                    {navigationItems.map((item) =>
                        item.button ? (
                            <ButtonIcon
                                key={item.name}
                                text={item.name}
                                color="primary"
                                withShadow = {true}
                                onClick={() => router.push(item.href)}
                                Icon={() => (
                                    <PlusIcon className="h-4 w-4 text-gray-500"></PlusIcon>
                                )} // Replace with actual icon component
                            />
                        ) : (
                            <Link href={item.href} key={item.name} passHref>
                                <span
                                    className={`flex items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer ${
                                        router.pathname === item.href
                                            ? "bg-black"
                                            : "bg-unselected"
                                    }`}
                                >
                                    <span
                                        className={`bi bi-${item.icon} text-lg`}
                                    ></span>{" "}
                                    {/* Replace with actual icon component */}
                                    <span className="mx-4 text-sm font-normal">
                                        {item.name}
                                    </span>
                                </span>
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
