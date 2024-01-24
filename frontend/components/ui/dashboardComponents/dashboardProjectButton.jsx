import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem,  Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit'; // Icon for Rename
import ShareIcon from '@mui/icons-material/Share'; // Icon for Share
import SortIcon from '@mui/icons-material/Sort'; // Icon for Organize
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for Delete

const DashboardProjectButton = ({ title, project, type, color = "white", onClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const truncateTitle = (title, maxLength = 12) => {
        if (title.length > maxLength) {
            return title.substring(0, maxLength - 3) + '..';
        }
        return title;
    };
    const map = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
            <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .710-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.710.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clipRule="evenodd" />
        </svg>
    ); 

    const doc = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
        </svg>
    );

    return (
        <Tooltip
            title={title}
            enterDelay={1000}
            leaveDelay={200}
          
        >
        <div className="flex flex-col items-center justify-center bg-tertiary rounded-xl hover:opacity-80 duration-300 w-32 h-28 pt-3 pl-1">
            <div className="flex flex-col items-center justify-center h-full">
                {type === 'Document' ? doc() : map()}
                <div className="flex flex-row justify-between items-center w-full mt-2">
                    <span className="text-lg font-semibold">{truncateTitle(title)}</span>
                    <IconButton color="inherit" onClick={handleClick} className="ml-2">
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <EditIcon fontSize="small text-tertiary" className="mr-2 text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>Rename</span>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ShareIcon fontSize="small text-tertiary" className="mr-2  text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>Share</span> 
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <SortIcon fontSize="small text-tertiary" className="mr-2  text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>Organize</span>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <DeleteIcon fontSize="small text-tertiary" className="mr-2  text-tertiary flex justify-between gap-5" />
                    <span className='text-tertiary'>Delete</span>
                </MenuItem>
            </Menu>
        </div>
            </div>
        </div>
        </Tooltip>
    );
};

DashboardProjectButton.propTypes = {
    title: PropTypes.string,
    project: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default DashboardProjectButton;