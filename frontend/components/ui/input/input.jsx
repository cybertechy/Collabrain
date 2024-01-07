import { createTheme, ThemeProvider, TextField } from "@mui/material";

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

const InputField = ({ placeholder }) => {
    return (
        <ThemeProvider theme={theme}>
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                    style: {
                        color: "white",
                        backgroundColor: "#972FFF",
                        padding: "10px 14px", // Adjust padding to maintain size
                        "&:focus-visible": {
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

export default InputField;
