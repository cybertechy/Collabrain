import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import UserProfileBox from './userProfileBox'; // Corrected import
import UserDMTile from './userDMTile'; // Corrected import
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const DMSidebar = ({ userData, onMute, onDeafen, onSettings, chatList, openChat }) => {
    console.log("UserData informtion", userData)
    return (
        <div className="flex flex-col h-full bg-white shadow-md z-20">
            {/* Chat Header */}
            <div className = "flex flex-col justify-between h-full">
            <div id= "chats" >
            <div className="flex items-center justify-center p-4 shadow-md bg-gray-100">
                <h2 className="text-xl text-center font-semibold">Chats</h2>
                
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
