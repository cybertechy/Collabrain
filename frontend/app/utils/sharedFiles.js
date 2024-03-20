import axios from "axios";
// Replace these URLs with the actual URLs for your backend API
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const SHARED_PROJECTS_URL = SERVERLOCATION + "/api/shared/projects";
const SHARED_CONTENT_MAPS_URL = SERVERLOCATION + "/api/shared/contentmaps";

/**
 * Fetch shared projects for a user.
 * @param {string} userId - The ID of the user whose shared projects are being fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of shared projects.
 */
export const fetchSharedProjects = async (userId) => {
  try {
    const response = await axios.get(`${SHARED_PROJECTS_URL}/${userId}`);
    if (response.status === 200) {
      return response.data.projects; // Assuming the API returns an object with a "projects" array
    } else {
      console.error("Failed to fetch shared projects:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching shared projects:", error);
    return [];
  }
};

/**
 * Fetch shared content maps for a user.
 * @param {string} userId - The ID of the user whose shared content maps are being fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of shared content maps.
 */
export const fetchSharedContentMaps = async (userId) => {
  try {
    const response = await axios.get(`${SHARED_CONTENT_MAPS_URL}/${userId}`);
    if (response.status === 200) {
      return response.data.contentMaps; // Assuming the API returns an object with a "contentMaps" array
    } else {
      console.error("Failed to fetch shared content maps:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching shared content maps:", error);
    return [];
  }
};
