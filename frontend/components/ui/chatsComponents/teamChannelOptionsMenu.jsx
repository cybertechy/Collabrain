import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const TeamChannelOptionsMenu = ({ teamName, onOptionSelect }) => {
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
                <MenuItem onClick={() => handleClose('invite')}>
                    <ListItemIcon>
                        <GroupAddIcon style={{ color: '#30475E' }} />
                    </ListItemIcon>
                   <span className='text-primary'>Invite People</span> 
                </MenuItem>
                <MenuItem onClick={() => handleClose('settings')}>
                    <ListItemIcon>
                        <SettingsIcon style={{ color: '#30475E' }} />
                    </ListItemIcon>
                    <span className='text-primary'>Team Settings</span>  
                </MenuItem>
                <MenuItem onClick={() => handleClose('leave')}>
                    <ListItemIcon>
                        <ExitToAppIcon style={{ color: '#30475E' }} />
                    </ListItemIcon>
                    <span className='text-primary'>Leave Team</span> 
                </MenuItem>
                {/* You can add more options with icons here as needed */}
            </Menu>
        </div>
    );
};

export default TeamChannelOptionsMenu;
