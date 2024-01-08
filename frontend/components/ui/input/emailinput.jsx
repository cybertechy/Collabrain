import { createTheme, ThemeProvider, TextField } from "@mui/material";
import { useState } from "react";

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
                        borderColor: (props) => (props.error ? "red" : "white"), // Red border on focus when there's an error
                    },
                    "&.Mui-focused:not(:hover) .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: "white", // White border on focus without hover
                        },
                },
            },
        },
    },
});

const EmailInputField = ({ placeholder }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (event) => {
        const enteredEmail = event.target.value;
        setEmail(enteredEmail);
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simplified email regex pattern
        setError(!re.test(enteredEmail));
    };

    return (
        <ThemeProvider theme={theme}>
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                type="email"
                value={email}
                onChange={handleChange}
                error={error}
                helperText={error && "Invalid email address"}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                    style: {
                        color: "white",
                        backgroundColor: "#972FFF",
                        padding: "10px 14px", // Adjust padding to maintain size
                        "&:focusVisible": {
                            outline: "none",
                        },
                    },
                }}
                placeholder={placeholder}
                sx={{ m: 1, width: "37ch" }}
            />
        </ThemeProvider>
    );
};

export default EmailInputField;
