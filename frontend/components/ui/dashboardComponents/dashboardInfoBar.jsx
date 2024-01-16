import React, { useState } from 'react';
import { MoreVert, Info, ArrowDropDown } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';
const DashboardInfoBar = () => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-4 w-full drop-shadow-md mb-3">
            <div className="flex items-center">
                {/* Dropdown Component */}
                <DropdownDashboard 
                    title="My Brain"
                    items={["Item 1", "Item 2", "Item 3"]}
                />
            </div>
            <div className="flex items-center">
                {/* Information Icon */}
                <Info className="text-primary mr-4" fontSize="large" />
                {/* Three Dots Icon */}
                <MoreVert className="text-primary" fontSize="large" />
            </div>
        </div>
    );
};

export default DashboardInfoBar;