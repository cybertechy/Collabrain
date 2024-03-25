import React, { useState } from 'react';
const fb = require("_firebase/firebase");
import axios from 'axios';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const AddChannelOverlay = ({ isOpen, onClose, onChannelAdded, teamData }) => {
    const [channelName, setChannelName] = useState('');
    const { t } = useTranslation('create_channel');
    const { speak, stop, isTTSEnabled } = useTTS();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = await fb.getToken(); // Get the auth token
      
        axios.post(`${SERVERLOCATION}/api/teams/${teamData.teamId}/channels`, {
          name: channelName,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log('Channel created successfully', response.data);
          onChannelAdded(channelName); // Notify the parent component
          onClose(); // Close the overlay
        })
        .catch(error => {
          console.error('Error creating channel', error.response || error);
          // Optionally, display an error message to the user
        });
      };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <form className="bg-white p-5  shadow-lg flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="channelName" className="block text-xl font-bold text-basicallydark" 
          onMouseEnter={() => isTTSEnabled && speak("Channel Name")} onMouseLeave={stop}>{t('name')}</label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="bg-primary ml-1 px-2 h-10 text-basicallylight placeholder:text-basicallylight focus:ring-secondary focus:border-secondary block w-full shadow-sm sm:text-sm border-gray-300 "
            required
            placeholder={t('enter_name')}
            onMouseEnter={() => isTTSEnabled && speak("Enter channel name here")} onMouseLeave={stop}
          />
          <div className="flex space-x-4">
            <button type="submit" className="bg-primary hover:bg-tertiary  text-basicallylight font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onMouseEnter={() => isTTSEnabled && speak("Create button")} onMouseLeave={stop}>
              {t('create')}
            </button>
            <button type="button" onClick={onClose} className="bg-primary hover:bg-tertiary text-basicallylight font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onMouseEnter={() => isTTSEnabled && speak("Cancel button")} onMouseLeave={stop}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    );
  };

  export default AddChannelOverlay;