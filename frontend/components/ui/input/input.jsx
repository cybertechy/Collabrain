import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

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

const InputField = ({ placeholder, input, setInput }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    // Your validation logic here
    // For example, you can check if input meets certain criteria
    setError(/* Your validation logic */);
  }, [input]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  // Determine border color dynamically based on error state
  const borderColor = error ? 'border-red-500' : input ? 'border-green-500' : 'border-primary';

  return (
    <div className="mt-4 relative">
      <RedTooltip
        title={error ? "Your error message here" : ''}
        placement="top"
        arrow
      >
          <div className="relative flex items-center bg-gray-100">
        <input
          type="text"
          className={clsx(`bg-gray-100 rounded-sm pl-4 pr-10 py-2 w-full focus:outline-none transition-all duration-300 ease-in-out border-l-4`, borderColor, {'shake': error})}
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          aria-describedby={error ? "input-error" : undefined}
        />
         <div className='w-10 h-10'></div>
        </div>
      </RedTooltip>
      {/* Visually hidden error message for screen readers */}
      {error && (
        <span id="input-error" className="sr-only">
          Your error message here.
        </span>
      )}
    </div>
  );
};

export default InputField;
