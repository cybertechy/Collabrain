import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import fb from '../../../app/_firebase/firebase';
const CreateFolderOverlay = ({ isOpen, onClose, onFolderCreated }) => {
    const [folderName, setFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [folderColor, setFolderColor] = useState('#ffffff'); // Default color

    const handleCancel = () => {
        onClose(); // Function to close/hide the overlay
    };

    const handleCreate = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
            
            const token = await fb.getToken();
            console.log('Token:', token);
            console.log('Folder Name:', folderName); 
            console.log('Folder Color:', folderColor)
            const response = await axios.post(
                'http://localhost:8080/api/dashboard/folder',
                {
                    name: folderName,
                    color: folderColor, // Add folderColor here
                    path: `/`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Response:', response); // Add this line
           if (response.status === 200) {
    onFolderCreated(response.data.folder);
                onClose(); // Close the overlay
            } else {
                setError('Failed to create folder');
            }
        } catch (error) {
            setError('Error creating folder');
            console.error('Error:', error);
        } finally {
            console.log('Folder creation completed.'); 
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? 'block' : 'hidden'} z-50 bg-basicallydark bg-opacity-50 backdrop-blur-sm`}>
            <div className="w-1/4 bg-basicallylight rounded-md shadow-lg">
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-4 text-basicallydark">Create a New Folder</h2>
                    <input
                        type="text"
                        className="w-full text-basicallydark p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        placeholder="Enter folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                    <div className='text-primary font-medium italic font-poppins'>Pick a color for your folder: <input
    type="color"
    className="w-16 h-8 border mt-2 border-gray-300 rounded focus:outline-none text-primary"
    value={folderColor}
    onChange={(e) => setFolderColor(e.target.value)}
/></div>
                    
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-basicallylight border-2 border-solid border-primary text-primary hover:opacity-80  rounded duration-300 ease-in-out"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-primary text-basicallylight rounded hover:opacity-80 border-2 border-solid border-primary duration-300 ease-in-out"
                            onClick={handleCreate}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateFolderOverlay.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFolderCreated: PropTypes.func.isRequired, // Callback function to handle folder creation
};

export default CreateFolderOverlay;
