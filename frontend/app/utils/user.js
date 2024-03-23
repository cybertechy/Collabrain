const fb = require("_firebase/firebase");
const axios = require("axios");

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;


const hasUsername = async () => {
    const token = await fb.getToken();
    const uid = fb.getUserID();
    console.log("IN HAS USERNAME, UID:",uid);
    console.log(SERVERLOCATION)
    try {
        const res = await axios.get(SERVERLOCATION + `/api/users/${uid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = res.data;
        console.log("USER IS", user);
        return user.username ? true : false;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const fetchUser = async (uid) => {
    try {
        const token = await fb.getToken();
        const response = await axios.get(SERVERLOCATION +   `/api/users/${uid}`, {
            headers: { "Authorization": "Bearer " + token }
        });
       return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

const getFriendRequests = async () => {
    const token = await fb.getToken();
    try {
        const response = await axios.get(`${SERVERLOCATION}/api/users/friends/requests`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        return null;
    }
};
const removeFriend = async (friendId) => {
    const token = await fb.getToken();
    try {
        await axios.delete(`${SERVERLOCATION}/api/users/friends/${friendId}`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error('Error removing friend:', error);
        return false;
    }
};

const updateFriendAlias = async (friendId, newAlias) => {
    const token = await fb.getToken();
    try {
        // Assuming newAlias is a string for a single friend's new alias
        console.log("Sending request with", friendId, newAlias)
        await axios.patch(`${SERVERLOCATION}/api/users/friends/${friendId}`, { aliases: newAlias }, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error('Error updating friend alias:', error);
        return false;
    }
};

const blockUser = async (userId) => {
    const token = await fb.getToken();
    try {
        await axios.post(`${SERVERLOCATION}/api/users/block/${userId}`, {}, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error('Error blocking user:', error);
        return false;
    }
};
const unblockUser = async (userId) => {
    const token = await fb.getToken();
    try {
        await axios.delete(`${SERVERLOCATION}/api/users/block/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        console.error('Error unblocking user:', error);
        return false;
    }
};
const getBlockedUsers = async () => {
    const token = await fb.getToken();
    try {
        const response = await axios.get(`${SERVERLOCATION}/api/users/blocked/users`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        return response.data.map(user => ({
            ...user,
            listType: 'blocked'
        }));;
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        return null;
    }
};

module.exports = { hasUsername,
    fetchUser,
    getFriendRequests,
    removeFriend,
    updateFriendAlias,
    blockUser,
    unblockUser,
    getBlockedUsers };