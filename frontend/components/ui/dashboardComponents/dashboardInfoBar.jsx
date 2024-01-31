import React, { useState, useEffect } from 'react';
import { MoreVert, Info, ArrowCircleUp, ArrowCircleDown } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';


const DashboardInfoBar = ({ sortName, setSortName, sortDate, setSortDate }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isAscending, setIsAscending] = useState(true); // Track the sorting order
  
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const toggleSortOrder = (sortBy) => {
        setIsAscending(!isAscending);
    
        if (sortBy === 'name') {
          setSortName(isAscending);
          setSortDate(false);
        } else if (sortBy === 'date') {
          setSortDate(isAscending);
          setSortName(false);
        }
      };
  
  

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
          items={[
            {
              name: "Name",
              onClick: () => {
                toggleSortOrder('name');
              },
            },
            {
              name: "Date Modified",
              onClick: () => {
                toggleSortOrder('date');
              },
            },
          ]}
        />
        {isAscending ? (
          <ArrowCircleUp
            className="text-primary cursor-pointer"
            fontSize="large"
            onClick={toggleSortOrder}
          />
        ) : (
          <ArrowCircleDown
            className="text-primary cursor-pointer"
            fontSize="large"
            onClick={toggleSortOrder}
          />
        )}
        {/* Three Dots Icon */}
      </div>
    </div>
  );
};

export default DashboardInfoBar;
