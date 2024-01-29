import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveIcon from '@mui/icons-material/DriveFileMove'; 
import ShareIcon from '@mui/icons-material/Share';
import OrganizeIcon from '@mui/icons-material/Sort'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit'; 

const DashboardFolder = ({ title, folder, onClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const truncateTitle = (title, maxLength = 7) => {
        if (title.length > maxLength) {
            return title.substring(0, maxLength - 3) + '..';
        }
        return title;
    };

    return (
        <Tooltip title={title} enterDelay={1000} leaveDelay={200}>
            <div className="bg-tertiary text-white flex items-center justify-center rounded-md w-min pl-3 hover:opacity-80 duration-300">
                <FolderIcon className='text-2xl'/>
                <span className='sm:mx-5 sm:w-24 text-lg font-semibold sm:mr-10 max-sm:mx-2'>{(title)}</span>
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
                <MenuItem onClick={handleClose} className="flex justify-between gap-5 text-tertiary">
                <EditIcon className="mr-2 text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>Rename</span>
                </MenuItem>
                <MenuItem onClick={handleClose} className="flex justify-between gap-5  text-tertiary">
                <ShareIcon className='text-tertiary' />  <span className='text-tertiary'>Share</span>
                </MenuItem>
                <MenuItem onClick={handleClose} className="flex justify-between gap-5 text-tertiary">
                <OrganizeIcon className='text-tertiary'/> <span className='text-tertiary'>Organize</span> 
                </MenuItem>
                <MenuItem onClick={handleClose} className="flex justify-between gap-5 text-tertiary">
                <DeleteIcon className='text-tertiary'/> <span className='text-tertiary'>Delete</span> 
                </MenuItem>
            </Menu>
            </div>
        </Tooltip>
    );
};

DashboardFolder.propTypes = {
    title: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default DashboardFolder;
