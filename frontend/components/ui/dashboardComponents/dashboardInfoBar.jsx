import React, { useState } from 'react';
import { MoreVert, Info, ArrowDropDown } from '@mui/icons-material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DropdownDashboard from './dropdownDashboard';
const DashboardInfoBar = (sortName, setSortName, sortDate, setSortDate) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-4 w-full drop-shadow-md mb-3">
            <div className="flex items-center">
                {/* Dropdown Component */}
                <p className='text-xl font-medium font-poppins text-primary'>My Brain</p>
            </div>
            <div className="flex items-center">
            <DropdownDashboard 
                    title="Sort By"
                    items={[{name: "Name", onClick(){setSortName(true) ;setSortDate(false)}}, {name: "Date Modified", onClick(){setSortName(false) ;setSortDate(true)}}]}
                />
                {/* Information Icon */}
                <ArrowCircleUpIcon className="text-primary mr-4" fontSize="large" />
                {/* Three Dots Icon */}
               
            </div>
        </div>
    );
};

export default DashboardInfoBar;