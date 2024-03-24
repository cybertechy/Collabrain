import { ListItem, ListItemAvatar, ListItemText, Typography , Menu, MenuItem} from '@mui/material';
import CustomAvatar from './avatar';
import { blockUser, unblockUser } from '@/app/utils/user';
import { useState } from 'react';
import { useTTS } from "@/app/utils/tts/TTSContext";

const userDMTile = ({ message, avatar, openChat, username, data, chatID , actualUsername}) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const handleClose = () => {
        setMenuOpen(false);
    };
    const handleBlock = () => {
        blockUser(data.members[1].id); // Adjust according to how you identify the user to block
        handleClose();
    };

    const formattedDate = data.lastMessage?.sentAt? new Date(data.lastMessage.sentAt._seconds * 1000 + data.lastMessage.sentAt._nanoseconds / 1000000).toLocaleDateString() : ""; 

    const handleUsernameHover = () => {
        if (isTTSEnabled) {
            speak(`Chat with ${username}`);
        }
    };
    const handleDateHover = () => {
        if (isTTSEnabled) {
            speak(`Date of the last message: ${formattedDate}`);
        }
    };
    const handleLeave = () => {
        stop();
    };

    const truncateMessage = (message, maxLength = 20) => {
        // Truncate message if longer than maxLength
        let truncated = message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
        // Pad the message if it's shorter than maxLength
        if(truncated.length < maxLength) {
            const paddingLength = maxLength - truncated.length;
            truncated += ' '.repeat(paddingLength);
        }
        return truncated;
    };
    return (
        <>
        <ListItem onClick={() => openChat(data.members[1].id,chatID)} className="border-b border-gray-200">
            <ListItemAvatar>
                <CustomAvatar username={actualUsername} />
            </ListItemAvatar>
            <ListItemText 
                primary={
                    <>
                        <Typography component="span" variant="body1" color="textPrimary"
                        onMouseEnter={handleUsernameHover} onMouseLeave={handleLeave}>
                            {username}
                        </Typography>
                        <br/>
                        <Typography component="span" variant="caption" color="textSecondary"
                        onMouseEnter={handleDateHover} onMouseLeave={handleLeave}>
                            {formattedDate}
                        </Typography>
                    </>
                } 
                secondary={message? truncateMessage(message) : "Enter a message now"}
            />
        </ListItem>
        <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        keepMounted
    >
        <MenuItem onClick={handleBlock}>Block</MenuItem>
    </Menu>
    </>
    );
};

export default userDMTile;
