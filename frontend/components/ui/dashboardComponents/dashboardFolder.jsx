
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const DashboardFolder = ({ title, folder, onClick }) => {
    // TODO: onClick(folder);
    return (
        <div className="bg-tertiary flex items-center justify-center rounded-xl w-min p-2 hover:opacity-80 duration-300">
            <IconButton color="inherit">
                <FolderIcon  fontSize="large" style={{ color: 'white' }} />
            </IconButton>
            <span className='mx-5 w-24 text-lg text-semibold mr-10'>{title}</span>
            <IconButton color="inherit">
                <MoreVertIcon  fontSize="large"/>
            </IconButton>
        </div>
    );
};

DashboardFolder.propTypes = {
    title: PropTypes.string,
    folder: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default DashboardFolder;

