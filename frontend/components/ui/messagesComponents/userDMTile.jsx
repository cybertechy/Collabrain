import { ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import CustomAvatar from './avatar';

const userDMTile = ({ message, avatar, openChat, username, data, chatID }) => {
    console.log(data);
    const formattedDate = new Date(data.lastMessage.sentAt._seconds * 1000 + data.lastMessage.sentAt._nanoseconds / 1000000).toLocaleDateString();

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
                secondary={message}
            />
        </ListItem>
    );
};

export default userDMTile;
