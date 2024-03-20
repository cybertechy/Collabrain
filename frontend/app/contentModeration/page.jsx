"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
const { useAuthState, getToken } = require("_firebase/firebase");
import Template from '@/components/ui/template/template';
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const Overlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur  z-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2  text-black"
        >
          <CloseIcon />
        </button>
        <p className='text-lg text-black font-medium pb-2'>Community Guidelines</p>
        <div className="w-11/12 pt-2 h-20 border-t-2 border-gray-200">
          <ul className="list-disc pl-5">
            <li>If user violates this policy again within 30 days of receiving a warning, then they will get a strike.</li>
            <li>They won't be able to do things like upload, text, or call for a week.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Moderation = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportedUsersCount, setReportedUsersCount] = useState(0);
  const [user, loading] = useAuthState();
  const [dataLoading, setdataLoading] = useState(false);


  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const openOverlay = () => {
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  useEffect(() => {
    const fetchReports = async () => {
      const token = await getToken();
      if (!token) return;
      try {
        setdataLoading(true);
        const response = await axios.get(SERVERLOCATION + '/api/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReports(response.data);
        console.log(response.data);
        const count = response.data.length;
        setReportedUsersCount(count);
        setdataLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setdataLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  // {("ChatID: "+report.chatID) || ("TeamID:"+report.teamID)}
  return (
    <Template>
      <div className="">
        <p className="text-3xl pt-8 pl-10 font-medium text-primary">Content Moderation</p>
        <div className="flex pt-10">
          <div className="w-7/12 h-48 ml-10 border-gray-200 border-2 bg-white rounded-md drop-shadow-md">
            <div className="flex pt-5 pl-5 pb-2 gap-2 ">
              <WarningAmberIcon className="text-red-500 h-24 w-24" />
              <p className="font-medium text-xl text-primary ">Warning!</p>
            </div>
            <div className="ml-5 p-2 w-11/12 h-20 border-t-2 border-gray-200">
              <ul className="list-disc pl-3 text-primary">
                <li>Users content was removed due to violation of our community guidelines</li>
                <li><button onClick={openOverlay} className="text-blue-500 underline mt-2">View Community Guidelines</button></li>
              </ul>
            </div>
          </div>
          <div className="w-4/12 ml-5 h-48 border-gray-200 border-2 bg-white rounded-md drop-shadow-md ">
            <div className="flex pt-5 pl-5 pb-2 gap-2">
            </div>
            <div className="pl-5 text-primary">
              <p className=" pb-2 text-xl font-medium ">Number of Users Reported</p>

              <div className="w-11/12 pt-2 h-20 border-t-2 border-gray-200">
                <div className='flex justify-center pt-4'>
                  <p className="font-medium text-6xl text-center">{reportedUsersCount}</p>
                  <p className=" pt-7 pl-2 text-lg">Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex pl-10 pt-6 ">
          <div className="gap-1 border-gray-200 border-2 bg-white rounded-md drop-shadow-md w-full text-primary mr-12">
            <div className="border-gray-200 w-11/12 ml-8 py-2 border-b-2 ">
              <p className="font-semibold text-lg pt-2">Reported Users </p>
            </div>
            <div className="grid grid-cols-4 w-11/12 py-2 ml-8 border-b-2 border-gray-200" style={{ overflow: 'auto', maxHeight: '400px' }}>
              <p className="font-medium">Username</p>
              <p className="font-medium pl-4">Content</p>
              <p className="font-medium pl-8">Policy</p>
              <p className="font-medium pl-12">Date</p>
            </div>
            <div className="pl-8 pr-16 pb-5 pt-2" style={{ overflow: 'auto', maxHeight: '400px' }}>
              {dataLoading && <p className='animate-pulse text-center text-lg font-semibold p-3'>Loading Data...</p>}
              {reports.map((report, index) => (
                <div key={index} className="grid grid-cols-4 w-full py-2  border-b-2 border-gray-200">
                  <p className="font-light">{report.sender} <br></br> <span className='text-xs'>Reported by: {report.reporter}</span></p>
                  <p className="font-light pl-4">{
                    (report.message) ? report.message : <span > <image src={report.image} alt="Violation Image"></image></span>
                  }</p>
                  <p className="font-light pl-8">{report.policy}</p>
                  <p className="font-light pl-12">{(new Date(report.date._seconds * 1000 + report.date._nanoseconds / 1000000)).toLocaleString()}</p>
                  <div className="col-span-4 mt-2">
                    <button
                      className="text-blue-500 underline ml-72 text-xs"
                      onClick={() => toggleDropdown(index)}
                    >
                      {openIndex === index ? 'Hide Details' : 'View Details'}
                    </button>
                    {openIndex === index && (
                      <div className="mt-2 ml-72 py-2 ">
                        <p className="font-medium">Violation Details:</p>
                        <ul className="list-disc pl-5">
                          {report.teamId && <li>Team Name: {report.team}</li>}
                          {report.teamId && <li>Team Id: {report.teamId}</li>}
                          {report.chatID && <li>Chat Id: {report.chatID}</li>}
                          {report.reason && <li>Reason: {report.reason}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Overlay isOpen={isOverlayOpen} onClose={closeOverlay} />
    </Template>
  );
};

export default Moderation;
