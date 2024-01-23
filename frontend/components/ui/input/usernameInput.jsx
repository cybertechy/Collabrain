import React, { useState, useCallback } from 'react';
import { createTheme, ThemeProvider, TextField } from "@mui/material";
import PropTypes from "prop-types";
import debounce from 'lodash.debounce';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fb = require("../../../app/_firebase/firebase");
const colorClasses = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
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
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const backgroundColorClass = colorClasses[color] || colorClasses.primary;

  const checkUsernameAvailability = async (enteredUsername) => {
    if (!/^[a-zA-Z0-9_]{4,}$/.test(enteredUsername)) {
      toast.error("Username must be at least 4 characters and alphanumeric (including underscores)");
      setError(true);
      return;
    }
  

    setLoading(true);
    setError(false);
    // const token= await fb.getToken();
    // try {
    //   const response = await fetch(`http://localhost:8080/api/user/${enteredUsername}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`, // Add token to request headers
    //   },
    // });
    //   if (response.ok) {
    //    toast.error("Username is taken");
    //     setError(true);
    //   } else if (response.status === 404) {
    //     toast.success("Username is available");
    //   } else {
    //     throw new Error('Unable to check availability');
    //   }
    // } catch (error) {
    //   toast.error("Error checking availability");
    // } finally {
    //   setLoading(false);
    // }
  };

  const debouncedCheck = useCallback(debounce(checkUsernameAvailability, 300), []);

  const handleChange = (event) => {
    const enteredUsername = event.target.value;
    setUsername(enteredUsername);
    debouncedCheck(enteredUsername);
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
       // helperText={error ? "Username must be at least 4 characters and alphanumeric (including underscores)" : loading ? "Checking availability..." : availabilityMessage}
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
       {/* <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    /> */}
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
