import React, { useState } from "react";
import {
    createTheme,
    ThemeProvider,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
    components: {
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
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "white", // Label color
                    "&.Mui-focused": {
                        color: "white", // White label color on focus
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    color: "white", // Input text color
                    "&::placeholder": {
                        color: "white", // Placeholder color
                        opacity: 1,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "white", // Eye visibility icon color
                },
            },
        },
    },
});

const PasswordInput = ({ isConfirm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const validatePassword = (value) => {
        const hasNumber = /[0-9]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const isValid =
            value.length >= 8 && hasNumber && hasUppercase && hasLowercase;
        setError(!isValid);
        return isValid;
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <FormControl sx={{ m: 1, width: "37ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                    {isConfirm ? "Confirm Password" : "Password"}
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    error={error}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={isConfirm ? "Confirm Password" : "Password"}
                    sx={{
                        color: "white",
                        backgroundColor: "#972FFF",
                        WebkitTextSecurity: showPassword ? "none" : "disc",
                        "&:focusVisible": {
                            outline: "none",
                        },
                    }}
                />
                {error && (
                    <FormHelperText error>
                        Password must contain at least 8 characters including
                        uppercase letters, lowercase letters, and numbers.
                    </FormHelperText>
                )}
            </FormControl>
        </ThemeProvider>
    );
};

export default PasswordInput;
