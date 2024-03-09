import React, { useState, useEffect } from 'react';
import { ArrowCircleUp, ArrowCircleDown, ChevronRight } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';
import { useRouter } from 'next/navigation'; 

const DashboardInfoBar = ({ currentPath, onSort, sortCriteria}) => {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter();

  // This function is triggered when sort order (ascending/descending) is toggled
  const toggleAscending = () => {
      onSort({ ...sortCriteria, isAscending: !sortCriteria.isAscending });
  };

  // Toggle sort criteria between name and date
  const toggleSortOrder = (criteria) => {
      if (criteria === 'name') {
          onSort({ sortName: true, sortDate: false, isAscending: sortCriteria.isAscending });
      } else if (criteria === 'date') {
          onSort({ sortName: false, sortDate: true, isAscending: sortCriteria.isAscending });
      }
  };

  const pathParts = currentPath.split('/').filter(part => part);


  return (
    <div className="flex items-center justify-between bg-aliceBlue p-4 w-full drop-shadow-md mb-3">
      <div className="flex items-center">

      {pathParts.map((part, index) => (
  <React.Fragment key={index}>
    {index === 0 ? (
      <p
        className='text-sm xs:text-xl font-bold font-poppins text-primary cursor-pointer underline'
        onClick={() => router.push('/dashboard')}
      >
        {part}
      </p>
    ) : (
      <p
        className='text-xl font-bold font-poppins text-primary cursor-pointer'
        onClick={() => router.push(`/dashboard?path=/${pathParts.slice(1, index + 1).join('/')}`)}
        // Use pathParts.slice(1, index + 1) to include "MyBrain" as the initial slash
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
                    title={sortCriteria? sortCriteria.sortName ? "Name" : "Date Modified" : "Sort By"}
                    items={[
                        {
                            name: "Name",
                            onClick: () => toggleSortOrder('name'),
                        },
                        {
                            name: "Date Modified",
                            onClick: () => toggleSortOrder('date'),
                        },
                    ]}
                />
                {sortCriteria.isAscending ? (
                    <ArrowCircleUp className="text-primary cursor-pointer" fontSize="large" onClick={toggleAscending} />
                ) : (
                    <ArrowCircleDown className="text-primary cursor-pointer" fontSize="large" onClick={toggleAscending} />
                )}
            </div>
        </div>
  );
};

export default DashboardInfoBar;
