"use client";

import React, { useEffect, useState, useRef } from 'react';
import Template from '@/components/ui/template/template';
import UploadButton from '@/components/ui/button/uploadButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import PlusIcon from '@mui/icons-material/Add';
// import TeamSidebarItem from '@/components/ui/template/sidebar/sidebarSubComponents/sidebarTeamButton';
import { useRouter } from 'next/navigation';

// import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

const TeamItem = ({ team }) => {
  const { name, imageUrl, channels } = team;
  // const itemClasses = isSelected ? "text-primary" : "text-unselected";
  const defaultImage = '/assets/images/imagenotFound.jpg';
  // const selectedBorder = isSelected ? "border-primary border-2 border-solid" : "group-hover:border-primary group-hover:border-2";
  const generalChannel = channels.find(channel => channel.name === 'General');
  const generalChannelId = generalChannel ? generalChannel.channelId : '';
  return (
    <Tooltip title={name} enterDelay={1000} leaveDelay={200}>
      <Link href={`chat?teamId=${team.teamId}&channelName=${"General"}`}>
        <div className={`flex flex-row items-center my-2 transition-colors duration-200 cursor-pointer hover:bg-gray-200 `}>
          <img
            src={
              // imageUrl ? imageUrl : 
              defaultImage}
            alt={name}
            className={`w-14 h-14 rounded-lg mr-2 transition-all duration-200 ease-in-out`}
          />
          <span
            className={`text-md font-normal transition-all duration-500 ease-in-out text-black`}
          >
            {name}
          </span>
        </div>
      </Link>
    </Tooltip>
  );
};

TeamItem.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired
};
TeamItem;


