import { createTheme, ThemeProvider, TextField } from "@mui/material";
import { useState, useEffect } from "react";
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
            borderColor: (props) => (props.error ? "red" : "white"), // Red border on focus when there's an error
          },
          "&.Mui-focused:not(:hover) .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // White border on focus without hover
          },
        },
      },
    },
  },
});

const UsernameInputField = ({ placeholder, color, username, setUsername }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(""); // New state for availability message
  const backgroundColorClass = colorClasses[color] || colorClasses.primary;

  const handleChange = async (event) => {
    const enteredUsername = event.target.value;
    setUsername(enteredUsername);

    // Check if the username meets the criteria (at least 4 characters, alphanumeric, and underscores allowed)
    const isValid = /^[a-zA-Z0-9_]{4,}$/.test(enteredUsername);
    setError(!isValid);

    if (isValid) {
      // Username is valid, check if it's already taken
      setLoading(true);

      //replace with new user endpoint
      // try {
      //   const response = await fetch(`/${enteredUsername}`);
      //   if (response.ok) {
      //     // Username is taken
      //     setAvailabilityMessage("Username is taken");
      //     setError(true);
      //   } else if (response.status === 404) {
      //     // Username is available
      //     setAvailabilityMessage("Username is available");
      //     setError(false);
      //   } else {
      //     setError(true); 
      //     setAvailabilityMessage("Error checking availability");
      //   }
      // } catch (error) {
      //   console.error("Error checking username availability:", error);
      //   setError(true);
      //   setAvailabilityMessage("Error checking availability");
      // } finally {
      //   setLoading(false);
      // }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TextField
        className={backgroundColorClass}
        variant="outlined"
        size="small"
        fullWidth
        value={username}
        onChange={handleChange}
        error={error}
        helperText={error ? "Username must be at least 4 characters and alphanumeric (including underscores)" : loading ? "Checking availability..." : availabilityMessage}
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{
          style: {
            color: "white",
            padding: "10px 14px",
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

UsernameInputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};

export default UsernameInputField;
