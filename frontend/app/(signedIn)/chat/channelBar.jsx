import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import UserProfileBox from '@/components/ui/messagesComponents/userProfileBox'; // Corrected import
import ChannelButton from './channelButton';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TeamChannelOptionsMenu from '@/components/ui/chatsComponents/teamChannelOptionsMenu';
import AddChannelOverlay from '@/components/ui/overlays/addChannelOverlay';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const ChannelBar = ({ user, userUID, teamData, onUpdated, onInvite, onSettings, onLeave, onDelete, onViewDetails, onMute, onDeafen, handleChannelSelect, selectedChannel, onView }) => {
    const { t } = useTranslation('team');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddChannelOverlay, setShowAddChannelOverlay] = useState(false); // State to control AddChannelOverlay visibility

    useEffect(() => {
        if (teamData) {
            console.log('Team data:', teamData);
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

    const handleAddChannelClick = () => {
        setShowAddChannelOverlay(true);
    };
    const handleChannelAdded = (channelName) => {
        console.log(`Channel ${channelName} added`);
        onUpdated(); // Trigger any updates needed after adding a channel
    };

    const sortedChannels = teamData?.channels?.slice().sort((a, b) => {
        if (a.name === 'General') return -1;
        if (b.name === 'General') return 1;
        return 0; // Keep other channels in their original order
    });
    return (
        <div className="flex flex-col h-full bg-white shadow-md z-20 min-w-52">
            {/* Chat Header */}
            <div className="flex flex-col">
                <TeamChannelOptionsMenu teamName={teamData.name} onOptionSelect={handleTeamOptionSelect} isOwner={isOwner}
                    isAdmin={isAdmin} />
            </div>
            <div className="flex flex-col justify-between h-full">
                <div id="chats" >
                    <div className="flex flex-row items-center justify-between p-4 shadow-md bg-gray-100">
                        <h2 className="text-xl text-center font-semibold"
                        onMouseEnter={() => isTTSEnabled && speak("Team Channels")} onMouseLeave={stop}>{t('channels')}</h2>
                        {teamData.owner == userUID && <button onClick={handleAddChannelClick} className="bg-primary ml-2  text-white p-2 rounded-md h-8 w-8 flex items-center justify-center">
                            {/* Using a simple "+" text for the icon */}
                            <AddIcon onMouseEnter={() => isTTSEnabled && speak("Add Channel button")} onMouseLeave={stop}></AddIcon>
                        </button> }
                        
                    </div>

                    {/* Chat List */}
                    <List className="overflow-auto flex flex-col space-y-2">
                        {sortedChannels?.map((channel, index) => (
                            <ChannelButton
                                key={index}
                                channelId={channel.id}
                                channel={channel}
                                isSelected={selectedChannel === channel.name}
                                onSelect={handleChannelSelect}
                                speak={speak}
                                stop={stop}
                                isTTSEnabled={isTTSEnabled}
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
            {showAddChannelOverlay && (
                <AddChannelOverlay
                    isOpen={showAddChannelOverlay}
                    onClose={() => setShowAddChannelOverlay(false)}
                    onChannelAdded={handleChannelAdded}
                    teamData={teamData}
                />
            )}
        </div>
    );
};

export default ChannelBar;
