import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
const fb = require('_firebase/firebase');
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const NotificationOverlay = ({ teamInvites , onUpdate}) => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [detailedTeamInvites, setDetailedTeamInvites] = useState([]);
    const router = useRouter();
    // Function to fetch team details
    const fetchTeamDetails = async (teamId) => {
        const token = await fb.getToken(); // Make sure this retrieves the auth token
        try {
            const response = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { id: teamId, ...response.data };
        } catch (err) {
            console.error(`Failed to fetch details for team ${teamId}:`, err);
            return null;
        }
    };
    useEffect(() => {
        const fetchAllTeamDetails = async () => {
            const promises = teamInvites.map(teamId => fetchTeamDetails(teamId));
            const results = await Promise.all(promises);
            setDetailedTeamInvites(results.filter(team => team !== null));
            console.log("Detailed team invites", results.filter(team => team !== null))
        };

        if (teamInvites.length > 0) {
            
            fetchAllTeamDetails();
        }
    }, [teamInvites]);

    const handleAcceptInvite = async (teamId) => {
        try {
            const token = await fb.getToken(); // Replace with your method to get the user's token
            await axios.post(`${SERVERLOCATION}/api/teams/${teamId}/users?invite=true`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {  onUpdate() });
            console.log(`Accepted invite from team ${teamId}`);
            // Refresh the team invites after successful operation
            router.push(`/chat?teamId=${teamId}&channelName=General`);
        } catch (error) {
            console.error(`Error accepting invite from team ${teamId}:`, error);
        }
    };

    const handleDeclineInvite = async (teamId) => {
        try {
            const token = await fb.getToken(); // Replace with your method to get the user's token
            await axios.delete(`${SERVERLOCATION}/api/teams/${teamId}/invite`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {  onUpdate() });
            console.log(`Declined invite from team ${teamId}`);
            router.push(`/dashboard`);
        } catch (error) {
            console.error(`Error declining invite from team ${teamId}:`, error);
        }
    };

    return (
        <div className={`fixed right-5 w-[400px] h-min bg-primary text-basicallylight p-4 rounded-b-lg shadow-lg overflow-y-hidden z-50  ${
                showAnimation ? 'animate-expand' : 'animate-collapse'
            }`}
            style={{ transformOrigin: 'top' }}
        >
            
            <div className="text-xl text-center mb-4">Team Invites</div>
            <div className="border-t border-secondary pt-2"></div>
            {detailedTeamInvites.length > 0 ? (
                detailedTeamInvites.map((invite, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                        <span>{invite.name}</span>
                        <div>
                            <IconButton onClick={() => handleAcceptInvite(invite.id)} sx ={{background:"white", marginRight:1, borderRadius:1,}} color="success">
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeclineInvite(invite.id)} sx ={{background:"white", borderRadius:1,}} color="error">
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-basicallylight">You have no team invites.</div>
            )}
        </div>
    );
};

export default NotificationOverlay;
