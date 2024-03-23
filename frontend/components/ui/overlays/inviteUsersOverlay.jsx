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
const fb = require("_firebase/firebase");

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

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
            >
                Invite
            </Button>
        </ListItemSecondaryAction>
    </ListItem>
);
const InviteUsersOverlay = ({ onClose, teamData }) => {
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
            setUsers(response.data.friends);
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
      console.log("Inviting user:", user.username);
      toast.success(`User ${user.username} invited successfully!`);
      
      try {
          const token = await fb.getToken();
          const teamId = teamData.teamId;
          const userId = user.id;
          
          await axios.post(
              `${SERVERLOCATION}/api/teams/${teamId}/invite/${userId}`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          // On success, show success toast
          setLoading(false);
          handleDone();
          
      } catch (error) {
          console.error("Error sending invite:", error);
          // On error, show error toast
          toast.error("Error sending invite. Please try again.");
      } finally {
          setLoading(false);
          handleDone(); // Or handle this differently if you wish
      }
  };

    const handleDone = () => {
        console.log("Done");
        onClose(); // Close the overlay
    };
    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Invite Users</DialogTitle>
            <DialogContent>
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4 mt-4"
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
                                    <ListItemText primary="No users found" />
                                </ListItem>
                            ) : null}
                        </List>
                    </div>
                )}
                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outlined" onClick={handleDone}>
                        Done
                    </Button>
                </div>
            </DialogContent>
            <ToastContainer />
        </Dialog>
    );
};

export default InviteUsersOverlay;
