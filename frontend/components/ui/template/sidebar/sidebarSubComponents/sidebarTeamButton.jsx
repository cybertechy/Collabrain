import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import { useTTS } from "@/app/utils/tts/TTSContext";
import {getMedia} from '@/app/utils/storage'

const TeamSidebarItem = ({ team, isSelected , isExpanded = true }) => {

    const { speak, stop, isTTSEnabled } = useTTS();
    const { name, teamImageID , channels} = team;
    console.log("SIDEBAR TEAM",team);
    const [teamImage, setTeamImage] = useState(null);
    useEffect(() => {  
        const fetchAttachments = async () => {
            console.log("fetchAttachments");
          
            const imageData = await getMedia(teamImageID);
            if (imageData) {
              setTeamImage(imageData); // Directly use imageData, as getMedia returns response.data
            } else {
              console.error("Failed to fetch attachment or no data returned");
            }
          };
          
        if(teamImageID){
          fetchAttachments();
        }
    }
    , [teamImageID]);
    const itemClasses = isSelected ? "text-primary" : "text-unselected";
    const defaultImage = '/assets/images/imagenotFound.jpg';
    const selectedBorder = isSelected ? "border-primary border-2 border-solid" : "group-hover:border-primary group-hover:border-2";
    const generalChannel = channels.find(channel => channel.name === 'General');
    const generalChannelId = generalChannel ? generalChannel.channelId : '';

    const handleHover = () => {
        speak(`Team ${name}`);
    };

    const handleLeave = () => {
        stop();
    };

    return (
        <Tooltip title={name} enterDelay={1000} leaveDelay={200}>
            <Link href = {`chat?teamId=${team.teamId}&channelName=${"General"}`}>
            <div className={`group flex items-center  my-2 transition-colors duration-200 cursor-pointer ${isExpanded ? "hover:bg-gray-200" : ""} ${isSelected ? "bg-gray-200 rounded-lg" : ""}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}> 
                <img
                    src={teamImage?teamImage:defaultImage}
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
        teamImageID: PropTypes.string,
    }).isRequired,
    isSelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
};

export default TeamSidebarItem;
