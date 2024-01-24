import Link from "next/link";
import PropTypes from "prop-types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";

const SidebarItem = ({ href, icon: Icon, text, isSelected= false, isExpanded =true }) => {
    const itemClasses = isSelected ? "text-primary" : "text-unselected hover:text-primary";
    const [showChevron, setShowChevron] = useState(false);

    useEffect(() => {
        // If the sidebar is expanding, wait for the animation to finish
        if (isExpanded) {
            const timer = setTimeout(() => {
                setShowChevron(true);
            }, 445); // Adjust this duration to match your animation time

            return () => clearTimeout(timer);
        } else {
            // If the sidebar is collapsing, hide the chevron immediately
            setShowChevron(false);
        }
    }, [isExpanded]);

    return (
        <Link href={href}>
            <div
                className={`
                flex w-64 items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer ${isExpanded && "hover:bg-gray-200"}  ${itemClasses}`}
                // flex w-64 items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer ${isExpanded &&"hover:bg-gray-200"} ${isSelected ? "text-primary" : "text-unselected"} hover:text-primary`}
                style={{ 
                    maxWidth: isExpanded ? "100%" : "0",
                }}
            >
                {Icon && (
                    <Icon fontSize="large" className={`mr-2 transition-all duration-500 ease-in-out`} />
                )}
                <span
                    className={`mx-4 transition-all duration-10 ease-in-out text-md font-normal`}
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
                        className={`ml-auto`}
                    />
                )}
            </div>
        </Link>
    );
};

SidebarItem.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
};



export default SidebarItem;
