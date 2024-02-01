import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

const TeamSidebarItem = ({ team, isSelected , isExpanded = true }) => {
    const { name, imageUrl , channels} = team;
    const itemClasses = isSelected ? "text-primary" : "text-unselected";
    const defaultImage = '/assets/images/imagenotFound.jpg';
    const selectedBorder = isSelected ? "border-primary border-2 border-solid" : "group-hover:border-primary group-hover:border-2";
    const generalChannel = channels.find(channel => channel.name === 'General');
    const generalChannelId = generalChannel ? generalChannel.channelId : '';
    return (
        <Tooltip title={name} enterDelay={1000} leaveDelay={200}>
            <Link href = {`chat?teamId=${team.teamId}&channelId=${generalChannelId}`}>
            <div className={`group flex items-center  my-2 transition-colors duration-200 cursor-pointer ${isExpanded ? "hover:bg-gray-200" : ""} ${isSelected ? "bg-gray-200 rounded-lg" : ""}`}>
                <img
                    src={defaultImage}
                    alt={name}
                    className={`w-14 h-14 rounded-lg mr-2  ${selectedBorder} transition-all duration-200 ease-in-out`}
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
            </Link>
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