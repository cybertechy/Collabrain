import { useState, useEffect } from 'react';
const fb = require("_firebase/firebase");
import AddChannelButton from './addChannelButton';
import ChannelButton from './channelButton';
import ProfileBox from './profileBox';
import TeamChannelOptionsMenu from './teamChannelOptionsMenu';
import AddChannelOverlay from '../overlays/addChannelOverlay'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const ChannelBar = ({ user,  teamData,  userUID , onUpdated}) => {
  // State and handlers for channel categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddChannelOverlayOpen, setIsAddChannelOverlayOpen] = useState(false);
  const router  = useRouter();
  console.log(user);

  const handleChannelSelect = (channelName) => {
    router.push(`/chat?teamId=${teamData.teamId}&channelName=${channelName}`);
   
  };

  // Handlers for profile box actions
  const handleMute = () => {
    console.log('Mute toggled');
  };

  const handleDeafen = () => {
    console.log('Deafen toggled');
  };

  const handleSettings = () => {
    console.log('Settings opened');
  };



  const handleAddChannel = () => {
    setIsAddChannelOverlayOpen(true); // Open the add channel overlay
  };

  const handleChannelAdded = (channelName) => {
    console.log(`${channelName} channel added`);
    // Here, you would likely want to refresh the list of channels or perform another action
    setIsAddChannelOverlayOpen(false);
    onUpdated();
  };

  const handleTeamOptionSelect = (option) => {
   if (option === 'invite') {
      onInvite();
    }
   else if (option === 'settings') {
      onSettings();
    }
   else if (option === 'leave') {
      onLeave();
    }
  else  if (option === 'delete') {
      onDelete();
    }

  };
  const onDelete = () => {
    setIsModalOpen(true); // Open the modal for confirmation
  };
  const onDeleteConfirm = async () => {
    // Assuming you have a function to get the current user's auth token
    setIsModalOpen(false);
    const token = await fb.getToken(); // This is a placeholder, adjust based on your auth logic

    // The team ID to delete
    const teamId = teamData.teamId;

    axios.delete(`${SERVERLOCATION}/api/teams/${teamId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        // Handle success response
        console.log('Team deleted successfully', response.data);
        // Potentially redirect the user or update the UI to reflect the deletion
        // For example, you might want to navigate back to the dashboard
        router.push('/dashboard'); // Adjust the URL as needed
    })
    .catch(error => {
        // Handle error response
        console.error('Error deleting team', error.response || error);
        // Optionally, display an error message to the user
    });
};

  const onLeave = ()=>{
      
    }
    const onSettings = ()=>{

    } 
    const onInvite = ()=>{

    }


  
  return (
    // <div className="flex flex-col h-full w-1/6  bg-neutral-50 shadow-2xl">
    <div className="flex flex-col h-full w-2/6 sm:w-2/6 md:1/5 max-sm:w-2/5 bg-neutral-50 shadow-2xl">
      <div className="flex flex-col">
        <TeamChannelOptionsMenu teamName = {teamData.name} onOptionSelect={handleTeamOptionSelect} isOwner = {teamData.owner === userUID} />
      </div>
      <div className="flex-grow">


          <ChannelButton
            
            channels={teamData.channels}
            onChannelSelect={handleChannelSelect}
          />
        
        <AddChannelButton onAddChannel={handleAddChannel} />
      </div>
      <div className="flex">
        <ProfileBox
          userData={user.data}
          onMute={handleMute}
          onDeafen={handleDeafen}
          onSettings={handleSettings}
        />
      </div>
      <SimpleModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={onDeleteConfirm}
/>
<AddChannelOverlay
        isOpen={isAddChannelOverlayOpen}
        onClose={() => setIsAddChannelOverlayOpen(false)}
        onChannelAdded={handleChannelAdded}
        teamData={teamData}
      />
    </div>
  );
};

const SimpleModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation('team');
  const { speak, stop, isTTSEnabled } = useTTS();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        <p className="mb-4" onMouseEnter={() => isTTSEnabled && speak("Are you sure you want to delete this team?")} 
            onMouseLeave={stop}>{t('del_msg')}</p>
        <div className="flex space-x-4">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onMouseEnter={() => isTTSEnabled && speak("Yes button")} 
          onMouseLeave={stop}>{t('yes')} </button>
          <button onClick={onClose} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onMouseEnter={() => isTTSEnabled && speak("No button")} 
          onMouseLeave={stop}>{t('no')}</button>
        </div>
      </div>
    </div>
  );
};


export default ChannelBar;
