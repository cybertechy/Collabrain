import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FolderIcon from '@mui/icons-material/Folder';
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';

const ChannelBar = () => {
  return (
    <div className="bg-tertiary h-screen p-3 text-white w-60"> {/* Adjust width as needed */}
      {/* Title and dropdown icon */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Hyke Hackathon</h2>
        <ExpandMoreIcon />
      </div>

      {/* Channel Categories and Items */}
      <div>
        <div className="mb-3">
          <p className="text-sm font-semibold uppercase">Information</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <ChatBubbleOutlineIcon className="mr-2" /> <span>welcome-and-rules</span>
            </div>
            <div className="flex items-center">
              <AnnouncementIcon className="mr-2" /> <span>announcements</span>
            </div>
            <div className="flex items-center">
              <FolderIcon className="mr-2" /> <span>resources</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold uppercase">Text Channels</p>
          <div className="space-y-2">
            {/* Repeat for each channel */}
            <div className="flex items-center">
              <ChatBubbleOutlineIcon className="mr-2" /> <span>general</span>
            </div>
            {/* ... other channels */}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold uppercase">Voice Channels</p>
          <div className="space-y-2">
            {/* Repeat for each channel */}
            <div className="flex items-center">
              <MicIcon className="mr-2" /> <span>Meeting Room 1</span>
            </div>
            {/* ... other channels */}
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="absolute bottom-0 mb-5">
        <div className="flex items-center">
          <div className="mr-2 bg-green-500 h-4 w-4 rounded-full" /> {/* Online status indicator */}
          <span className="text-sm">johan</span>
        </div>
        <div className="flex">
          <MicIcon className="mr-2" />
          <HeadsetIcon className="mr-2" />
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
};

export default ChannelBar;
