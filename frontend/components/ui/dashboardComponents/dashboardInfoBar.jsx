import React, { useState, useEffect } from 'react';
import { ArrowCircleUp, ArrowCircleDown, ChevronRight } from '@mui/icons-material';
import DropdownDashboard from './dropdownDashboard';
import { useRouter } from 'next/navigation'; 
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import axios from 'axios';
const DashboardInfoBar = ({ currentPath, onSort, sortCriteria, moveProjectToPath }) => {
  const { speak, stop, isTTSEnabled } = useTTS();
  const { t } = useTranslation('dashboard');

  useEffect(() => {
    import('jquery').then(jQuery => {
        window.jQuery = window.$ = jQuery.default;
        require('../../../app/utils/tts/articulate');
    });
}, []);
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
      console.log("Navigating to ", part, index);
      const pathToNavigate = `/${pathParts.slice(1, index+1).join('/')}`;
      console.log("Path to navigate: ", pathToNavigate, "pathParts", pathParts)
      router.push(`/dashboard?path=${pathToNavigate}`);
    }
  };

  // Handling the drop event to move the project to the dropped path
  const handleDrop = (e, part, index) => {
    e.preventDefault();
    e.stopPropagation();

    const projectId = e.dataTransfer.getData("projectId");
    const type = e.dataTransfer.getData("type") === "Content Map" ? "contentMap": "documents";
    if (projectId) {
      if(index === 0 ){
        moveProjectToPath(projectId, "/", type);
      }else{
        const pathToNavigate = `/${pathParts.slice(1, index+1).join('/')}`;
        moveProjectToPath(projectId, pathToNavigate, type);
      }
     
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
              // className='text-xl font-bold font-poppins text-primary cursor-pointer underline'
              className='text-sm xs:text-xl font-bold font-poppins text-primary cursor-pointer underline'
              onClick={() => navigateToPath(part, index)}
              onMouseEnter={() => isTTSEnabled && speak("My Brain")}
              onMouseLeave={stop}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, part, index)}
            >
              {part}
            </p>
            {index < pathParts.length - 1 && <ChevronRight fontSize="large" className="text-primary mx-2" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center">
      <DropdownDashboard
          title={sortCriteria ? (sortCriteria.sortName ? t('sort_name') : t('sort_date')) : t('sort_by')}
          items={[
            { name: t('sort_name'), onClick: () => toggleSortOrder('name'), onMouseEnter: () => isTTSEnabled && speak("Sort by name"),
            onMouseLeave: stop, },
            { name: t('sort_date'), onClick: () => toggleSortOrder('date'), onMouseEnter: () => isTTSEnabled && speak("Sort by date modified"),
            onMouseLeave: stop, },
          ]}
          speak={speak}
          stop={stop}
          onMouseEnterTitle={() => isTTSEnabled && speak(sortCriteria.sortName ? "Sort files. Currently sorted by name." : "Sort files. Currently sorted by date modified.")}
          onMouseLeaveTitle={stop}
        />
        {sortCriteria.isAscending ? (
          <ArrowCircleUp className="text-primary cursor-pointer" fontSize="large" onClick={toggleAscending}
          onMouseEnter={() => isTTSEnabled && speak("Ascending Order")} onMouseLeave={stop}/>
        ) : (
          <ArrowCircleDown className="text-primary cursor-pointer" fontSize="large" onClick={toggleAscending}
          onMouseEnter={() => isTTSEnabled && speak("Descending Order")} onMouseLeave={stop}/>
        )}
      </div>
    </div>
  );
};

export default DashboardInfoBar;
