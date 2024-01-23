
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Tooltip}  from '@mui/material';

const DashboardNewFolder = ({onClick }) => {
    // TODO: onClick(folder);
    return (
        <Tooltip
            title={"New Folder"}
            enterDelay={1000}
            leaveDelay={200}
          
        >
        <div className="bg-tertiary flex items-center justify-center rounded-xl w-min  hover:opacity-80 duration-300">
            <IconButton color="inherit">
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

