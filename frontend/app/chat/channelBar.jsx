import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import UserProfileBox from '@/components/ui/messagesComponents/userProfileBox'; // Corrected import
import ChannelButton from './channelButton';
import { useState, useEffect } from 'react';
import TeamChannelOptionsMenu from '@/components/ui/chatsComponents/teamChannelOptionsMenu';
const ChannelBar = ({ user, userUID, teamData, onUpdated, onInvite,onSettings, onLeave,onDelete, onViewDetails, onMute, onDeafen,   handleChannelSelect , selectedChannel,  onView}) => {
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (teamData) {
            setIsOwner(teamData.owner === userUID);
            setIsAdmin(teamData.members?.[userUID]?.role === 'admin');
        }
    }, [teamData, userUID]); 
    const handleTeamOptionSelect = (option) => {
        switch (option) {
            case 'invite':
                onInvite();
                break;
            case 'settings':
                onSettings();
                break;
            case 'leave':
                onLeave();
                break;
            case 'delete':
                if (isOwner) { // Only allow if user is the owner
                    onDelete();
                }
                break;
            case 'viewDetails':
                onViewDetails(); // Handle viewing team details
                break;
            default:
                console.warn('Unrecognized option:', option);
        }
    };
    return (
        <div className="flex flex-col h-full bg-white shadow-md z-20">
            {/* Chat Header */}
            <div className="flex flex-col">
        <TeamChannelOptionsMenu teamName = {teamData.name} onOptionSelect={handleTeamOptionSelect}   isOwner={isOwner}
                    isAdmin={isAdmin}   />
      </div>
            <div className = "flex flex-col justify-between h-full">
            <div id= "chats" >
            <div className="flex items-center justify-center p-4 shadow-md bg-gray-100">
                <h2 className="text-xl text-center font-semibold">Channels</h2>
                
            </div>
            
            {/* Chat List */}
            <List className="overflow-auto flex flex-col">
            {teamData?.channels?.map((channel, index) => (
                        <ChannelButton
                        key = {index}
                            channelId={channel.id}
                            channel={channel}
                            isSelected={selectedChannel === channel.name}
                            onSelect={handleChannelSelect}
                        />
                    ))}
               
            </List>
            
          
            </div>
        
            <div className="">
                <UserProfileBox // Corrected usage
                    userData={user}
                    onMute={onMute}
                    onDeafen={onDeafen}
                    onSettings={onSettings}
                />
            </div>
            
            </div>
        </div>
    );
};

export default ChannelBar;
