import React, { useState } from 'react';
const fb = require("../../../app/_firebase/firebase");
import axios from 'axios';
import { toast } from 'react-toastify';
        import 'react-toastify/dist/ReactToastify.css';
    const UsernameOverlay = ({ isOpen, onClose }) => {
        const [username, setUsername] = useState('');
        const [error, setError] = useState('');
        const [user, loading] = fb.useAuthState();
        const [retrieve, setRetrieve] = useState(false);
    


        const checkUsernameAvailability = async (enteredUsername) => {
        if (!/^[a-zA-Z0-9_]{4,}$/.test(enteredUsername)) {
            setError("Username must be at least 4 characters and alphanumeric (including underscores)");
            return;
        }
    
        setRetrieve(true);
        setError('');
    
        try {
            const response = await axios.get(`http://localhost:8080/users/username/${enteredUsername}`);
            if (response.status === 200) {
            setError("Username is available");
            console.log("Username is available")
            } else {
            setError("Username is taken");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
            setError("Username is taken");
            } else {
            setError("Error checking availability");
            }
        } finally {
            setRetrieve(false);
        }
        };

        const handleSave = async () => {
            if (error !== "Username is available" || !username) {
                toast.error(error);
              return;
            }
        
            try {
             
              const response = await axios.patch('http://localhost:8080/api/users', { username }, {
                headers: {
                  Authorization: `Bearer ${await fb.getToken}`
                }
              });
        
              if (response.status === 200) {
                onClose();
              } else {
                setError("Failed to update username");
              }
            } catch (error) {
              setError("Error updating username");
            }
          };
  
    return (
      <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? 'block' : 'hidden'} z-50 bg-white bg-opacity-20 backdrop-blur-sm`}>
        <div className="w-1/4 bg-white rounded-md shadow-lg">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Welcome! Let's Pick a Username</h2>
            <p className="mb-4 text-gray-600">Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!</p>
            <input
              type="text"
              className={`w-full text-black p-2 border ${error && error !== "Username is available" ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsernameAvailability(e.target.value);
              }}
            />
            <p className={`text-sm mt-1 ${error === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
              {retrieve ? "Checking availability..." : error}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                onClick={handleSave}
                disabled={retrieve || error !== "Username is available"}
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

