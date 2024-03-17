import React from 'react';
import { ArrowCircleUp, ArrowCircleDown, ChevronRight } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const DashboardInfoBar = ({ currentPath, onSort, sortCriteria, moveProjectToPath }) => {
  const router = useRouter();

  const toggleAscending = () => {
    onSort({ ...sortCriteria, isAscending: !sortCriteria.isAscending });
  };

  const toggleSortOrder = (criteria) => {
    if (criteria === 'name') {
      onSort({ sortName: true, sortDate: false, isAscending: sortCriteria.isAscending });
    } else if (criteria === 'date') {
      onSort({ sortName: false, sortDate: true, isAscending: sortCriteria.isAscending });
    }
  };

  const pathParts = currentPath.split('/').filter(part => part);

  const navigateToPath = (part, index) => {
    if (part === 'Shared with Me') {
      router.push('/shared-with-me');
    } else if (index === 0) {
      router.push('/dashboard');
    } else {
      const pathToNavigate = `/${pathParts.slice(0, index + 1).join('/')}`;
      router.push(`/dashboard?path=${pathToNavigate}`);
    }
  };

  // Handling the drop event to move the project to the dropped path
  const handleDrop = (e, dropPath) => {
    e.preventDefault();
    e.stopPropagation();

    const projectId = e.dataTransfer.getData("projectId");
    if (projectId) {
      moveProjectToPath(projectId, dropPath);
    }
  };

  // Allowing the drop by preventing the default behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-between bg-aliceBlue p-4 w-full drop-shadow-md mb-3">
      <div className="flex items-center">
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            <p
              className='text-xl font-bold font-poppins text-primary cursor-pointer underline'
              onClick={() => navigateToPath(part, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, `/${pathParts.slice(0, index + 1).join('/')}`)}
              draggable
            >
              {part}
            </p>
            {index < pathParts.length - 1 && <ChevronRight fontSize="large" className="text-primary mx-2" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center">
        <DropdownDashboard
          title={sortCriteria ? (sortCriteria.sortName ? "Name" : "Date Modified") : "Sort By"}
          items={[
            { name: "Name", onClick: () => toggleSortOrder('name') },
            { name: "Date Modified", onClick: () => toggleSortOrder('date') },
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