const ProfilePage = () => {
  const axios = require("axios");
  const fb = require("_firebase/firebase");
  const socket = require("_socket/socket");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isNameEditMode, setIsNameEditMode] = useState(false);
  const [isEmailEditMode, setIsEmailEditMode] = useState(false);
  const [user, loading] = fb.useAuthState();
  const [isBioEditMode, setIsBioEditMode] = useState(false);
  const [isEduEditMode, setIsEduEditMode] = useState(false);
  const [isLCEditMode, setIsLCEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [userInfo, setUserInfo] = useState({ data: { username: "User" } });
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', startYear: '', endYear: '' });
  const [newCert, setNewCert] = useState({ title: '', date: '' });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //     // let sockCli = useRef(null);
  const handleNameEditClick = () => {
    setIsNameEditMode(!isNameEditMode);
  };

  const handleEmailEditClick = () => {
    setIsEmailEditMode(!isEmailEditMode);
  };

  const handleBioEditClick = () => {
    setIsBioEditMode(!isBioEditMode);
  };


  //add user entries to a list
  const addEducation = () => {
    if (newEdu.school && newEdu.degree && newEdu.startYear && newEdu.endYear) {
      setEducation([...education, newEdu]);
      setNewEdu({ school: '', degree: '', startYear: '', endYear: '' });
    }
    setIsEduEditMode(false);
  };

  const addCertification = () => {
    if (newCert.title && newCert.date) {
      setCertifications([...certifications, newCert]);
      setNewCert({ title: '', date: '' });
    }
    setIsLCEditMode(false);
  };

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await fb.getToken();
        const response = await axios.get(`http://localhost:8080/api/users/${user.uid}`, {
          headers: { "Authorization": "Bearer " + token }
        });
        setUsername(response.data.username);
        setName(response.data.fname + " " + response.data.lname);
        setEmail(response.data.email);
        if (response.status === 200) {
          // Set user info with the data obtained from the response
          const newPath = `/profile?username=${response.data.username}`;
          router.push(newPath);
        } else {
          setError('Failed to display content');
        }
      } catch (error) {
        setError('Error displaying profile');
        console.error('Error:', error);
        setUsername("username");
        setName("name");
        setEmail("email");
        setUserInfo({ data: { username: "User" } });
      } finally {
        console.log('Displaying profile.');
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const [userTeams, setUserTeams] = useState(null);

  useEffect(() => {
    const fetchUserTeams = async () => {
      setIsLoading(true);
      setError(null);


      try {
        // Make a GET request to retrieve user's team IDs
        const token = await fb.getToken();
        const response = await axios.get('http://localhost:8080/api/teams', {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with the actual auth token
          },
        });

        // Check if the request was successful
        if (response.status === 200) {
          const teamIds = response.data;

          // Create an array of promises to fetch team information
          const teamPromises = teamIds.map(async (teamId) => {
            const teamResponse = await axios.get(`http://localhost:8080/api/teams/${teamId}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Replace with the actual auth token
              },
            });

            // Check if the request for team information was successful
            if (teamResponse.status === 200) {
              // Merge teamId with the team data
              return {
                teamId,
                ...teamResponse.data
              };
            } else {
              console.error('Failed to fetch team information:', teamResponse.statusText);
              return null;
            }
          });

          // Use Promise.all to wait for all promises to resolve
          const teamsData = await Promise.all(teamPromises);

          // Filter out any null values (failed requests)
          const filteredTeamsData = teamsData.filter((teamInfo) => teamInfo !== null);

          // Update the userTeams state with the array of team information
          setUserTeams(filteredTeamsData);
          console.log(filteredTeamsData);
        } else {
          throw new Error('Failed to fetch user teams');
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
        // You can handle errors and provide user feedback here
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function to fetch user teams when the component mounts
    fetchUserTeams();
  }, []);

  return (
    <Template>
      <div
        className="p-4 container focus:outline-none focus:border-primary text-gray-500">
        <h2 className="text-lg font-bold text-tertiary text-left font-poppins"> Edit your information here @{username}</h2>
      </div>
      <div className="container mx-auto px-4 pt-8 2xl:w-5/6">
        <div className="flex flex-col space-x-4 md:flex-row 2xl:space-x-4 mb-6 max-md:space-y-4 max-md:space-x-0">
          {/* Profile card */}
          <div className="bg-white rounded-lg p-4 md:mb-0 border border-primary border-opacity-30 shadow-sm">
            <div className="text-center">
              <div className="mb-4">
                <UploadButton
                  onUpload={(file) => {
                    console.log('File uploaded:', file);
                  }}
                />
              </div>
              <div className='relative mb-4 flex items-center ml-6'>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className={`bg-white text-lg font-bold text-center border-0 p-2 w-full text-black ${isNameEditMode && 'border-2 rounded-lg'}`}
                  disabled={!isNameEditMode}
                />
                {isNameEditMode ?
                  <SaveIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleNameEditClick} />
                  :
                  <EditIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleNameEditClick} />}
              </div>
              <div className='relative mb-4 flex items-center ml-6'>
                <input
                  type="text"
                  placeholder="Enter your updated email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={`bg-white text-lg text-center border-0 w-full text-black ${isEmailEditMode && 'border-2 rounded-lg'}`}
                  disabled={!isEmailEditMode}
                />
                {isEmailEditMode ?
                  <SaveIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleEmailEditClick} />
                  :
                  <EditIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleEmailEditClick} />}
              </div>
              {/* <p className="text-lg text-black">{email}</p>  */}
            </div>
          </div>

          {/* Biography Section */}
          <div className="rounded-lg p-4 flex-1 md:w-2/3 border border-primary border-opacity-30 shadow-sm">
            <div className='flex items-center mb-4'>
              <h3 className="font-bold text-lg text-black">Biography</h3>
              {isBioEditMode ?
                <SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={handleBioEditClick} />
                :
                <EditIcon className={`text-primary ml-auto cursor-pointer`} onClick={handleBioEditClick} />}
            </div>
            <TextareaAutosize
              minRows={3}
              style={{ width: '100%', height: '80%', resize: 'none' }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border p-2 b-2 rounded-md focus:outline-none focus:border-primary text-black"
              placeholder="Your biography here"
              disabled={!isBioEditMode}
            />
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="rounded-lg p-4 mb-6 flex flex-col w-full md:w-1/2 border border-primary border-opacity-30 shadow-sm h-min">
            <div className='flex items-center'>
              <h3 className="font-bold text-lg text-black pb-2">Education</h3>
              {isEduEditMode ?
                <SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={addEducation} />
                :
                <PlusIcon className={`text-primary ml-auto cursor-pointer`} onClick={() => setIsEduEditMode(true)} />}
              {/* Education details */}
            </div>
            {isEduEditMode ? (
              <div className='flex flex-col'>
                {/* Input fields for education details */}
                <input
                  type="text"
                  value={newEdu.school}
                  onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                  className="mt-2 p-2 border-2 rounded text-tertiary"
                  placeholder="School name..."
                />
                <input
                  type="text"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="mt-2 p-2 border-2 rounded text-tertiary"
                  placeholder="Degree..."
                />
                {/* Inputs for start and end year */}
                <div className="flex flex-auto space-x-4 items-center">
                  <input
                    type="number"
                    value={newEdu.startYear}
                    onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                    className="mt-2 p-2 w-3/4 border-2 rounded text-tertiary"
                    placeholder="Start Year..."
                    min="1900"
                    step="1" //whole numbers
                  />
                  <h4 className='text-tertiary pt-2'> - </h4>
                  <input
                    type="number"
                    value={newEdu.endYear}
                    onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                    className="mt-2 p-2 w-3/4 border-2 rounded text-tertiary"
                    placeholder="End Year..."
                    min="1900"
                    step="1"
                  />
                </div>
              </div>
            ) : (
              <>
                <ul className='text-tertiary'>
                  {education.map((edu, index) => (
                    <li key={index}>
                      <hr className="border-t-1 mx-1 border-solid border-gray-400 opacity-30 py-1"></hr>
                      <i>{edu.degree}</i> from <i>{edu.school}</i> ({edu.startYear} - {edu.endYear})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {/* </div> */}
          </div>


          <div className="rounded-lg p-4 mb-6 flex flex-col w-full md:w-1/2 border border-primary border-opacity-30 shadow-sm h-min">
            <div className='flex items-center'>
              <h3 className="font-bold text-lg text-black pb-2">Licenses & Certifications</h3>
              {isLCEditMode ?
                <SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={addCertification} />
                :
                <PlusIcon className={`text-primary ml-auto cursor-pointer`} onClick={() => setIsLCEditMode(true)} />}
              {/* Certifications list */}
            </div>
            {isLCEditMode ? (
              <div className='flex flex-col'>
                {/* Input fields for certification details */}
                <input
                  type="text"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="mt-2 p-2 border-2 rounded text-tertiary"
                  placeholder="Certification title..."
                />
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="mt-2 p-2 border-2 rounded text-tertiary"
                  placeholder="Date obtained..."
                />
              </div>
            ) : (
              <ul className='text-tertiary'>
                {certifications.map((cert, index) => (
                  <li key={index}>
                    <hr className="border-t-1 mx-1 border-solid border-gray-400 opacity-30 py-1"></hr>
                    <i>- {cert.title}</i>, obtained on {cert.date}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={`rounded-lg p-4 flex flex-col w-1/2 md:w-full border border-primary border-opacity-30 shadow-sm`}>
          <h3 className="font-bold text-lg text-black pb-2">Your Teams</h3>
          {userTeams ? userTeams?.map((team, index) => (
            <TeamItem key={index} team={team}
              onClick={router.forward(`chat?teamId=${team.teamId}`)}
            />
          )) : null}
        </div>
      </div>
    </Template>
  );
};

export default ProfilePage;
