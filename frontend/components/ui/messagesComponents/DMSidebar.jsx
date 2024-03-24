import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import UserProfileBox from './userProfileBox'; // Corrected import
import UserDMTile from './userDMTile'; // Corrected import
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import {fetchUser} from '@/app/utils/user';
import { useEffect, useState } from 'react';
import { ArrowForward } from '@mui/icons-material';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const DMSidebar = ({ userData, onMute, onDeafen, onSettings, chatList, openChat, showChat, setShowFriends, showFriends, openFriends }) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    const { t } = useTranslation('dms');
    console.log("UserData informtion", userData)
    const [membersDetails, setMembersDetails] = useState({});


    useEffect(() => {
        const fetchMembersDetails = async () => {
            const details = {};
    
            for (const chat of chatList) {
                try {
                    const memberId = chat.members[1].id; // Assuming we're fetching for the second member
                    if (!details[memberId]) { // Avoid refetching if we already have the details
                        const response = await fetchUser(memberId);
                       
                        details[memberId] = response;
                    }
                } catch (error) {
                    console.error("Error fetching member details:", error);
                }
            }
    
            setMembersDetails(details);
        };
    
        if (chatList.length > 0) {
            fetchMembersDetails();
        }
    }, [chatList]);
    return (
        <div className={`flex flex-col h-full ${showFriends ? 'max-sm:hidden' : `${showChat ? 'max-sm:hidden' : 'max-sm:w-full'}`}  bg-white shadow-md z-20 `}>
            {/* Chat Header */}
            <div className = "flex flex-col justify-between h-full min-w-52">
            <div id= "chats" >
            {/* <div className="flex items-center justify-center p-4 shadow-md bg-gray-100"> */}
            <div className="flex flex-col items-center justify-center p-4 shadow-md bg-gray-100">
                <h2 className="text-xl text-center font-semibold"                
                onMouseEnter={() => isTTSEnabled && speak("Chats Sidebar")}
                onMouseLeave={stop}>{t('chats')}</h2>
                <button 
                className='hidden max-sm:block ml-auto bg-primary text-white rounded-lg py-2 px-3 mt-2'
                onClick={() => {
        // Toggles the display between ChatWindow and FriendsWindow
                    openFriends;
                    setShowFriends(true); // Toggle showChat state
                    console.log("showFriends",showFriends);
                }}>Friends
                <span className='ml-1'><ArrowForward></ArrowForward></span>
                </button>
            </div>
            
            {/* Chat List */}
            <List className="overflow-auto flex flex-col">
                        {chatList?.map((chat, index) => {
                          console.log("Chat information", chat)
                          const chatMemberId = chat.members[1].id;
                          console.log("ChatMember details",membersDetails)
                          const chatMemberDetails = membersDetails[chatMemberId];
                            // Assuming chat.members is an array and userData.id needs to be checked against these members
                            // Check if chat.members array includes the userData.id, if not, render UserDMTile
                            
                            const shouldDisplay = !(userData?.data?.blocked?.some(member => member.id !== chat.members[1].id) ||  chatMemberDetails?.blocked?.includes(userData.id));
                            return shouldDisplay && (
                                <UserDMTile
                                    key={index}
                                    message={chat.lastMessage.message}
                                    avatar={chat.avatar}
                                    openChat={openChat}
                                    username={userData.data && userData.data.alias && userData.data.alias[chat.members[1].id]
                                        ? `${userData.data.alias[chat.members[1].id]}`
                                        : chat.members[1].username}
                                    actualUsername={chat.members[1].username}
                                    data={chat}
                                    chatID={chat.id}
                                />
                            );
                        })}
                    </List>
          
            </div>
        
            <div className="">
                <UserProfileBox // Corrected usage
                    userData={userData}
                    onMute={onMute}
                    onDeafen={onDeafen}
                    onSettings={onSettings}
                />
            </div>
            
            </div>
        </div>
    );
};

export default DMSidebar;
