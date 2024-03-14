const fb = require("_firebase/firebase");
const axios = require("axios");
import { toast } from "react-toastify";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const retrieveToken = async () => {
return await fb.getToken();
}

const fetchFolders = async (path='/') => {
    // Return the Promise chain here
    return new Promise((resolve, reject) => {
      const token = retrieveToken(); // Synchronously get the token
      if (token) {
        resolve(token);
      } else {
        reject("No token found");
      }
    })
    .then(token => {
      return axios.get(`${SERVERLOCATION}/api/dashboard/folders?timestamp=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: {
            path: path,
          },
      });
    })
    .then(response => {
      if (response.status === 200) {
        
        return response.data.folders; // Return the folders here
      } else {
        console.error("Failed to fetch folders data", response.status);
        throw new Error(`Failed to fetch folders, status code: ${response.status}`); // Throw an error to be caught by the catch block
      }
    })
    .catch(error => {
      console.error("Error fetching folders data:", error);
      throw error; // Re-throw the error to be caught where fetchFolders is called
    });
  };


  const fetchProjects = async (path) => {
    try {
      const token = await fb.getToken(); // Wait for the token to be resolved
      if (!token) {
        throw new Error("No token found");
      }
     
  
      const response = await axios.get(`${SERVERLOCATION}/api/dashboard/files?timestamp=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          path: path,
        },
      });
  
      if (response.status === 200) {
        console.log("Fetched Files",response.data);
        return response.data.files; // Resolve the promise with files data
      } else {
        throw new Error(`Failed to fetch projects, status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching projects data:", error);
      throw error; // Re-throw the error to handle it in the calling context
    }
  };
  

  const newContentMap = async (getToken, navigate, path = '/') => {
    let token = await getToken();
    if (!token) return null;

    try {
        const res = await axios.post(`${SERVERLOCATION}/api/maps`, {
            name: "New Content Map",
            data: "",
            path: path
        }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (res.status !== 200) return null;
        navigate(`/contentmap?id=${res.data.id}`);
    } catch (err) {
        console.log(err);
        toast.error("Error creating new content map", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored"
        });

        return null;
    }
};

const createFolder = async (folderName, folderColor, path = '/') => {
    try {
        const token = await fb.getToken();
        const response = await axios.post(
            SERVERLOCATION+'/api/dashboard/folder',
            { name: folderName, color: folderColor, path: path }, // Assuming path is always `/` for simplicity
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return {
                success: true,
                folder: {
                    id: response.data.folderID,
                    name: folderName,
                    color: folderColor,
                    path: response.data.path,
                },
            };
        } else {
            return { success: false, error: 'Failed to create folder' };
        }
    } catch (error) {
        console.error('Error creating folder:', error);
        return { success: false, error: 'Error creating folder' };
    }
};
            module.exports = { fetchFolders, fetchProjects, newContentMap, createFolder};