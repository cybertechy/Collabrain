import React, { useState, useEffect } from 'react';
import { ArrowCircleUp, ArrowCircleDown, ChevronRight } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';
import { useRouter } from 'next/navigation'; 

const DashboardInfoBar = ({ sortName, setSortName, sortDate, setSortDate, isAscending, setIsAscending, currentPath }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter(); // Initialize useRouter

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

  // Split the currentPath by '/' and map each part with chevron icons and links
  const pathParts = currentPath.split('/');

  return (
    <div className="flex items-center justify-between bg-aliceBlue p-4 w-full drop-shadow-md mb-3">
      <div className="flex items-center">
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              // If it's the first part (MyBrain), link to /dashboard
              <p
                className='text-xl font-bold font-poppins text-primary cursor-pointer underline'
                onClick={() => router.push('/dashboard')}
              >
                {part}
              </p>
            ) : (
              // For other parts, link to /dashboard?path=${path}
              <p
                className='text-xl font-bold font-poppins text-primary cursor-pointer'
                onClick={() => router.push(`/dashboard?path=${pathParts.slice(0, index + 1).join('/')}`)}
              >
                {part}
              </p>
            )}
            {index < pathParts.length - 1 && <ChevronRight fontSize="large" className="text-primary mx-2" />}
          </React.Fragment>
        ))}
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
            onClick={() => toggleSortOrder('name')} // You can set a default sortBy value here
          />
        ) : (
          <ArrowCircleDown
            className="text-primary cursor-pointer"
            fontSize="large"
            onClick={() => toggleSortOrder('name')} // You can set a default sortBy value here
          />
        )}
      </div>
    </div>
  );
};

export default DashboardInfoBar;
