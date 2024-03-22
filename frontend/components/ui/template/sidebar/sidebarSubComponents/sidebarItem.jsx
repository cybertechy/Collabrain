import Link from "next/link";
import PropTypes from "prop-types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";
import { Tooltip } from '@mui/material';

const SidebarItem = ({ href, icon: Icon, text = "", isSelected = false, isExpanded = true,  toggleSidebar  }) => {
    const itemClasses = isSelected ? "text-primary" : "text-unselected hover:text-primary";
    const [showChevron, setShowChevron] = useState(false);
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };
        
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => {
                setShowChevron(true);
            }, 445); // Adjust this duration to match your animation time
            return () => clearTimeout(timer);
        } else {
            setShowChevron(false);
        }
    }, [isExpanded]);

    // const widthClass = isExpanded ? "w-full lg:w-64" : "w-64";

    return (
        <Tooltip
            title={text}
            enterDelay={1000}
            leaveDelay={200}
        >
            <Link href={href}
            // >
                // <div
                onClick={toggleSidebar}
                    className={`flex items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer ${isExpanded ? "hover:bg-gray-200" : ""} ${itemClasses} hover:text-primary`}
                    style={{ 
                        maxWidth: isExpanded ? "100%" : "0",
                    }}
                >
                    {Icon && (
                        <Icon fontSize="large" className={`mr-2 transition-all duration-500 ease-in-out`} />
                    )}
                    <span
                        className={`mx-4 transition-all duration-500 ease-in-out text-md font-normal`}
                        style={{
                            maxWidth: isExpanded ? "100%" : "0",
                            fontSize: isExpanded ? "1rem" : "0",
                            opacity: isExpanded ? 1 : 0,
                        }}
                    >
                        {isExpanded ? text : ""}
                    </span>
                    {showChevron && (
                        <ChevronRightIcon
                            fontSize="large"
                            className={`ml-auto transition-all duration-500 ease-in-out`}
                        />
                    )}
                {/* </div> */}
            </Link>
        </Tooltip>
    );
};

SidebarItem.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
    toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarItem;
