import axios from 'axios';
const fb = require("_firebase/firebase");

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const patchTeamData = async (teamId, data) => {
    try {
      const token = await fb.getToken(); // Assuming `fb.getToken()` retrieves the current user's auth token
      const response = await axios.patch(`${SERVERLOCATION}/api/teams/${teamId}`, { data }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating team data:", error);
    
    }
  };
  const fetchTeamInvites = async () => {
    const token = await fb.getToken(); // Assuming `fb.getToken()` retrieves the current user's auth token
    try {
        const response = await axios.get(`${SERVERLOCATION}/api/teams/invite`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        console.log("fetched invites", response.data)
       return response.data;
    } catch (error) {
        console.error("Failed to fetch team invites:", error);
    }
};
  module.exports = { patchTeamData, fetchTeamInvites};