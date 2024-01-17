import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import PsychologyIcon from '@mui/icons-material/Psychology';

const DashboardProjectButton = ({ title, project, type, onClick, imageSrc }) => {
    // TODO: onClick(folder);
    return (
        <div className = "bg-tertiary flex items-center justify-center flex-col rounded-xl hover:opacity-80 duration-300">
            <div className="flex items-center justify-center w-min h-min p-2 ">
                
                    {type == 'Document' ? <DescriptionIcon fontSize="large"/> : <PsychologyIcon fontSize="large"/>}
             
                <span className='mx-5 w-24 text-lg text-semibold mr-10'>{title}</span>
                <IconButton color="inherit">
                    <MoreVertIcon className = "pl-1"  fontSize="large"/>
                </IconButton>
            </div>  
            <div className = "items-center justify-center w-64 h-64 px-2">
                <img src={imageSrc} alt={title} />
            </div>
        </div>
    );
};

DashboardProjectButton.propTypes = {
    title: PropTypes.string,
    project: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    imageSrc: PropTypes.string.isRequired,
};

export default DashboardProjectButton;
