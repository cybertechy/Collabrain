"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../utils/i18n"
import { useTranslation } from 'next-i18next';
import { useTTS } from "../utils/tts/TTSContext";
const fb = require("_firebase/firebase");
import { hasUsername } from "../utils/user";
const UsernameSetting = () => {
  const { t } = useTranslation('username');
  const { speak, stop, isTTSEnabled } = useTTS();
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
        setError(t('usr_type_err'));
        setButtonDisabled(true); // Disable the button
        return;
    }

    setRetrieve(true);
    setError('');

    try {
        const response = await axios.get(`http://localhost:8080/api/users/username/${enteredUsername}`);
        if (response.status === 200) {
            setError(t('usr_available'));
            setUsername(enteredUsername);
            setButtonDisabled(false); // Enable the button
            console.log("Username is available");
        } else {
            setError(t('usr_taken'));
            setButtonDisabled(true); // Disable the button
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            setError(t('usr_taken'));
            setButtonDisabled(true); // Disable the button
        } else {
            setError(t('usr_err'));
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
    if (error !== t('usr_available') || !username) {
        toast.error(error);
        return;
    }

    try {
        setButtonLoading(true); // Set loading state to true when request is initiated

        let token = null;
        if (user) {
            token = await fb.getToken();
        }
        const response = await axios.patch('http://localhost:8080/api/users/', { username: username }, {
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
            setError(t('upd_fail'));
        }
    } catch (error) {
        console.error("Error updating username:", error);
        setError(t('upd_error'));
    } finally {
        setButtonLoading(false); // Set loading state to false when request is complete
    }
};


 

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-basicallylight bg-opacity-20 backdrop-blur-sm">
      <div className="w-1/4 bg-basicallylight rounded-md shadow-lg">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-basicallydark">{t('usr_top')}</h2>
          <p className="mb-4 text-gray-600">{t('usr_msg')}</p>
          <input
            type="text"
            className={`w-full text-basicallydark p-2 border ${error && error !== t('usr_available') ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
            placeholder={t('usr_type')}
            value={username}
            onChange={handleUsernameChange}
          />
          <p className={`text-sm mt-1 ${error === t('usr_available') ? 'text-green-500' : 'text-red-500'}`}>
            {retrieve ? t('checking') : error}
          </p>
          <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-primary text-basicallylight rounded hover:bg-teritary"
              onClick={fb.signOut}
            >
              {t('sign_out_btn')}
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
        t('lets_go_btn')
    )}
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetting;
