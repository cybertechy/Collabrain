import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/sidebar";
import Navbar from "./navbar/navbar";

const Template = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-white ">
         
        <div className="flex flex-grow overflow-hidden">
    {/* <div className="flex h-screen bg-gray-100 overflow-hidden"> */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} className="overflow-hidden"/>
      <>{
      ((isSidebarOpen) && (windowWidth < 550)) ? 
        (<div className="flex flex-col flex-grow overflow-hidden">
          <div className=" bg-purple-600 h-screen">

          </div>
        </div>)
        : (
      
      <div className="flex flex-col flex-grow overflow-hidden">
        <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* <div id="content" className="flex-grow flex flex-col items-center justify-center"> */}
          {children}
      </div>)
      }</>
        </div>
    </div>
  );
};

export default Template;
