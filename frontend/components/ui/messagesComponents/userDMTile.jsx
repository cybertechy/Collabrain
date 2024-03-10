import { ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import CustomAvatar from './avatar';

const userDMTile = ({ message, avatar, openChat, username, data, chatID }) => {
    console.log(data);
    const formattedDate = data.lastMessage?.sentAt? new Date(data.lastMessage.sentAt._seconds * 1000 + data.lastMessage.sentAt._nanoseconds / 1000000).toLocaleDateString() : ""; 

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
        <ListItem onClick={() => openChat(data.members[1].id,chatID)} className="border-b border-gray-200">
            <ListItemAvatar>
                <CustomAvatar username={username} />
            </ListItemAvatar>
            <ListItemText 
                primary={
                    <>
                        <Typography component="span" variant="body1" color="textPrimary">
                            {username}
                        </Typography>
                        <br/>
                        <Typography component="span" variant="caption" color="textSecondary">
                            {formattedDate}
                        </Typography>
                    </>
                } 
                secondary={message? truncateMessage(message) : "Enter a message now"}
            />
        </ListItem>
    );
};

export default userDMTile;
