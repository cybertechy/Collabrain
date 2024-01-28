import React, { useState, useEffect } from 'react';
import { MoreVert, Info, ArrowDropDown } from '@mui/icons-material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DropdownDashboard from './dropdownDashboard';


const DashboardInfoBar = (sortName, setSortName, sortDate, setSortDate) => {
    
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
  
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);


    return (
        <div className="flex items-center justify-between bg-gray-100 p-4 w-full drop-shadow-md mb-3">
            <div className="flex items-center">
                {/* Dropdown Component */}
                {/* {isOpen && windowWidth > 550 ?  */}
                (<p className='text-xl font-medium font-poppins text-primary'>My Brain</p>)
                {/* //  : (<></>)} */}
                
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