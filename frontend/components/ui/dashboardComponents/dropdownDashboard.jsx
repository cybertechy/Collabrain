import React, { useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';

const DropdownDashboard = ({ title, items, hasBorders = false }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const borderClasses = hasBorders ? 'border border-primary rounded' : '';
    const animationClass = isDropdownVisible ? 'dropdown-enter' : '';

    return (
        <div className={`relative ${borderClasses}`}> {/* Adjusted z-index here */}
            <button
                className="text-primary bg-transparent px-4 py-2 rounded-md flex items-center"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
                {title}
                <ArrowDropDown fontSize='medium'/>
            </button>
            {/* Dropdown Content */}
            {isDropdownVisible && (
                <div className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ${animationClass}`}> {/* Adjusted z-index here */}
                    {/* Dropdown Items */}
                    <ul className="py-2 z-50">
                        {items.map((item, index) => (
                            <li 
                                key={index} 
                                className="px-4 py-2 text-primary hover:bg-primary hover:text-white rounded-sm"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownDashboard;
