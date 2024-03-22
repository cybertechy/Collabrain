// storageUtil.js
import axios from 'axios';
const fb = require("_firebase/firebase");

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const apiBaseUrl = SERVERLOCATION + '/api/storage'; // Adjust accordingly to your actual API base URL

// Function to add media to the bucket
export const addMedia = async (MIMEtype, base64Data) => {
    console.log("In storage utils, ",  MIMEtype,base64Data)
    try {
        const token = await fb.getToken(); // Assuming getToken() retrieves the current user's auth token
        const response = await axios.post(`${apiBaseUrl}/media/`, {
            MIMEtype,
            data: base64Data
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error("Error adding media:", error);
        return null;
    }
};

// Function to get media from the bucket
export const getMedia = async (mediaId) => {
    try {
        const token = await fb.getToken();
        const response = await axios.get(`${apiBaseUrl}/media/${mediaId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
       
        return response.data;
    } catch (error) {
        console.error("Error fetching media:", error);
        return null;
    }
};

// Function to delete media from the bucket
export const deleteMedia = async (mediaId) => {
    try {
        const token = await fb.getToken();
        const response = await axios.delete(`${apiBaseUrl}/media/${mediaId}`, {
            params: { token } // Since you're passing token as query, ensure this matches your server expectation
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting media:", error);
        return null;
    }
};

module.exports = { addMedia, getMedia, deleteMedia };