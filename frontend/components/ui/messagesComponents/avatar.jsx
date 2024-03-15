import React from 'react';
import Avatar from '@mui/material/Avatar';

function CustomAvatar({ username = "User"}) {
    function stringToColor(string = "User") {
        let hash = 0;
        let i;

        // Convert string to hash
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Convert hash to color
        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        // Check if color is too light
        if (isColorLight(color)) {
            // If color is light, return a dark color or adjust the color as needed
            return { backgroundColor: color, color: '#000' }; // light color background, dark text
        } else {
            // If color is dark, return it with a light text color
            return { backgroundColor: color, color: '#fff' }; // dark color background, light text
        }
    }

    function isColorLight(color) {
        const hex = color.replace('#', '');
        const c_r = parseInt(hex.substr(0, 2), 16);
        const c_g = parseInt(hex.substr(2, 2), 16);
        const c_b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
        return brightness > 155; // Brightness threshold, adjust if needed
    }

    const initials = username?.split(' ')
        .map(word => word[0] ? word[0].toUpperCase() : '') // Capitalize the first letter of each word
        .join('');

    const avatarStyle = {
        ...stringToColor(username),
    };

    return (
        <Avatar sx={avatarStyle}>
            {initials}
        </Avatar>
    );
}

export default CustomAvatar;
