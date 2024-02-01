import React, { useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';

const DropdownDashboard = ({ title, items, hasBorders = false }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const borderClasses = hasBorders ? 'border border-primary rounded' : '';
    const animationClass = isDropdownVisible ? 'dropdown-enter' : '';

    return (
        <div className={`relative ${borderClasses}`}> {/* Adjusted z-index here */}
            <button
                className="text-primary text-lg bg-transparent px-4 py-2 rounded-md flex items-center"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
                {title}
                <ArrowDropDown fontSize='medium'/>
            </button>
            {/* Dropdown Content */}
            {isDropdownVisible && (
                <div className={`absolute left-0 mt-2 w-auto bg-basicallylight rounded-md shadow-lg z-50 ${animationClass}`}> {/* Adjusted z-index here and set width to auto */}
                    {/* Dropdown Items */}
                    <ul className="py-1 z-50"> {/* Adjusted padding */}
                        {items.map((item, index) => (
                            <li 
                                key={index} 
                                onClick = {item.onClick}
                                className="px-1 py-1 text-primary hover:bg-primary hover:text-basicallylight rounded-sm" /* Adjusted padding */
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
