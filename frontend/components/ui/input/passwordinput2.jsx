import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';

const RedTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.error.main,
  },
}));

const PasswordInput = ({ placeholder, password, setPassword, isError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const validatePassword = (value) => {
    const hasNumber = /[0-9]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const isValid = value.length >= 8 && hasNumber && hasUppercase && hasLowercase;
    setError(!isValid);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const tooltipTitle = isError ? "Password and Confirm Password are not the same." :
    error ? "Password must contain at least 8 characters including uppercase letters, lowercase letters, and numbers." : '';

  // Determine border color dynamically based on error state
  const borderColor = isError ? 'border-red-500' : (error ? 'border-red-500' : password && !error ? 'border-green-500' : 'border-primary');

  return (
    <div className="mt-4 relative">
      <RedTooltip
        title={tooltipTitle}
        placement="top"
        arrow
      >
        <div className="relative flex items-center bg-gray-100">
          <input
            type={showPassword ? "text" : "password"}
            className={clsx(`bg-gray-100 rounded-sm pl-4 pr-10 py-2 w-full focus:outline-none transition-all duration-300 ease-in-out border-l-4`, borderColor, { 'shake': error })}
            placeholder={placeholder}
            value={password}
            onChange={handlePasswordChange}
            aria-describedby={error ? "password-error" : undefined}
          />
          <IconButton
            onClick={handleClickShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
      </RedTooltip>
      {error && (
        <span id="password-error" className="sr-only">
          Password must contain at least 8 characters including uppercase letters, lowercase letters, and numbers.
        </span>
      )}
    </div>
  );
};

export default PasswordInput;