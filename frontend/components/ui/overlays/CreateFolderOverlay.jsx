import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreateFolderOverlay = ({ isOpen, onClose }) => {
    const [folderName, setFolderName] = useState('');

    const handleCancel = () => {
        onClose(); // Function to close/hide the overlay
    };

    const handleCreate = () => {
        // Placeholder for the create folder logic
        onClose(); // Currently just closes the overlay
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? 'block' : 'hidden'} z-50 bg-black bg-opacity-50 backdrop-blur-sm`}>
            <div className="w-1/4 bg-white rounded-md shadow-lg">
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-4 text-black">Create a New Folder</h2>
                    <input
                        type="text"
                        className="w-full text-black p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        placeholder="Enter folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-white border-2 border-solid border-primary text-primary hover:opacity-80  rounded duration-300 ease-in-out"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-primary text-white rounded hover:opacity-80 border-2 border-solid border-primary duration-300 ease-in-out   "
                            onClick={handleCreate}
                        >
                            Create
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
};

export default CreateFolderOverlay;
