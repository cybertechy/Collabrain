import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    teritary: "bg-teritary",
};

const Button = ({ text, color, withShadow = false, Icon, onClick }) => (
    <button
        className={`${
            colorClasses[color]
        } px-24 py-4 rounded-sm font-poppins text-md my-4 font-medium${
            withShadow ? "shadow-primary drop-shadow-md" : ""
        }`}
        onClick={onClick}
    >
        {text} {Icon && <Icon />}
    </button>
);

Button.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    withShadow: PropTypes.bool,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
};

export default Button;
