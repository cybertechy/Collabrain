
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Tooltip}  from '@mui/material';
import { useState } from 'react';
import CreateFolderOverlay from  '../overlays/CreateFolderOverlay';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const DashboardNewFolder = ({ onNewFolderCreated }) => {
    const { t } = useTranslation('create_folder_overlay');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] = useState(false);

    const toggleCreateFolderOverlay = () => {
        setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
    };
    // TODO: onClick(folder);
    return (
        <Tooltip title={t('folder_hover')} enterDelay={1000} leaveDelay={200}>
        <div>
          {isCreateFolderOverlayOpen && (
            <CreateFolderOverlay
              isOpen={isCreateFolderOverlayOpen}
              onClose={toggleCreateFolderOverlay}
              onFolderCreated={(newFolder) => {
                onNewFolderCreated(newFolder); // Invoke the callback passed from Dashboard
              }}
            />
          )}
          <div className="bg-aliceBlue shadow-md flex items-center justify-center rounded-xl w-min hover:bg-columbiablue duration-300"
          onMouseEnter={() => isTTSEnabled && speak("Create New Folder button")}
          onMouseLeave={stop}>
            <IconButton onClick={toggleCreateFolderOverlay} color="inherit">
              <AddCircleIcon fontSize="large" sx={{ color: '#30475E' }} />
            </IconButton>
          </div>
        </div>
      </Tooltip>
      
    );
};

DashboardNewFolder.propTypes = {
    onNewFolderCreated: PropTypes.func.isRequired,
  };
export default DashboardNewFolder;

