import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import UploadButton from "../button/uploadButton";
import axios from "axios";
import fb from "../../../app/_firebase/firebase";
import { FileVideo } from "lucide-react";
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const TeamOverlay = ({ toggleModal, modalVisible, handleUpdate }) => {

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
              handleUpdate={handleUpdate}
            />
          )}
          {currentScreen === "create" && (
            <CreateTeamOverlay switchToHome={switchToHome} toggleModal={toggleModal}  handleUpdate={handleUpdate} />
          )}
          {currentScreen === "join" && (
            <JoinTeamOverlay switchToHome={switchToHome} toggleModal={toggleModal}  handleUpdate={handleUpdate} />
          )}
        </div>
      </div>
    )
  );
};


const CreateJoinTeamScreen = ({ switchToCreateTeam, switchToJoinTeam , toggleModal, handleUpdate}) => {
  const { t } = useTranslation('create_join_team');
  const { speak, stop, isTTSEnabled } = useTTS();
  return (
      <div className='w-screen h-screen flex items-center justify-center'>
        {/* <div className='w-2/4 h-3/5 shadow-lg bg-basicallylight rounded-md flex flex-col'> Make sure this is a flex container with column direction */}
        <div className='w-full h-4/5 xs:h-3/5 xs:w-3/4 shadow-lg bg-basicallylight rounded-md flex flex-col md:w-3/5 lg:w-2/3 2xl:w-1/3'>
          <div className="flex justify-end">
          <button
  className='bg-transparent border-none text-25 cursor-pointer pr-2 mt-4 mr-4 text-basicallydark pt-2'
  onClick={toggleModal}
  onMouseEnter={() => isTTSEnabled && speak("Close Window button")}
  onMouseLeave={stop}
>
  <CloseIcon fontSize="large" />
</button>
          </div>
          <div className="inline-block text-center mt-7 flex-grow"> {/* flex-grow will make this div take up available space */}
            <p className="text-4xl block text-center text-basicallydark font-light"
            onMouseEnter={() => isTTSEnabled && speak("Create a team")}
            onMouseLeave={stop}>{t('create_top')}</p>
            <p className="text-xl text-center text-basicallydark mb-4 ml-20 mr-20 mt-10 font-light"
            onMouseEnter={() => isTTSEnabled && speak("Creating a team has never been simpler, you're only a few clicks away from your exclusive space.")}
            onMouseLeave={stop}>{t('create_desc')}</p>
          </div>
          <div className="flex items-center mt-4 justify-center">
            <button className="w-96 h-16 mb-4 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary font-medium rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
            onClick={switchToCreateTeam}
            onMouseEnter={() => isTTSEnabled && speak("Create a Team button")}
            onMouseLeave={stop}>{t('create_button')}</button>
          </div>
          {/* Adjusted bottom part to stick to the bottom */}
          <div className="mt-auto flex flex-col items-center bg-secondary text-center p-4 w-full"> {/* mt-auto will push this div to the bottom */}
            <p className="text-3xl text-basicallydark font-medium font-poppins"
            onMouseEnter={() => isTTSEnabled && speak("Have an invite already?")}
            onMouseLeave={stop}>{t('invite_q')}</p>
            <button className='w-80 h-12 mt-4 mb-4 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary font-medium rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary'
            onClick={switchToJoinTeam}
            onMouseEnter={() => isTTSEnabled && speak("Join a Team button")}
            onMouseLeave={stop}>{t('join_button')}</button>
          </div>
        </div>
      </div>
  );
};



  
const CreateTeamOverlay = ({ switchToHome , toggleModal, handleUpdate}) => {
  const { t } = useTranslation('create_team');
  const { speak, stop, isTTSEnabled } = useTTS();
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
            handleUpdate();
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
        <p className="text-4xl font-light text-basicallydark" onMouseEnter={() => isTTSEnabled && speak("Customize your team")}
            onMouseLeave={stop}>{t('create_top')}</p>
          <p className="text-xl mb-2 text-basicallydark font-light" onMouseEnter={() => isTTSEnabled && speak("Give your team a nice snazzy name and an icon.")}
            onMouseLeave={stop}>{t('create_msg')}</p>
          <div className="relative text-center my-8" onMouseEnter={() => isTTSEnabled && speak("Upload Team Icon button")}
            onMouseLeave={stop}> {/* Adjusted margin and upload button position */}
            
           <UploadButton onUpload = {handleUpload} />
          </div>
          <div className="w-full">
            <label htmlFor="team-name" className="block pb-2 font-light text-basicallydark" onMouseEnter={() => isTTSEnabled && speak("Team Name")}
            onMouseLeave={stop}>{t('team_name')}</label>
            <input id="team-name" className="bg-gray-200 w-full h-16 px-4 mb-4" type='text' placeholder={t('enter_name')} onChange={(e) => setTeamName(e.target.value)}
            onMouseEnter={() => isTTSEnabled && speak("Type team name here")} onMouseLeave={stop}/> {/* Increased height */}
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
      {visibility === 'public' ? t('public') : t('private')}
    </div>
  </label>
</div>

          </div>
          <p className="text-xs font-light mb-8 text-basicallydark text-poppins" onMouseEnter={() => isTTSEnabled && speak("By creating a team, you agree to Collabrain's Community Guidelines")}
            onMouseLeave={stop}>{t('guidelines1')} <b>{t('guidelines2')}</b></p> {/* Adjusted margin */}
        </div>
        <div className="bg-secondary p-6 w-full flex justify-between items-center"> {/* Adjusted padding and flex layout */}
          <button className="text-gray-500 text-lg" onClick={switchToHome} onMouseEnter={() => isTTSEnabled && speak("Back button")} onMouseLeave={stop}>{t('back_button')}</button>
          <button  onClick={handleCreateTeam} className="w-24 h-12 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
          onMouseEnter={() => isTTSEnabled && speak("Create button")} onMouseLeave={stop}>{t('create_button')}</button>
        </div>
      </div>
    </div>
  );
};


  
const JoinTeamOverlay = ({ switchToHome , handleUpdate}) => {
  const { t } = useTranslation('join_team');
  const { speak, stop, isTTSEnabled } = useTTS();
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-2/4 shadow-lg bg-basicallylight rounded-md flex flex-col" style={{ height: '60%' }}> {/* Match height with CreateTeamOverlay */}
        <div className="flex justify-end p-4"> {/* Adjusted padding to match CreateTeamOverlay */}
          {/* Placeholder for Close Button if needed */}
        </div>
        <div className="flex-grow flex flex-col items-center justify-center px-20"> {/* Center content vertically */}
          <p className="text-4xl font-medium font-poppins text-basicallydark block mb-4 text-center"
          onMouseEnter={() => isTTSEnabled && speak("Join a team")}
          onMouseLeave={stop}>{t('join_top')}</p>
          <p className="text-xl text-basicallydark text-center font-poppins font-light mb-4"
          onMouseEnter={() => isTTSEnabled && speak("Enter the invite details to join an existing team.")}
          onMouseLeave={stop}>{t('join_msg')}</p>
          <div className="w-full mb-4 items-center justify-center flex flex-col"> {/* Adjusted margin */}
          
            <input id="invite-link" className="bg-gray-200 w-11/12 h-16 px-4 mb-2" type='url' 
            onMouseEnter={() => isTTSEnabled && speak("Enter invite link here.")}
            onMouseLeave={stop} placeholder={t('enter_link')}/> {/* Matched height with CreateTeamOverlay */}
          </div>
          <div className='w-full px-4 sm:px-6 lg:px-8 mb-8'> {/* Adjusted margin */}
        
      <button className="h-20 w-full mt-5 max-w-screen-sm flex items-center justify-between focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      onMouseEnter={() => isTTSEnabled && speak("Discover Teams button")}
      onMouseLeave={stop}>
        <div className="flex items-center space-x-4 pl-4">
        <img className="h-14" src={'/assets/images/link.png'} alt= 'image2'/>
          <div>
            <p className="text-xl text-left font-medium"
            onMouseEnter={() => isTTSEnabled && speak("Don't have an invite")}
            onMouseLeave={stop}>{t('no_invite_q')}</p>
            <p className="text-sm"
            onMouseEnter={() => isTTSEnabled && speak("Check out public teams in the discovery")}
            onMouseLeave={stop}>{t('check_public')}</p>
          </div>
        </div>
        <div className="pr-4">
        <img className="h-6 " src={'/assets/images/arrow.png'} alt= 'image3'/> 
        </div>
      </button>
  
          </div>
        </div>
        <div className="bg-secondary p-6 w-full flex justify-between items-center"> {/* Adjusted padding to match CreateTeamOverlay */}
          <button className="text-gray-500 text-lg" onClick={switchToHome} onMouseEnter={() => isTTSEnabled && speak("Back button")}
            onMouseLeave={stop}>{t('back_button')}</button>
          <button className="w-24 h-12 focus:outline-none text-basicallylight bg-primary hover:bg-tertiary focus:ring-4 focus:ring-secondary rounded-md text-lg dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
          onMouseEnter={() => isTTSEnabled && speak("Join button")} onMouseLeave={stop}>{t('join_button')}</button>
        </div>
      </div>
    </div>
  );
};

  
  export default TeamOverlay;