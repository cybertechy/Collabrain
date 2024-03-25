import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const TeamChannelOptionsMenu = ({ teamName, onOptionSelect, isOwner, isAdmin }) => {
    const { t } = useTranslation('team');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (option) => {
        setAnchorEl(null);
        if (option) {
            onOptionSelect(option);
        }
    };

    return (
        <div className="text-primary bg-primary shadow-md py-2 font-poppins flex justify-around items-center w-full">
            <IconButton
                aria-label="team options"
                aria-controls="team-options-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="w-full flex justify-between"
                style={{ borderRadius: 0, justifyContent: 'space-around'}}
                onMouseEnter={() => isTTSEnabled && speak("Team Options button")} 
                onMouseLeave={stop}
                
            >
                <span className='text-basicallylight font-poppins text-lg'>{teamName}</span>
                <MoreVertIcon style={{ color: '#FFFFFF' }} fontSize='medium' />
            </IconButton>
            <Menu
                id="team-options-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{
                    'aria-labelledby': 'team-options-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {(isOwner || isAdmin) && (
                    <MenuItem onClick={() => handleClose('invite')}>
                        <ListItemIcon>
                            <GroupAddIcon style={{ color: '#30475E' }} />
                        </ListItemIcon>
                        <span className='text-primary'
                        onMouseEnter={() => isTTSEnabled && speak("Invite People button")} onMouseLeave={stop}>{t('invite')}</span> 
                    </MenuItem>
                )}
                {(isOwner || isAdmin) && (
                    <MenuItem onClick={() => handleClose('settings')}>
                        <ListItemIcon>
                            <SettingsIcon style={{ color: '#30475E' }} />
                        </ListItemIcon>
                        <span className='text-primary'
                        onMouseEnter={() => isTTSEnabled && speak("Team Settings button")} onMouseLeave={stop}>{t('team_settings')}</span>  
                    </MenuItem>
                )}
                {isOwner && (
                    <MenuItem onClick={() => handleClose('delete')}>
                        <ListItemIcon>
                            <DeleteIcon style={{ color: '#30475E' }} />
                        </ListItemIcon>
                        <span className='text-primary'
                        onMouseEnter={() => isTTSEnabled && speak("Delete Team button")} onMouseLeave={stop}>{t('del_team')}</span> 
                    </MenuItem>
                )}
                {!isOwner && (
                    <MenuItem onClick={() => handleClose('leave')}>
                        <ListItemIcon>
                            <ExitToAppIcon style={{ color: '#30475E' }} />
                        </ListItemIcon>
                        <span className='text-primary'
                        onMouseEnter={() => isTTSEnabled && speak("Leave Team button")} onMouseLeave={stop}>{t('leave_team')}</span> 
                    </MenuItem>
                )}
                {/* View Team Details - Available for all roles */}
                <MenuItem onClick={() => handleClose('viewDetails')}>
                    <ListItemIcon>
                        <InfoIcon style={{ color: '#30475E' }} />
                    </ListItemIcon>
                    <span className='text-primary'
                    onMouseEnter={() => isTTSEnabled && speak("View Team Details button")} onMouseLeave={stop}>{t('view_details')}</span>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default TeamChannelOptionsMenu;
