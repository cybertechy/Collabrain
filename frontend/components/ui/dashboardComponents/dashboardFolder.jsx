import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveIcon from '@mui/icons-material/DriveFileMove'; 
import ShareIcon from '@mui/icons-material/Share';
import OrganizeIcon from '@mui/icons-material/Sort'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit'; 
import fb from '../../../app/_firebase/firebase';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import "../../../i18n"
import { useTranslation } from 'next-i18next';

const DashboardFolder = ({ id, title, folder,  onFolderDeleted, projectUpdate, handleProjectDeleted}) => {
    const { t } = useTranslation('dashboard_folder');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
   const router = useRouter();
    const [renameOverlayOpen, setRenameOverlayOpen] = useState(false); // State for renaming overlay
    const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false); // State for delete confirmation overlay
    const [newFolderName, setNewFolderName] = useState(''); // State to store the new folder name
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const path = folder?.path;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    

   
    const handleClose = () => {
        setAnchorEl(null);
    };

    const truncateTitle = (title, maxLength = 12) => {
        if (title?.length > maxLength) {
            return title?.substring(0, maxLength - 3) + '..';
        }
        return title;
    };
    
    //this will only work once there is a patch api endpoint to update the folder name
    const handleRename = async () => {
        handleClose(); // Close the menu

        // Check if the new folder name is empty
        if (!newFolderName.trim()) {
            setError('Folder name cannot be empty');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = await fb.getToken();
            const response = await axios.patch(
                `https://collabrain-backend.cybertech13.eu.org/api/dashboard/folder/${folder.id}`,
                {
                    name: newFolderName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                onFolderDeleted(response.data.folder);
                setNewFolderName(''); // Clear the new folder name input
                setRenameOverlayOpen(false); // Close the overlay
            } else {
                setError('Failed to rename folder');
            }
        } catch (error) {
            setError('Error renaming folder');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = async () => {
        handleClose(); // Close the menu
        //const confirmDelete = window.confirm('Are you sure you want to delete this folder and its contents?');
        
            setIsLoading(true);
            setError(null);

            try {
                const token = await fb.getToken();
                const response = await axios.delete(
                    `https://collabrain-backend.cybertech13.eu.org/api/dashboard/folder/${folder.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    onFolderDeleted(response.data.folder);
                    setDeleteOverlayOpen(false); // Close the overlay
                } else {
                    setError('Failed to delete folder');
                }
            } catch (error) {
                setError('Error deleting folder');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        
    };
    const moveFileToFolder = async (projectId, folderPath, type) => {
       
        try {
          const token = await fb.getToken(); // Assuming you have a function to get the user's token
          const response = await axios.patch(
            `https://collabrain-backend.cybertech13.eu.org/api/dashboard/moveFile/${projectId}`, // Adjust the endpoint URL
            {
              to: folderPath, // Specify the folder path you want to move the file to
              fileType: type, // Specify the file type ('contentMap' or 'document')
            
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            // File moved successfully, you can update your UI here if needed
            handleProjectDeleted(projectId);
            console.log('File moved successfully');
            projectUpdate();
          } else {
            // Handle the case where the request was not successful
            console.error('Failed to move file');
          }
        } catch (error) {
          // Handle any errors that occur during the request
          console.error('Error moving file:', error);
        }
      };
     const handleDoubleClick = (e) => {
        e.preventDefault();

        router.push(`/dashboard?path=${path}`);
      };
    const handleDragOver = (e) => {
        e.preventDefault();
      };
      
      const handleDrop = (e, folderPath) => {
        e.preventDefault();
        const projectId = e.dataTransfer.getData("projectId");
        const type = e.dataTransfer.getData("type") === "Content Map" ? "contentMap": "documents";
        console.log("projectId", e.dataTransfer);

        moveFileToFolder(projectId, folderPath, type);
        // Now you have the projectId and folderId, you can handle the move action.
        // Call your method to move the file to the folder here.
      };
    const dialogStyles = {
        color: "#30475E",  // Text color
        borderColor: "#30475E",  // Border color
    };
    
    const buttonStyles = {
        color: "#FFFFFF",  // Text color
        backgroundColor: "#30475E",  // Button background color
    };
   
    return (
        <Tooltip title={title} enterDelay={1000} leaveDelay={200} >
            <div>
            <div className="bg-aliceBlue shadow-md  text-primary flex items-center justify-center rounded-md w-min pl-3 hover:bg-columbiablue hover:customShadow duration-300"
            onDoubleClick={(e) => handleDoubleClick(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, folder.path)}>
                <FolderIcon sx={{ color: folder?.color }} fontSize="large" />

                <span className='mx-5 w-24 text-lg font-semibold mr-10'>{truncateTitle(title)}</span>
                <IconButton onClick={handleClick} color="inherit">
                    <MoreVertIcon fontSize="large" />
                </IconButton>
                <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'folder-menu-button',
                }}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    setRenameOverlayOpen(true);
                }} className="flex justify-between gap-5 text-tertiary">
                <EditIcon className="mr-2 text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>{t('rename_button')}</span>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setDeleteOverlayOpen(true);
                }} className="flex justify-between gap-5  text-tertiary">
                <DeleteIcon className='text-tertiary'/> <span className='text-tertiary'>{t('delete_button')}</span> 
                </MenuItem>
            </Menu>
            </div>
              {/* Rename Overlay */}
              <Dialog open={renameOverlayOpen} onClose={() => setRenameOverlayOpen(false)} sx={dialogStyles}>
  <DialogTitle>{t('rename_top')}</DialogTitle>
    <DialogContent>
        <TextField
            label={t('new_folder_name')}
            variant="outlined"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
        />
    </DialogContent>
    <DialogActions>
    <Button onClick={() => setRenameOverlayOpen(false)} sx={buttonStyles}>
    {t('cancel_button')}
        </Button>
        <Button onClick={handleRename} sx={buttonStyles}>

            {t('rename_button')}
        </Button>
    </DialogActions>
</Dialog>

{/* Delete Confirmation Overlay */}
<Dialog open={deleteOverlayOpen} onClose={() => setDeleteOverlayOpen(false)} sx={dialogStyles}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
        Are you sure you want to delete this folder and its contents?
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setDeleteOverlayOpen(false)} sx={buttonStyles}>
            Cancel
        </Button>
        <Button onClick={handleDelete} sx={buttonStyles}>
            Delete
        </Button>
    </DialogActions>
</Dialog>
            </div>
           
        </Tooltip>
    );
};

DashboardFolder.propTypes = {
    title: PropTypes.string.isRequired,
    folder: PropTypes.object.isRequired,
   
};

export default DashboardFolder;
