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
import PropTypes from "prop-types";

const colorClasses = {
    primary: "bg-primary", // Tailwind class for primary background
    secondary: "bg-secondary", // Tailwind class for secondary background
    tertiary: "bg-tertiary", // Tailwind class for tertiary background
};

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
                        borderColor: "#30475E", // #30475E border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#30475E", // #30475E border on focus
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#30475E", // Label color
                    "&.Mui-focused": {
                        color: "#30475E", // #30475E label color on focus
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    color: "#30475E", // Input text color
                    "&::placeholder": {
                        color: "#30475E", // Placeholder color
                        opacity: 1,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "#30475E", // Eye visibility icon color
                },
            },
        },
    },
});

const PasswordInput = ({ isConfirm, color, password, setPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const backgroundColorClass = colorClasses[color] || colorClasses.primary;
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
            <FormControl
                sx={{ mb: 1,  }}
                fullWidth
                variant="outlined"
                className={"bg-aliceBlue text-primary rounded-md"}
            >
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
                        color: "#30475E",
                        WebkitTextSecurity: showPassword ? "none" : "disc",
                        "&:focusVisible": {
                            outline: "none",
                        },
                    }}
                />
                {error && (
                    <div className="sm:w-60 max-sm:w-80">
                    <FormHelperText error className="text-center">
                        Password must contain at least 8 characters including
                        uppercase letters, lowercase letters, and numbers.
                    </FormHelperText>
                    </div>
                )}
            </FormControl>
        </ThemeProvider>
    );
};
PasswordInput.propTypes = {
    isConfirm: PropTypes.bool,
    color: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
};
export default PasswordInput;
