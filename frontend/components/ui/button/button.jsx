import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    teritary: "bg-teritary",
};

const Button = ({ text, color, withShadow = false, onClick }) => (
    <button
        className={`bg-secondary px-24 py-4 rounded-sm font-poppins text-md my-4 text-primary font-medium ${
            withShadow ? "shadow-primary drop-shadow-md" : ""
        }`}
        onClick={onClick}
    >
        {text}
    </button>
);

Button.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    withShadow: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
