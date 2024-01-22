
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const DashboardNewFolder = ({onClick }) => {
    // TODO: onClick(folder);
    return (
        <div className="bg-tertiary flex items-center justify-center rounded-xl w-min  hover:opacity-80 duration-300">
            <IconButton color="inherit">
                <AddCircleIcon  fontSize="large" style={{ color: 'white' }} />
            </IconButton>
        </div>
    );
};

DashboardNewFolder.propTypes = {
   
    onClick: PropTypes.func.isRequired,
};

export default DashboardNewFolder;

