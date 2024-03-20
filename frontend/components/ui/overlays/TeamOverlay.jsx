import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import UploadButton from "../button/uploadButton";
import axios from "axios";
import fb from "../../../app/_firebase/firebase";
import { FileVideo } from "lucide-react";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const TeamOverlay = ({ toggleModal, modalVisible }) => {

  // const [modalVisible, setModalVisible] = useState(true); // Set to false initially
  const [currentScreen, setCurrentScreen] = useState("home");

  const switchToHome = () => setCurrentScreen("home");
  const switchToCreateTeam = () => setCurrentScreen("create");
  const switchToJoinTeam = () => setCurrentScreen("join");

  // const toggleModal = () => {
  //   setModalVisible(!modalVisible);
  // };

  return (
    modalVisible && (
      <div>
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-basicallylight bg-opacity-20 backdrop-blur-sm">
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
        <div className='w-2/4 h-3/5 shadow-lg bg-basicallylight rounded-md flex flex-col'> {/* Make sure this is a flex container with column direction */}
          <div className="flex justify-end">
          <button
  className='bg-transparent border-none text-25 cursor-pointer pr-2 mt-4 mr-4 text-basicallydark pt-2'
  onClick={toggleModal}
>
  <CloseIcon fontSize="large" />
</button>
          </div>
          <div className="inline-block text-center mt-7 flex-grow"> {/* flex-grow will make this div take up available space */}
            <p className="text-4xl block text-center text-basicallydark font-light">Create a team</p>
            <p className="text-xl text-center text-basicallydark mb-4 ml-20 mr-20 mt-10 font-light">Creating a team has never been simpler, you're only a few clicks away from your exclusive space.</p>
          </div>
          <div className="flex items-center mt-4 justify-center">
            <button className="w-96 h-16 mb-4 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary font-medium rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
            onClick={switchToCreateTeam}>Create a Team</button>
          </div>
          {/* Adjusted bottom part to stick to the bottom */}
          <div className="mt-auto flex flex-col items-center bg-secondary text-center p-4 w-full"> {/* mt-auto will push this div to the bottom */}
            <p className="text-3xl text-basicallydark font-medium font-poppins">Have an invite already?</p>
            <button className='w-80 h-12 mt-4 mb-4 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary font-medium rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary'
            onClick={switchToJoinTeam}>Join a Team</button>
          </div>
        </div>
      </div>
  );
};



  
const CreateTeamOverlay = ({ switchToHome , toggleModal}) => {
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const [teamName, setTeamName] = useState('');
  const [visibility, setVisibility] = useState('public'); // Default to 'public'

  const handleUpload = async (file,  fileType) => {
    
      setImage(file); // reader.result contains the base64 string
      setImageType(fileType)
  };

  const handleCreateTeam = async () => {
    try {
        if (!teamName.trim()) {
            throw new Error('Team name cannot be empty');
        }

        // Prepare the data for the request
        const teamData = {
            name: teamName,
            image: image, // This now includes the base64 image string
            MIMEtype: imageType,
            visibility: visibility, // Adjust as needed
        };

        const token = await fb.getToken();
        const response = await axios.post(`${SERVERLOCATION}/api/teams`, teamData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const teamId = response.data.teamID;
            console.log('Team created with ID:', teamId);
            toggleModal(); // Assuming this closes the overlay
        } else {
            throw new Error('Team creation failed');
        }
    } catch (error) {
        console.error('Error during team creation:', error);
    }
};
  return (
    <div className="w-screen h-screen  flex items-center justify-center">
    <div className="w-full md:w-3/4 lg:w-2/4 shadow-lg bg-basicallylight rounded-md flex flex-col" style={{ maxHeight: '60%' }}> {/* Responsive width */}
      <div className="flex justify-end p-2 md:p-4"> {/* Responsive padding */}
        {/* Placeholder for Close Button if needed */}
      </div>
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-20"> {/* Responsive padding */}
        <p className="text-4xl font-light text-basicallydark">Customize your team</p>
          <p className="text-xl mb-2 text-basicallydark font-light">Give your team a nice snazzy name and an icon.</p>
          <div className="relative text-center my-8"> {/* Adjusted margin and upload button position */}
            
           <UploadButton onUpload = {handleUpload} />
          </div>
          <div className="w-full">
            <label htmlFor="team-name" className="block pb-2 font-light text-basicallydark">Team Name</label>
            <input id="team-name" className="bg-gray-200 w-full h-16 px-4 mb-4" type='text' placeholder="Enter team name" onChange={(e) => setTeamName(e.target.value)}/> {/* Increased height */}
            <div className="flex items-center justify-start mb-4">
  <label htmlFor="visibility-toggle" className="flex items-center cursor-pointer">
    <div className="relative">
      {/* Hidden checkbox input to toggle state */}
      <input type="checkbox" id="visibility-toggle" className="sr-only" 
             checked={visibility === 'private'} 
             onChange={() => setVisibility(visibility === 'public' ? 'private' : 'public')} />
      {/* Line behind the switch */}
      <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
      {/* Dot on the switch */}
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${visibility === 'private' ? 'translate-x-full' : 'translate-x-0'}`}></div>
    </div>
    {/* Label text */}
    <div className="ml-3 text-gray-700 font-medium">
      {visibility === 'public' ? 'Public Team' : 'Private Team'}
    </div>
  </label>
</div>

          </div>
          <p className="text-xs font-light mb-8 text-basicallydark text-poppins">By creating a team, you agree to Collabrain's <b>Community Guidelines*</b></p> {/* Adjusted margin */}
        </div>
        <div className="bg-secondary p-6 w-full flex justify-between items-center"> {/* Adjusted padding and flex layout */}
          <button className="text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button  onClick={handleCreateTeam} className="w-24 h-12 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Create</button>
        </div>
      </div>
    </div>
  );
};


  
const JoinTeamOverlay = ({ switchToHome }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-2/4 shadow-lg bg-basicallylight rounded-md flex flex-col" style={{ height: '60%' }}> {/* Match height with CreateTeamOverlay */}
        <div className="flex justify-end p-4"> {/* Adjusted padding to match CreateTeamOverlay */}
          {/* Placeholder for Close Button if needed */}
        </div>
        <div className="flex-grow flex flex-col items-center justify-center px-20"> {/* Center content vertically */}
          <p className="text-4xl font-medium font-poppins text-basicallydark block mb-4 text-center">Join a team</p>
          <p className="text-xl text-basicallydark text-center font-poppins font-light mb-4">Enter the invite details to join an existing team.</p>
          <div className="w-full mb-4 items-center justify-center flex flex-col"> {/* Adjusted margin */}
          
            <input id="invite-link" className="bg-gray-200 w-11/12 h-16 px-4 mb-2" type='url' placeholder="Enter invite link"/> {/* Matched height with CreateTeamOverlay */}
          </div>
          <div className='w-full px-4 sm:px-6 lg:px-8 mb-8'> {/* Adjusted margin */}
        
      <button className="h-20 w-full mt-5 max-w-screen-sm flex items-center justify-between focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
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
        <div className="bg-secondary p-6 w-full flex justify-between items-center"> {/* Adjusted padding to match CreateTeamOverlay */}
          <button className="text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button className="w-24 h-12 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Join</button>
        </div>
      </div>
    </div>
  );
};

  
  export default TeamOverlay;