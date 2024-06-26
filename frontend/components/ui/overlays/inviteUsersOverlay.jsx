import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import CustomAvatar from "../messagesComponents/avatar";
import { ToastContainer, toast } from "react-toastify";
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { fetchUser } from "@/app/utils/user";
const fb = require("_firebase/firebase");

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const InviteUsersOverlay = ({ onClose, teamData }) => {
    const { t } = useTranslation('invite_users');
    const { speak, stop, isTTSEnabled } = useTTS();

    const UserTile = ({ user, onInviteClick }) => (
        <ListItem>
            <ListItemAvatar>
                <CustomAvatar username={user.username} />
            </ListItemAvatar>
            <ListItemText primary={user.username} />
            <ListItemSecondaryAction>
                <Button
                    sx={{
                        borderColor: "#30475E",
                        color: "#30475E",
                        "&:hover": {
                            backgroundColor: "#30475E",
                            color: "#FFFFFF",
                        },
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() => onInviteClick(user)}
                    onMouseEnter={() => isTTSEnabled && speak("Invite button")} onMouseLeave={stop}
                >
                    {t('invite')}
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchTimerRef = useRef(null);

    useEffect(() => {
        if (!searchQuery.trim()) {
            // Assume getFriends fetches and sets users initially
            getFriends();
            return;
        }

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        searchTimerRef.current = setTimeout(() => {
            fetchSearchResults(searchQuery);
        }, 500); // Debounce time

        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, [searchQuery]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const token = await fb.getToken();
            const response = await axios.get(
                `${SERVERLOCATION}/api/users/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        username: query.toLowerCase(),
                    },
                }
            );
            console.log(response.data);
            const filteredUsers = response.data.filter(
                (user) => !teamData.members.hasOwnProperty(user.id)
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const getFriends = async () => {
        setLoading(true);
        try {
            const token = await fb.getToken();
            const response = await axios.get(
                `${SERVERLOCATION}/api/users/f/friends`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);

            // Map through the list of friend IDs and call fetchUser for each
            const friendsPromises = response.data.friends.map(async (id) => {
                const user = await fetchUser(id);
                return { ...user, id }; // Attach the id to the user object
            });

            // Wait for all the fetchUser promises to resolve
            const friendsData = await Promise.all(friendsPromises);

            // Now friendsData contains the actual data of each friend with their respective ids
            console.log(friendsData);
            setUsers(friendsData);
        } catch (error) {
            console.error("Error fetching friends:", error);
            setUsers([]);
        }
        setLoading(false);
    };
    
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleInviteUser = async (user) => {
      console.log("Inviting user:", user);
      try {
          const token = await fb.getToken();
          const teamId = teamData?.teamId;
          const userId = user.id;
         const response =  await axios.post(
              `${SERVERLOCATION}/api/teams/${teamId}/invite/${userId}`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          console.log(response);
          toast.success(`User ${user.username} invited successfully!`);
          setLoading(false);
          handleDone();
          
      } catch (error) {
          console.error("Error sending invite:", error);
    
          toast.success(`User ${user.username} invited successfully!`);
      } finally {
        console.log("Finally");
          setLoading(false);
          handleDone(); 
      }
  };

    const handleDone = () => {
        console.log("Done");
        onClose(); // Close the overlay
    };
    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle onMouseEnter={() => isTTSEnabled && speak("Invite users")} onMouseLeave={stop}>{t('inv_users')}</DialogTitle>
            <DialogContent>
                <TextField
                    label={t('search')}
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4 mt-4"
                    onMouseEnter={() => isTTSEnabled && speak("Type a user's name here")} onMouseLeave={stop}
                />
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 20,
                        }}
                    >
                        <CircularProgress size={24} />
                    </div>
                ) : (
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                        <List dense>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <UserTile
                                        key={user.id}
                                        user={user}
                                        onInviteClick={() =>
                                            handleInviteUser(user)
                                        }
                                    />
                                ))
                            ) : searchQuery && !loading ? (
                                <ListItem>
                                    <ListItemText primary={t('not_found')}
                                    onMouseEnter={() => isTTSEnabled && speak("No users found")} onMouseLeave={stop} />
                                </ListItem>
                            ) : null}
                        </List>
                    </div>
                )}
                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outlined" onClick={handleDone} 
                    onMouseEnter={() => isTTSEnabled && speak("Done button")} onMouseLeave={stop}>
                        {t('done')}
                    </Button>
                </div>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
};

export default InviteUsersOverlay;
