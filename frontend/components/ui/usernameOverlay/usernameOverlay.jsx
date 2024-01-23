import React, { useState } from 'react';
const fb = require("../../../app/_firebase/firebase");
const UsernameOverlay = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const checkUsernameAvailability = async (enteredUsername) => {
    if (!/^[a-zA-Z0-9_]{4,}$/.test(enteredUsername)) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    // Perform any necessary logic for checking username availability here.
    // You can use an API call or any other method to check availability.

    // Example:
    // const isUsernameAvailable = await checkUsernameAvailabilityAPI(enteredUsername);

    // if (isUsernameAvailable) {
    //   setError(false);
    // } else {
    //   setError(true);
    // }

    setLoading(false);
  };

  const handleSave = () => {
    if (error || !username) {
      // Handle validation error, e.g., display a message to the user.
      return;
    }

    // Perform any necessary logic for saving the username here.
    // Once the username is successfully saved, call onClose to close the overlay.
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? 'block' : 'hidden'} z-50 bg-white bg-opacity-20 backdrop-blur-sm`}>
      <div className="w-1/4 bg-white rounded-md shadow-lg">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-black">Welcome! Let's Pick a Username</h2>
          <p className="mb-4 text-gray-600">Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!</p>
          <input
            type="text"
            className={`w-full text-black p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1">Username must be at least 4 characters and alphanumeric (including underscores)</p>}
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
              onClick={handleSave}
            >
              Let's Go!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UsernameOverlay;

