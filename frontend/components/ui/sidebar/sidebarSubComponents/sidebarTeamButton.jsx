import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';

const TeamSidebarItem = ({ team, isSelected = false, isExpanded = true }) => {
    const { name, imageUrl } = team;
    const itemClasses = isSelected ? "text-primary" : "text-unselected";
    const defaultImage = '/assets/images/imagenotFound.jpg';

    return (
        <Tooltip title={name} enterDelay={1000} leaveDelay={200}>
            <div className={`group flex items-center  my-2 transition-colors duration-200 cursor-pointer ${isExpanded ? "hover:bg-gray-200" : ""}`}>
                <img
                    src={defaultImage}
                    alt={name}
                    className="w-14 h-14 rounded-lg mr-2 group-hover:border-primary group-hover:border-2 border-solid border-transparent transition-all duration-200 ease-in-out"
                    />
              {isExpanded ?  <span
                    className={`text-md font-normal ${itemClasses} transition-all duration-500 ease-in-out`}
                    style={{
                        maxWidth: isExpanded ? "100%" : "0",
                        fontSize: isExpanded ? "1rem" : "0",
                        opacity: isExpanded ? 1 : 0,
                    }}
                >
                    {name}
                </span>: ""}
            </div>
        </Tooltip>
    );
};

TeamSidebarItem.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
    isSelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
};

export default TeamSidebarItem;
