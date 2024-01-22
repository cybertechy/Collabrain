import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    teritary: "bg-teritary",
};

const ButtonIcon = ({ text, color, withShadow = false, Icon, onClick }) => (
    <button
        className={`${
            colorClasses[color]
        } px-4 py-4 rounded-custom font-poppins text-md my-4 text-white font-medium flex items-center justify-center${
            withShadow ? "shadow-primary shadow-custom" : ""
        }`}
        onClick={onClick}
    >
        <span className="flex-grow text-center">{text}</span>
        {Icon && <Icon className="flex-shrink-0 ml-2" />}{" "}
        {/* Add margin-left to icon */}
    </button>
);

ButtonIcon.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    withShadow: PropTypes.bool,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
};

export default ButtonIcon;
