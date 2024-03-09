import React, { useState, useEffect, useRef } from 'react';
import { ArrowDropDown } from '@mui/icons-material';

const DropdownDashboard = ({ title, items, hasBorders = false,  dropdownZIndex = 50  }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Ref for the dropdown to handle click outside

    const borderClasses = hasBorders ? 'border border-primary rounded' : '';

    // Listen for clicks outside of the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${borderClasses}`} style={{ zIndex: dropdownZIndex }}>
        <button
                className="text-primary text-sm xs:text-lg bg-transparent px-4 py-2 rounded-md flex items-center"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
                {title}
                <ArrowDropDown fontSize='medium'/>
            </button>
            {isDropdownVisible && (
                <div className="absolute left-0 mt-2 w-auto bg-basicallylight rounded-md shadow-lg z-50 opacity-100"> {/* Ensure the menu is fully opaque and on top of other components */}
                    <ul className="py-1">
                        {items.map((item, index) => (
                            <li 
                                key={index} 
                                onClick={() => { 
                                  item.onClick();
                                  setIsDropdownVisible(false); // Close the dropdown when an option is clicked
                                }}
                                className="px-4 py-2 text-primary hover:bg-primary hover:text-basicallylight rounded-sm cursor-pointer"
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownDashboard;
