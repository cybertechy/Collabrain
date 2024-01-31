import { createTheme, ThemeProvider, TextField } from "@mui/material";
import { useState } from "react";
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
                        color: "#30475E", // Change placeholder color here
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
                        borderColor: "#30475E", // #FFFFFF border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: (props) => (props.error ? "red" : "#30475E"), // Red border on focus when there's an error
                    },
                    "&.Mui-focused:not(:hover) .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: "#30475E", // #FFFFFF border on focus without hover
                        },
                },
            },
        },
    },
});

const EmailInputField = ({ placeholder, color, email, setEmail }) => {
    const [error, setError] = useState(false);
    const backgroundColorClass = colorClasses[color] || colorClasses.primary;


    const handleChange = (event) => {
        const enteredEmail = event.target.value;
        setEmail(enteredEmail);
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simplified email regex pattern
        setError(!re.test(enteredEmail));
    };

    return (
        <ThemeProvider theme={theme}>
            <TextField
                className={"bg-aliceBlue text-primary rounded-md"}
                variant="outlined"
                size="small"
                fullWidth
                type="email"
                value={email}
                onChange={handleChange}
                error={error}
                helperText={error && "Invalid email address"}
                InputLabelProps={{ style: { color: "#30475E" } }}
                InputProps={{
                    style: {
                        color: "#30475E",
                        padding: "10px 14px",
                        "&:focusVisible": {
                            outline: "none",
                        },
                    },
                }}
                placeholder={placeholder}
                sx={{ m: 1}}
            />
        </ThemeProvider>
    );
};

EmailInputField.propTypes = {
    placeholder: PropTypes.string.isRequired,
    color: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
};

export default EmailInputField;
