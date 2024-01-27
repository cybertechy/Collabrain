import { useState } from 'react';
import AddChannelButton from './addChannelButton';
import ChannelCategories from './channelCategories';
import ProfileBox from './profileBox';
import TeamChannelOptionsMenu from './teamChannelOptionsMenu';

const ChannelBar = ({ user, channelsData }) => {
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
    <div className="flex flex-col h-full w-1/6 relative bg-neutral-50 shadow-2xl">
      <div className="flex flex-col">
        <TeamChannelOptionsMenu teamName = {"Team Alpha"} onOptionSelect={handleTeamOptionSelect} />
      </div>
      <div className="flex-grow">
      {channelsData.map((category, index) => (
          <ChannelCategories
            key={index}
            categoryName={category.name}
            channels={category.channels}
            onChannelSelect={handleChannelSelect}
          />
        ))}
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
