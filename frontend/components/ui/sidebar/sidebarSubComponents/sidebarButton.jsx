import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary", // Corrected spelling from 'teritary' to 'tertiary'
};

const SidebarButtonIcon = ({
    text,
    color,
    withShadow = false,
    Icon,
    onClick,
    isExpanded,
}) => (
    <button
        className={`${
            colorClasses[color]
        } px-4 py-4 h-13  rounded-custom font-poppins text-md my-4 text-white font-medium flex items-center justify-center transition-all duration-500 ease-in-out ${
            withShadow ? "shadow-primary shadow-custom" : ""
        }`}
        onClick={onClick}
    >
        <span
            className="flex-grow text-center overflow-hidden"
            style={{
                maxWidth: isExpanded ? "100%" : "0",
                fontSize: isExpanded ? "1rem" : "0",
                transition:
                    "max-width 0.5s ease-in-out, opacity 0.5s ease-in-out 0.5s", // Added opacity transition
                opacity: isExpanded ? 1 : 0, // Control opacity based on isExpanded
            }}
        >
            {isExpanded ? text : ""}
        </span>
        {Icon && (
            <Icon className="py-4 ml-2 transition-all duration-445 ease-in-out " />
        
        )}
    </button>
);

SidebarButtonIcon.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    withShadow: PropTypes.bool,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
    isExpanded: PropTypes.bool,
};

export default SidebarButtonIcon;
