"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const fb = require("_firebase/firebase");
import { hasUsername } from "../utils/user";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const UsernameSetting = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [user, loading] = fb.useAuthState();
  const [retrieve, setRetrieve] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [hasUserUsername, setHasUserUsername] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (user) {
    const checkUserUsername = async () => {
       
            const userHasUsername = await hasUsername();
            if (userHasUsername) {
                console.log("User has username", userHasUsername);
                router.push("/dashboard"); // Redirect to dashboard if user has username
            } else {
                console.log("User does not have a username");
                router.push("/username"); // Redirect to username page if user does not have username
               
            }
       
    };
    checkUserUsername();
}
else {
    router.push("/");
}

    
}, [user]);
  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = '/assets/images/background.jpg'; // Adjust the path to your background image
    img.onload = () => {
        setBackgroundLoaded(true);
        document.body.classList.add('custom-background');
    };

    // Remove the custom background class when the component unmounts
    return () =>
    {
        document.body.classList.remove('custom-background');
    };
}, []);
const checkUsernameAvailability = async (enteredUsername) => {
    if (!/^[a-zA-Z0-9_]{4,}$/.test(enteredUsername)) {
        setError("Username must be at least 4 characters and alphanumeric (including underscores)");
        setButtonDisabled(true); // Disable the button
        return;
    }

    setRetrieve(true);
    setError('');

    try {
        const response = await axios.get(`${SERVERLOCATION}/api/users/username/${enteredUsername}`);
        if (response.status === 200) {
            setError("Username is available");
            setUsername(enteredUsername);
            setButtonDisabled(false); // Enable the button
            console.log("Username is available");
        } else {
            setError("Username is taken");
            setButtonDisabled(true); // Disable the button
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            setError("Username is taken");
            setButtonDisabled(true); // Disable the button
        } else {
            setError("Error checking availability");
            setButtonDisabled(true); // Disable the button
        }
    } finally {
        setRetrieve(false);
    }
};

  const handleUsernameChange = (e) =>
  {
      const newUsername = e.target.value;
      setUsername(newUsername);

      if (timeoutId)
      {
          clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() =>
      {
          checkUsernameAvailability(newUsername);
      }, 1000); //delay before checking username availability

      setTimeoutId(newTimeoutId);
  };
  const handleSave = async () => {
    if (error !== "Username is available" || !username) {
        toast.error(error);
        return;
    }

    try {
        setButtonLoading(true); // Set loading state to true when request is initiated

        let token = null;
        if (user) {
            token = await fb.getToken();
        }
        const response = await axios.patch(`${SERVERLOCATION}/api/users/`, { username: username }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log(response.data);
            setHasUserUsername(true); // Update this state to indicate the user now has a username
            router.push("/dashboard"); // Redirect to dashboard if username is updated successfully
        } else {
            console.log("failed to update username")
            setError("Failed to update username");
        }
    } catch (error) {
        console.error("Error updating username:", error);
        setError("Error updating username");
    } finally {
        setButtonLoading(false); // Set loading state to false when request is complete
    }
};


 

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-basicallylight bg-opacity-20 backdrop-blur-sm">
      <div className="w-1/4 bg-basicallylight rounded-md shadow-lg">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-basicallydark">Welcome! Let's Pick a Username</h2>
          <p className="mb-4 text-gray-600">Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!</p>
          <input
            type="text"
            className={`w-full text-basicallydark p-2 border ${error && error !== "Username is available" ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <p className={`text-sm mt-1 ${error === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
            {retrieve ? "Checking availability..." : error}
          </p>
          <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-primary text-basicallylight rounded hover:bg-teritary"
              onClick={fb.signOut}
            >
              Sign out
            </button>
            <button
    className={`px-4 py-2  text-basicallylight rounded hover:bg-teritary ${buttonDisabled || buttonLoading ? 'bg-gray-300' : 'bg-primary'}`}
    onClick={handleSave}
    disabled={buttonDisabled || buttonLoading}
>
    
    {buttonLoading ? (
        
       <div
       class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
       role="status">
       <span
         class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
         ></span>
     </div>
    ) : (
        "Let's Go!"
    )}
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetting;
