import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {createFolder} from '../../../app/utils/filesAndFolders';
import { useSearchParams } from 'next/navigation'
import "../../../app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { useTTS } from "../../../app/utils/tts/TTSContext";
const CreateFolderOverlay = ( {isOpen, onClose, onFolderCreated}) => {
    const { t } = useTranslation('create_folder_overlay');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [folderName, setFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [folderColor, setFolderColor] = useState('#30475E'); // Default color
    const searchParams = useSearchParams();
    const handleCancel = () => {
        onClose(); // Function to close/hide the overlay
    };
    console.log(searchParams.get("path"));

    const handleCreate = async () => {
        setIsLoading(true);
        setError(null);
        const path = searchParams.get("path") || "/";
        const newPath = path === "/" ? `${path}${folderName}` : `${path}/${folderName}`;

        const { success, folder, error } = await createFolder(folderName, folderColor, newPath);
    
        if (success) {
            console.log("createdFolder is", folder);
            onFolderCreated(folder); // Update the UI with the server-confirmed folder
            onClose(); // Close the overlay upon successful creation
        } else {
            setError(error);
        }
    
        setIsLoading(false);
    };
    
    

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? 'block' : 'hidden'} z-50 bg-basicallydark bg-opacity-50 backdrop-blur-sm`}>
            <div className="w-1/4 bg-basicallylight rounded-md shadow-lg">
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-4 text-basicallydark"
                    onMouseEnter={() => isTTSEnabled && speak("Create a New Folder")}
                    onMouseLeave={stop}>{t('folder_top')}</h2>
                    <input
                        type="text"
                        className="w-full text-basicallydark p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        placeholder={t('folder_name')}
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onMouseEnter={() => isTTSEnabled && speak("Type the folder name here")}
                        onMouseLeave={stop}
                    />
                    <div className='text-primary font-medium italic font-poppins'
                    onMouseEnter={() => isTTSEnabled && speak("Pick a color for your folder")}
                    onMouseLeave={stop}>{t('folder_clr')} <input
    type="color"
    className="w-16 h-8 border mt-2 border-gray-300 rounded focus:outline-none text-primary"
    value={folderColor}
    onChange={(e) => setFolderColor(e.target.value)}
    onMouseEnter={() => isTTSEnabled && speak("Color selection button")}
    onMouseLeave={stop}
/></div>
                    
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-basicallylight border-2 border-solid border-primary text-primary hover:opacity-80  rounded duration-300 ease-in-out"
                            onClick={handleCancel}
                            disabled={isLoading}
                            onMouseEnter={() => isTTSEnabled && speak("Cancel button")}
                            onMouseLeave={stop}
                        >
                            {t('folder_cancel')}
                        </button>
                        <button
                            className="px-4 py-2 bg-primary text-basicallylight rounded hover:opacity-80 border-2 border-solid border-primary duration-300 ease-in-out"
                            onClick={handleCreate}
                            disabled={isLoading}
                            onMouseEnter={() => isTTSEnabled && speak("Create button")}
                            onMouseLeave={stop}
                        >
                            {isLoading ? t('folder_wait') : t('folder_create')}
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
    onFolderCreated: PropTypes.func.isRequired,
  
};
export default CreateFolderOverlay;