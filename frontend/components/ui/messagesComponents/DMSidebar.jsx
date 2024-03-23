import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import UserProfileBox from './userProfileBox'; // Corrected import
import UserDMTile from './userDMTile'; // Corrected import
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { ArrowForward } from '@mui/icons-material';

const DMSidebar = ({ userData, onMute, onDeafen, onSettings, chatList, openChat, showChat, setShowFriends, showFriends, openFriends }) => {
    console.log("UserData informtion", userData)
    return (
        <div className={`flex flex-col h-full ${showFriends ? 'max-sm:hidden' : `${showChat ? 'max-sm:hidden' : 'max-sm:w-full'}`}  bg-white shadow-md z-20 `}>
            {/* Chat Header */}
            <div className = "flex flex-col justify-between h-full min-w-52">
            <div id= "chats" >
            {/* <div className="flex items-center justify-center p-4 shadow-md bg-gray-100"> */}
            <div className="flex flex-col items-center justify-center p-4 shadow-md bg-gray-100">
                <h2 className="text-xl text-center font-semibold">Chats</h2>
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

                {chatList?.map((chat, index) => (
                   console.log("chat member",chat.members[1]),
                    <UserDMTile // Corrected usage
                        key={index}
                        message={chat.lastMessage.message}
                        avatar={chat.avatar}
                        openChat={openChat}
                        username={ userData.data && userData.data.alias && userData.data.alias[chat.members[1].id]
                            ? `${userData.data.alias[chat.members[1].id]}`
                            :  chat.members[1].username}
                        actualUsername = {chat.members[1].username}
                        data={chat}
                        chatID={chat.id}
                    />
                ))}
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
