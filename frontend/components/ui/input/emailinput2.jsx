// components/EmailInput.js
import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import "../../../i18n"
import { useTranslation } from 'react-i18next';

// Create a custom styled tooltip with a red background
const RedTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: theme.palette.error.main,
      color: 'white',
    },
    [`& .MuiTooltip-arrow`]: {
      color: theme.palette.error.main, // This will style the bottom arrow
    },
  }));

const EmailInput = ({ placeholder, email, setEmail }) => {
  const { t } = useTranslation('login_signup');
  const [error, setError] = useState(false);

  useEffect(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(email ? !re.test(email) : false);
  }, [email]);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const borderColor = error ? 'border-red-500' : email && !error ? 'border-green-500' : 'border-primary';

  return (
    <div className="mt-4 ">
      <RedTooltip
        title={error ? t('email_invalid') : ''}
        placement="top"
        arrow
      >
         <div className="relative flex items-center bg-gray-100">
        <input
          type="text"
          className={clsx(`bg-gray-100 rounded-sm pl-4 pr-10 py-2 w-full focus:outline-none transition-all duration-300 ease-in-out border-l-4`, borderColor, { 'shake': error })}
          placeholder={placeholder}
          value={email}
          onChange={handleChange}
          aria-describedby={error ? "email-error" : undefined}
        />
        <div className='w-10 h-10'></div>
        </div>
      </RedTooltip>
      {error && (
        <span id="email-error" className="sr-only">
          Invalid email address.
        </span>
      )}
    </div>
  );
};

export default EmailInput;
