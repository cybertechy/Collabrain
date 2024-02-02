import { useState } from 'react';
import AddChannelButton from './addChannelButton';
import ChannelButton from './channelButton';
import ProfileBox from './profileBox';
import TeamChannelOptionsMenu from './teamChannelOptionsMenu';
import { useRouter } from 'next/navigation';
const ChannelBar = ({ user,  teamData,  userUID }) => {
  // State and handlers for channel categories
  console.log(user);

  const handleChannelSelect = (channelName) => {
    // Handle channel selection here
    console.log('Channel selected:', channelName);
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
    // Handle add channel action here
    console.log('Add channel clicked');
  };

  const handleTeamOptionSelect = (option) => {
    // Handle team option selection here
    console.log('Team option selected:', option);
  };

  return (
    <div className="flex flex-col h-full w-1/6  bg-neutral-50 shadow-2xl">
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
    </div>
  );
};

export default ChannelBar;
