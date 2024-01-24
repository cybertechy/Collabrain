
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Tooltip}  from '@mui/material';
import { useState } from 'react';
import CreateFolderOverlay from  '../overlays/CreateFolderOverlay';
const DashboardNewFolder = ({}) => {
    const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] = useState(false);

    const toggleCreateFolderOverlay = () => {
        setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
    };
    // TODO: onClick(folder);
    return (
        <Tooltip
            title={"New Folder"}
            enterDelay={1000}
            leaveDelay={200}
          
        >
             {isCreateFolderOverlayOpen && (
                <CreateFolderOverlay 
                    isOpen={isCreateFolderOverlayOpen} 
                    onClose={toggleCreateFolderOverlay} 
                />
            )}
        <div className="bg-tertiary flex items-center justify-center rounded-xl w-min  hover:opacity-80 duration-300">
            <IconButton onClick={toggleCreateFolderOverlay} color="inherit">
                <AddCircleIcon  fontSize="large" style={{ color: 'white' }} />
            </IconButton>
        </div>
        </Tooltip>
    );
};

DashboardNewFolder.propTypes = {
   
    onClick: PropTypes.func.isRequired,
};

export default DashboardNewFolder;

