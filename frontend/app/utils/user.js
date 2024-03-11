const fb = require("_firebase/firebase");
const axios = require("axios");

const hasUsername = async () => {
    const token = await fb.getToken();
    const uid = fb.getUserID();
    console.log("IN HAS USERNAME, UID:",uid);
    try {
        const res = await axios.get(`http://localhost:8080/api/users/${uid}`, {
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
        const response = await axios.get(`http://localhost:8080/api/users/${uid}`, {
            headers: { "Authorization": "Bearer " + token }
        });
       return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

module.exports = { hasUsername, fetchUser };