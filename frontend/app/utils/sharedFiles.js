import axios from "axios";

// Replace this URL with the actual URL for your backend API
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const CONTENT_MAPS_URL = SERVERLOCATION + "/api/maps"; // Assuming this is the correct endpoint to fetch individual content maps
import { fetchUser } from "./user";
const fb = require("_firebase/firebase");
const DOCUMENTS_URL = SERVERLOCATION + "/api/docs";
/**
 * Fetch shared content maps for a user.
 * @param {string} userId - The ID of the user whose shared content maps are being fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of shared content maps.
 */
export const fetchSharedContentMaps = async (userId) => {
  try {
    // Assume fetchUser is a function that retrieves the complete user profile, including AccessContentMaps
    const userInfo = await fetchUser(userId);

    if (!userInfo || !userInfo.AccessContentMaps || userInfo.AccessContentMaps.length === 0) {
      console.error("User has no access to shared content maps.");
      return [];
    }

    const token = await fb.getToken();
    const contentMapsData = await Promise.all(
      userInfo.AccessContentMaps.map(async (contentMapId) => {
        try {
          console.log("Fetching content map with ID:", contentMapId);
          const response = await axios.get(`${CONTENT_MAPS_URL}/${contentMapId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched content map:", response.data);
          return {...response.data, id: contentMapId};
        } catch (error) {
          console.error(`Error fetching content map with ID ${contentMapId}:`, error);
          return null; // Returning null for maps that failed to fetch, you might handle this differently
        }
      })
    );
    return contentMapsData.filter(map => map !== null); // Filter out any nulls from failed fetches
  } catch (error) {
    console.error("Error fetching shared content maps:", error);
    return [];
  }
};


export const fetchSharedDocuments = async (userId) => {
  try {
    // Assume fetchUser is a function that retrieves the complete user profile, including AccessContentMaps
    const userInfo = await fetchUser(userId);

    if (!userInfo || !userInfo.AccessDocuments || userInfo.AccessDocuments.length === 0) {
      console.error("User has no access to shared content documents.");
      return [];
    }

    const token = await fb.getToken();
    const documentsData = await Promise.all(
      userInfo.AccessDocuments.map(async (documentId) => {
        try {
          console.log("Fetching content document with ID:", documentId);
          const response = await axios.get(`${DOCUMENTS_URL}/${documentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return {...response.data, id: documentId};
        } catch (error) {
          console.error(`Error fetching content map with ID ${documentId}:`, error);
          return null; // Returning null for maps that failed to fetch, you might handle this differently
        }
      })
    );

	// Add type document to the documents
	documentsData.forEach((doc) => {
		doc.type = "document";
	});

    return documentsData.filter(map => map !== null); // Filter out any nulls from failed fetches
  } catch (error) {
    console.error("Error fetching shared content maps:", error);
    return [];
  }
};
