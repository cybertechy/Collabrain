import { createTheme, ThemeProvider, TextField } from "@mui/material";
import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary", // Replace with your primary color
    secondary: "bg-secondary", // Replace with your secondary color
    tertiary: "bg-tertiary", // Replace with your tertiary color
};
const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    "&::placeholder": {
                        color: "white", // Change placeholder color here
                        opacity: 1, // Ensure full opacity
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent", // Remove default outline
                        borderWidth: "1px", // Ensure hover/focus border is visible
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // White border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // White border on focus
                    },
                },
            },
        },
    },
});

const InputField = ({ placeholder, color, input, setinput }) => {
    const backgroundColorClass = colorClasses[color] || colorClasses.primary;

    return (
        <ThemeProvider theme={theme}>
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={input}
                onChange={(e) => setinput(e.target.value)}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                    className: backgroundColorClass,
                    style: {
                        color: "white",
                        padding: "10px",
                        "&:focusVisible": {
                            outline: "none",
                        },
                    },
                }}
                placeholder={placeholder}
                sx={{ mb: 1, width: "20rem" }}
            />
        </ThemeProvider>
    );
};

InputField.propTypes = {
    placeholder: PropTypes.string.isRequired,
    color: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
    input: PropTypes.string.isRequired,
    setinput: PropTypes.func.isRequired,
};

export default InputField;
