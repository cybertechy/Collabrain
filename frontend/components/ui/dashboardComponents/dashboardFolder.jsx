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
const DashboardFolder = ({ title, folder, onClick  ,onFolderDeleted}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
   
    const [renameOverlayOpen, setRenameOverlayOpen] = useState(false); // State for renaming overlay
    const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false); // State for delete confirmation overlay
    const [newFolderName, setNewFolderName] = useState(''); // State to store the new folder name
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
                `http://localhost:8080/api/dashboard/folder/${folder.id}`,
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
                onFolderUpdated(response.data.folder);
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
                    `http://localhost:8080/api/dashboard/folder/${folder.id}`,
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
    const dialogStyles = {
        color: "#972FFF",  // Text color
        borderColor: "#972FFF",  // Border color
    };
    
    const buttonStyles = {
        color: "#FFFFFF",  // Text color
        backgroundColor: "#972FFF",  // Button background color
    };
    return (
        <Tooltip title={title} enterDelay={1000} leaveDelay={200}>
            <>
            <div className="bg-tertiary text-basicallylight flex items-center justify-center rounded-md w-min pl-3 hover:opacity-80 duration-300">
                <FolderIcon fontSize="large" />
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
                    <span className='text-tertiary'>Rename</span>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setDeleteOverlayOpen(true);
                }} className="flex justify-between gap-5  text-tertiary">
                <DeleteIcon className='text-tertiary'/> <span className='text-tertiary'>Delete</span> 
                </MenuItem>
            </Menu>
            </div>
              {/* Rename Overlay */}
              <Dialog open={renameOverlayOpen} onClose={() => setRenameOverlayOpen(false)} sx={dialogStyles}>
  <DialogTitle>Rename Folder</DialogTitle>
    <DialogContent>
        <TextField
            label="New Folder Name"
            variant="outlined"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
        />
    </DialogContent>
    <DialogActions>
    <Button onClick={() => setRenameOverlayOpen(false)} sx={buttonStyles}>
    Cancel
        </Button>
        <Button onClick={handleRename} sx={buttonStyles}>

            Rename
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
            </>
           
        </Tooltip>
    );
};

DashboardFolder.propTypes = {
    title: PropTypes.string.isRequired,
    folder: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default DashboardFolder;
