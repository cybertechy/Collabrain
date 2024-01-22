import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const TeamOverlay = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("home");

  const switchToHome = () => setCurrentScreen("home");
  const switchToCreateTeam = () => setCurrentScreen("create");
  const switchToJoinTeam = () => setCurrentScreen("join");

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    modalVisible && (
      <div>
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-20 backdrop-blur-sm">
          {currentScreen === "home" && (
            <CreateJoinTeamScreen
              switchToCreateTeam={switchToCreateTeam}
              switchToJoinTeam={switchToJoinTeam}
              toggleModal={toggleModal}
            />
          )}
          {currentScreen === "create" && (
            <CreateTeamOverlay switchToHome={switchToHome} toggleModal={toggleModal} />
          )}
          {currentScreen === "join" && (
            <JoinTeamOverlay switchToHome={switchToHome} toggleModal={toggleModal} />
          )}
        </div>
      </div>
    )
  );
};


const CreateJoinTeamScreen = ({ switchToCreateTeam, switchToJoinTeam , toggleModal}) => {
  return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='w-2/4 h-3/5 shadow-lg bg-white rounded-md flex flex-col'> {/* Make sure this is a flex container with column direction */}
          <div className="flex justify-end">
          <button
  className='bg-transparent border-none text-25 cursor-pointer pr-2 mt-4 mr-4 text-black pt-2'
  onClick={toggleModal}
>
  <CloseIcon fontSize="large" />
</button>
          </div>
          <div className="inline-block text-center mt-7 flex-grow"> {/* flex-grow will make this div take up available space */}
            <p className="text-4xl block text-center text-black font-light">Create a team</p>
            <p className="text-xl text-center text-black mb-4 ml-20 mr-20 mt-10 font-light">Creating a team has never been simpler, you're only a few clicks away from your exclusive space.</p>
          </div>
          <div className="flex items-center mt-4 justify-center">
            <button className="w-96 h-16 mb-4 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            onClick={switchToCreateTeam}>Create a Team</button>
          </div>
          {/* Adjusted bottom part to stick to the bottom */}
          <div className="mt-auto flex flex-col items-center bg-purple-200 text-center p-4 w-full"> {/* mt-auto will push this div to the bottom */}
            <p className="text-3xl text-black font-medium font-poppins">Have an invite already?</p>
            <button className='w-80 h-12 mt-4 mb-4 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
            onClick={switchToJoinTeam}>Join a Team</button>
          </div>
        </div>
      </div>
  );
};



  
const CreateTeamOverlay = ({ switchToHome }) => {
  return (
    <div className="w-screen h-screen  flex items-center justify-center">
    <div className="w-full md:w-3/4 lg:w-2/4 shadow-lg bg-white rounded-md flex flex-col" style={{ maxHeight: '60%' }}> {/* Responsive width */}
      <div className="flex justify-end p-2 md:p-4"> {/* Responsive padding */}
        {/* Placeholder for Close Button if needed */}
      </div>
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-20"> {/* Responsive padding */}
        <p className="text-4xl font-light text-black">Customize your team</p>
          <p className="text-xl mb-2 text-black font-light">Give your team a nice snazzy name and an icon.</p>
          <div className="relative text-center my-8"> {/* Adjusted margin and upload button position */}
            <img className='h-24' src={'/assets/images/upload_icon.png'} alt='Upload Icon'/>
            <p className="text-purple-600 text-xs absolute inset-0 mt-10 mr-2 flex items-center justify-center">UPLOAD</p>
          </div>
          <div className="w-full">
            <label htmlFor="team-name" className="block pb-2 font-light text-black">Team Name</label>
            <input id="team-name" className="bg-gray-200 w-full h-16 px-4 mb-4" type='text' placeholder="Enter team name"/> {/* Increased height */}
          </div>
          <p className="text-xs font-light mb-8 text-black text-poppins">By creating a team, you agree to Collabrain's <b>Community Guidelines*</b></p> {/* Adjusted margin */}
        </div>
        <div className="bg-purple-200 p-6 w-full flex justify-between items-center"> {/* Adjusted padding and flex layout */}
          <button className="text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button className="w-24 h-12 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-md text-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Create</button>
        </div>
      </div>
    </div>
  );
};


  
const JoinTeamOverlay = ({ switchToHome }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-2/4 shadow-lg bg-white rounded-md flex flex-col" style={{ height: '60%' }}> {/* Match height with CreateTeamOverlay */}
        <div className="flex justify-end p-4"> {/* Adjusted padding to match CreateTeamOverlay */}
          {/* Placeholder for Close Button if needed */}
        </div>
        <div className="flex-grow flex flex-col items-center justify-center px-20"> {/* Center content vertically */}
          <p className="text-4xl font-medium font-poppins text-black block mb-4 text-center">Join a team</p>
          <p className="text-xl text-black text-center font-poppins font-light mb-4">Enter the invite details to join an existing team.</p>
          <div className="w-full mb-4 items-center justify-center flex flex-col"> {/* Adjusted margin */}
          
            <input id="invite-link" className="bg-gray-200 w-11/12 h-16 px-4 mb-2" type='url' placeholder="Enter invite link"/> {/* Matched height with CreateTeamOverlay */}
          </div>
          <div className='w-full px-4 sm:px-6 lg:px-8 mb-8'> {/* Adjusted margin */}
        
      <button className="h-20 w-full mt-5 max-w-screen-sm flex items-center justify-between focus:outline-none text-white bg-primary hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
        <div className="flex items-center space-x-4 pl-4">
        <img className="h-14" src={'/assets/images/link.png'} alt= 'image2'/>
          <div>
            <p className="text-xl text-left font-medium">Don't have an invite?</p>
            <p className="text-sm">Check out public teams in the discovery</p>
          </div>
        </div>
        <div className="pr-4">
        <img className="h-6 " src={'/assets/images/arrow.png'} alt= 'image3'/> 
        </div>
      </button>
  
          </div>
        </div>
        <div className="bg-purple-200 p-6 w-full flex justify-between items-center"> {/* Adjusted padding to match CreateTeamOverlay */}
          <button className="text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button className="w-24 h-12 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-md text-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Join</button>
        </div>
      </div>
    </div>
  );
};

  
  export default TeamOverlay;