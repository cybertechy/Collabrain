import React, { useState , useEffect} from "react";
import CloseIcon from "@mui/icons-material/Close";
import UploadButton from "../button/uploadButton";
import PersonIcon from "@mui/icons-material/Person";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Image from 'next/image';
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    List, ListItem, ListItemText, Radio, RadioGroup, FormControlLabel} from '@mui/material';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import { TTSProvider, useTTS } from "../../../app/utils/tts/TTSContext";
import "../../../app/utils/i18n"
import { useTranslation } from 'next-i18next';

const fb = require("_firebase/firebase");

const BadBehaviorStrikes = ({ strikes }) => {
    const { t } = useTranslation('general_overlay')
    const renderSadFace = (_, index) => (
        <div key={index} style={{ marginRight: "10px", display: "inline-block" }}>
            <SentimentVeryDissatisfiedIcon
                className="text-primary"
                fontSize="large"
            />
        </div>
    );

    return (
        <div>
            {Array.from({ length: strikes }, renderSadFace)}
            <p className="p-1">{`${strikes} ${t('strike_num')}`}</p>
        </div>
    );
};


const Dropdown = ({ buttonLabel, dropdownItems, onSelect }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { speak, stop, isTTSEnabled } = useTTS();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    const handleItemClick = (label) => {
        onSelect(label);
        toggleDropdown();
    };
   
    const handleItemMouseEnter = (label) => {
        if (isTTSEnabled) {
            speak(label);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
                onMouseEnter={() => {
                    if (isTTSEnabled) {
                        speak(buttonLabel);
                    }
                }}
                onMouseLeave={stop}
                className="text-center text-xl sm:text-sm md:text-base lg:text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight sm:px-8 md:px-12 lg:px-16 xl:px-20 py-3 rounded"
                type="button"
            >
                {buttonLabel}{" "}
                <svg
                    className="w-3.5 h-3.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            {/* Dropdown menu */}
            {isDropdownOpen && (
                <div
                    id="dropdown"
                    className="z-10 absolute bg-basicallylight divide-y divide-basicallylight-100 rounded-lg shadow dark:bg-basicallylight-700 "
                >
                    <ul
                        className="py-2 "
                        aria-labelledby="dropdownDefaultButton"
                    >
                        {dropdownItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    href={item.link}
                                    onClick={() => handleItemClick(item.label)}
                                    onMouseEnter={() => handleItemMouseEnter(item.label)}
                                    onMouseLeave={stop}
                                    className="block text-center px-20 py-3 text-xl hover:bg-primary hover:text-basicallylight dark:hover:bg-primary dark:hover:text-basicallylight text-primary w-full "
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ToggleButtonExample = ({ isToggled, handleToggle }) => {
    const { speak, stop, isTTSEnabled } = useTTS();

    const handleMouseEnter = () => {
        if (isTTSEnabled) {
            const status = isToggled ? "Currently toggled on. Click to toggle off." : "Currently toggled off. Click to toggle on.";
            speak(status);
        }
    };
    return (
        <div>
            <button
                className={`relative w-12 h-6 rounded-full focus:outline-none transition-colors duration-300 ease-in-out ${
                    isToggled ? "bg-primary" : "bg-gray-400"
                }`}
                onClick={handleToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={stop}
            >
                <span
                    className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-basicallylight shadow-md transform transition-transform duration-300 ease-in-out ${
                        isToggled ? "translate-x-full" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
};
const OverlaySidebar = ({ currentScreen, setCurrentScreen }) => {

    const { speak, stop, isTTSEnabled } = useTTS();
    const { t } = useTranslation('settings');
  
    const handleButtonClick = (screen) => {
      setCurrentScreen(screen);
    };
  
 
        return (
            <div className=" h-full w-1/4 bg-basicallylight shadow-md rounded-bl-xl rounded-tl-xl z-50">
             <div className="p-4">
          <h2 className="text-2xl font-bold" 
          onMouseEnter={() => isTTSEnabled && speak("Settings window")}
          onMouseLeave={stop}>
            {t('settings_top')}</h2>
          <ul className="mt-4">
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "profile" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("profile")}
                onMouseEnter={() => isTTSEnabled && speak("Profile settings")}
                onMouseLeave={stop}
              >
                {t('profile_side')}
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "general" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("general")}
                onMouseEnter={() => isTTSEnabled && speak("General settings")}
                onMouseLeave={stop}
                
              >
                {t('general_side')}
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "sound" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("sound")}
                onMouseEnter={() => isTTSEnabled && speak("Sound settings")}
                onMouseLeave={stop}
              >
                {t('sound_side')}
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "privacy" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("privacy")}
                onMouseEnter={() => isTTSEnabled && speak("Privacy settings")}
                onMouseLeave={stop}
              >
                {t('privacy_side')}
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "notifications"
                    ? "bg-primary text-basicallylight"
                    : ""
                }`}
                onClick={() => handleButtonClick("notifications")}
                onMouseEnter={() => isTTSEnabled && speak("Notifications settings")}
                onMouseLeave={stop}
              >
                {t('notif_side')}
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "accessibility"
                    ? "bg-primary text-basicallylight"
                    : ""
                }`}
                onClick={() => handleButtonClick("accessibility")}
                onMouseEnter={() => isTTSEnabled && speak("Accessibility settings")}
                onMouseLeave={stop}
              >
                {t('access_side')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  const SettingsOverlay = ({ onClose }) => {
    const { speak, stop, isTTSEnabled } = useTTS();
    const [currentScreen, setCurrentScreen] = useState("profile");
    const [user, loading] = fb.useAuthState();
    if (loading|| !user )
    return (
        <div className="flex flex-col items-center justify-around min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen">
               
                <div className="loader mb-5"></div>

             
            </div>
        </div>
    );
    return (
        
      <div className="flex flex-row fixed top-0 left-0 w-full h-full items-center justify-center z-50 text-basicallydark bg-basicallylight bg-opacity-20 backdrop-blur-sm">
        <div className="bg-basicallylight w-3/6 h-5/6 bg-opacity-100 flex flex-row  shadow-lg rounded-xl border-2 border-gray-300">
        <OverlaySidebar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
        <div className="w-full">
        <button
                        className="bg-transparent border-none text-25 cursor-pointer pr-4 pt-2 flex justify-end w-full"
                        onClick={onClose}
                    >
                        <CloseIcon
                            className="text-basicallydark"
                            fontSize="large"
                            onMouseEnter={() => isTTSEnabled && speak("Close settings button")}
                            onMouseLeave={stop}
                            
                        />
                    </button>

            {currentScreen === "profile" && (
              <ProfileOverlay  user = {user}/>
            )}
            {currentScreen === "general" && (
              <GeneralOverlay  />
            )}
            {currentScreen === "sound" && (
              <SoundOverlay />
            )}
            {currentScreen === "privacy" && (
              <PrivacyOverlay user = {user}/>
            )}
            {currentScreen === "notifications" && (
              <NotificationsOverlay />
            )}
            {currentScreen === "accessibility" && (
              <AccessibilityOverlay />
            )}
          </div>
        </div>
        </div>
      
    );
  };
//  PROFILE SETTINGS PAGE
const ProfileOverlay = ({ user }) => {
    const { t } = useTranslation('profile_overlay');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isNameEditMode, setIsNameEditMode] = useState(false);
    const [isUsernameEditMode, setIsUsernameEditMode] = useState(false);
    const [isEmailEditMode, setIsEmailEditMode] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
const router = useRouter();
    const handleNameEditClick = () => {
        setIsNameEditMode(!isNameEditMode);
    };

    const handleUsernameEditClick = () => {
        setIsUsernameEditMode(!isUsernameEditMode);
    };

    const handleEmailEditClick = () => {
        setIsEmailEditMode(!isEmailEditMode);
    };
    
    useEffect(() => {
        if (!user) return;
        console.log(user, " exists")
        const fetchUser = async () => {
            try {
                const token = await fb.getToken();
                const response = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/${user.uid}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                
                setUserInfo(response.data );
                console.log(userInfo);
            } catch (error) {
                console.error('Error fetching user data:', error);
              
            }
        };

        fetchUser();
    }, [user]);

    useEffect(() => {
        if (!userInfo) return;
        setName(userInfo.fname + " " + userInfo.lname);
        setUsername(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo]);
    const handleDeleteUser = async () => {
        try {
            const token = await fb.getToken(); // Assuming fb.getToken() gets the current user's token
            await axios.delete(`https://collabrain-backend.cybertech13.eu.org/api/users/${user.uid}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            router.push('/'); 
        } catch (error) {
            console.error('Error deleting user:', error);
            // Optionally, handle error (e.g., show an error message)
        }
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    return (
        <>
        <div className="w-full h-5/6 flex ">
            <div className=" bg-basicallylight p-5 rounded-md flex overflow-y-auto scrollbar-thin scrollbar-thumb-primary ">
                <div className="w-full h-full">

                    <div className="w-11/12 h-96  bg-basicallylight rounded-md">
                        <div className="flex flex-col justify-start h-full">
                            

                            <div className="w-11/12 h-11/12 bg-basicallylight rounded-md justify-center">
                            <div className="mb-4">
                                        
                                        <button className="justify-center w-full font-semibold inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 rounded-full"
                                        onClick= {() => router.push('/profile')}
                                        onMouseEnter={() => isTTSEnabled && speak("View your profile button")}
                                        onMouseLeave={stop}>
                                            {t('view_profile')}
                                        </button>
                                    </div>
                                    <div className="mt-8 mb-4">
                                        <p className="mb-2 text-xl  text-basicallydark "
                                        onMouseEnter={() => isTTSEnabled && speak("Password and authentication")}
                                        onMouseLeave={stop}>
                                            {t('pass_auth')}
                                        </p>
                                        <button className="text-center inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 "
                                        onMouseEnter={() => isTTSEnabled && speak("Change password button")}
                                        onMouseLeave={stop}>
                                            {t('change_pass')}
                                        </button>
                                    </div>
                                    <div className="mb-6 ">
                                        <p className="mb-2 text-xl text-basicallydark "
                                        onMouseEnter={() => isTTSEnabled && speak("Two-factor authentication")}
                                        onMouseLeave={stop}>
                                            {t('2fa')}
                                        </p>
                                        <p className="mb-2 text-base text-basicallydark "
                                        onMouseEnter={() => isTTSEnabled && speak("Protect your Collabrain account with an extra layer of security.")}
                                        onMouseLeave={stop}>
                                            {t('2fa_desc')}
                                        </p>
                                        <button className="text-center inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 "
                                        onMouseEnter={() => isTTSEnabled && speak("Enable two-factor authentication button")}
                                        onMouseLeave={stop}>
                                            {t('2fa_button')}
                                        </button>
                                    </div>
                                </div>
                                <div className="  w-11/12 h-48  bg-basicallylight rounded-md">
                                    <div className="mb-6 ">
                                        <p className="mb-2 text-xl text-basicallydark   "
                                        onMouseEnter={() => isTTSEnabled && speak("Account removal")}
                                        onMouseLeave={stop}>
                                            {t('remove_acc')}
                                        </p>
                                        <p className="mb-2 text-basicallydark  "
                                        onMouseEnter={() => isTTSEnabled && speak("Disabling your account means you can recover it at any time after taking this action")}
                                        onMouseLeave={stop}>
                                            {t('remove_acc_desc')}
                                        </p>
                                        <div className="flex space-x-5">
                                        <button className="text-center inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 " 
                                        onClick={handleClickOpen}
                                        onMouseEnter={() => isTTSEnabled && speak("Delete account button")}
                                        onMouseLeave={stop}>
                {t('delete_button')}
            </button>
            {/* Dialog for confirmation */}
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle
                onMouseEnter={() => isTTSEnabled && speak("Confirm account deletion")}
                onMouseLeave={stop}>
                {t('dlt_confirm_msg')}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText 
                    onMouseEnter={() => isTTSEnabled && speak("Are you sure you want to delete your account? This action cannot be undone.")}
                    onMouseLeave={stop}>
                        {t('delete_msg')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                    onMouseEnter={() => isTTSEnabled && speak("Cancel account deletion button")}
                    onMouseLeave={stop}>
                        {t('cancel')}
                    </Button>

                    <Button onClick={() => {
                        handleDeleteUser();
                        handleClose();
                    }} autoFocus
                    onMouseEnter={() => isTTSEnabled && speak("Confirm account deletion button")}
                    onMouseLeave={stop}>
                        {t('confirm_button')}
                    </Button>
                </DialogActions>
            </Dialog>
                                            <button  onClick  = {fb.signOut} className="text-center inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 "
                                            onMouseEnter={() => isTTSEnabled && speak("Sign out button")}
                                            onMouseLeave={stop}>
                                                {t('signout')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
//  GENERAL SETTINGS PAGE
const GeneralOverlay = () => {
    const { t } = useTranslation('general_overlay');
    const { speak, stop, isTTSEnabled, toggleTTS } = useTTS();
    const [selectedLangLabel, setSelectedLangLabel] = useState(t('lang_menu'));
    const [selectedAppearance, setSelectedAppearance] = useState(null);
    const [badBehaviorStrikes, setBadBehaviorStrikes] = useState(3);
  
    useEffect(() => {
        // Check if dark mode is enabled on component mount
        const isDarkMode = document.documentElement.classList.contains('dark');
        setSelectedAppearance(isDarkMode ? 0 : 1);
      }, []);
    
      const handleLangSelect = (label) => {
        setSelectedLangLabel(label);
      };
    
      const handleAppearanceSelect = (index) => {
        setSelectedAppearance(index);
        // Toggle dark mode based on selection
        if (appearanceOptions[index].darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
  
    const handleStrikeChange = (newStrikes) => {
      setBadBehaviorStrikes(newStrikes);
    };
  
    const appearanceOptions = [
        { label: "Dark Background", colorClass: "bg-basicallydark", darkMode: true },
        { label: "Default Background", colorClass: "bg-basicallylight", darkMode: false },
      ];
  
    const dropdownItems4 = [
      { label: t('english_us'), link: "/option1" },
      { label: t('russian'), link: "/option2" },
    ];
  
    return (
      <>
        <div className="w-full h-5/6 flex justify-center items-start">
          <div className="bg-basicallylight  rounded-md flex w-full p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
            <div className="flex flex-col w-full">
              <p className="mb-2 text-2xl text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl"
              onMouseEnter={() => isTTSEnabled && speak("Change appearance")}
              onMouseLeave={stop}>
                {t('appearance')}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap space-y-2 sm:space-x-5 sm:space-y-0 mb-4">
              {appearanceOptions.map((option, index) => (
                option.darkMode ? (
                // Render button for dark mode
                <button
                  key={index}
                  className={`h-16 w-16 lg:w-32 lg:h-32 flex justify-center items-center relative ${
                    selectedAppearance === index ? "border-4 border-secondary" : ""
                  }`}
                  onClick={() => handleAppearanceSelect(index)}
                  onMouseEnter={() => isTTSEnabled && speak("Dark mode")}
                    onMouseLeave={stop}
                >
                  <div className={`w-full h-full ${option.colorClass} flex justify-center items-center`}>
                    <div className="w-12 h-12 bg-basicallylight"></div>
                  </div>
                </button>
              ) : (
                // Render button for light mode
                <button
                  key={index}
                  className={`h-16 w-16 lg:w-32 lg:h-32 flex justify-center items-center relative border-primary border-4 ${
                    selectedAppearance === index ? "border-4 border-secondary" : ""
                  }`}
                  onClick={() => handleAppearanceSelect(index)}
                  onMouseEnter={() => isTTSEnabled && speak("Light mode")}
                        onMouseLeave={stop}
                >
                  <div className={`w-full h-full ${option.colorClass} flex justify-center items-center`}>
                    <div className="w-12 h-12 bg-primary"></div>
                  </div>
                </button>
              )
            ))
          }
             
            </div>
              <div className="mb-4">
                <p className="mb-2 text-2xl text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl"
                onMouseEnter={() => isTTSEnabled && speak("Language")}
                onMouseLeave={stop}>
                  {t('lang')}
                </p>
                <Dropdown
                  buttonLabel={selectedLangLabel}
                  dropdownItems={dropdownItems4}
                  onSelect={handleLangSelect}
                />
              </div>
              <div className="mb-4">
                <p className="text-2xl pb-2 text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl"
                onMouseEnter={() => isTTSEnabled && speak("Bad behavior strikes")}
                onMouseLeave={stop}>
                  {t('strikes')}
                </p>
                <div className="flex flex-row justify-start items-center">
                  <BadBehaviorStrikes strikes={badBehaviorStrikes} onChange={handleStrikeChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
//  SOUND SETTINGS PAGE
const SoundOverlay = () => {
    const { speak, stop, isTTSEnabled, toggleTTS } = useTTS();
    const { t } = useTranslation('sound_overlay');
    const [selectedSpeakerLabel, setSelectedSpeakerLabel] = useState(t('speaker_menu'));
    const [selectedMicrophoneLabel, setSelectedMicrophoneLabel] = useState(t('mic_menu'));

    const handleSpeakerSelect = (label) => {
        setSelectedSpeakerLabel(label);
    };

    const handleMicrophoneSelect = (label) => {
        setSelectedMicrophoneLabel(label);
    };

    const dropdownOutputItems = [
        { label: t('speaker_ext'), link: "/option1" },
        { label: t('speaker_other'), link: "/option2" },
    ];

    const dropdownInputItems = [
        { label: t('mic_built_in'), link: "/option1" },
        { label: t('mic_other'), link: "/option2" },
    ];

    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="bg-basicallylight rounded-md flex h-full w-full p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
                <div className="flex flex-col w-full">
                    <div className="mb-4">
                        <p className="text-2xl text-left text-basicallydark mb-2"
                        onMouseEnter={() => isTTSEnabled && speak("Speaker device")}
                        onMouseLeave={stop}>
                            {t('speaker_header')}
                        </p>
                        <Dropdown
                            buttonLabel={selectedSpeakerLabel}
                            dropdownItems={dropdownOutputItems}
                            onSelect={handleSpeakerSelect}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-2xl text-left text-basicallydark mb-2"
                        onMouseEnter={() => isTTSEnabled && speak("Microphone")}
                        onMouseLeave={stop}>
                            {t('mic_header')}
                        </p>
                        <Dropdown
                            buttonLabel={selectedMicrophoneLabel}
                            dropdownItems={dropdownInputItems}
                            onSelect={handleMicrophoneSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// PRIVACY SETTINGS PAGE
const PrivacyOverlay = (user) => {
    const { t } = useTranslation('privacy_overlay');
    const { speak, stop, isTTSEnabled, toggleTTS } = useTTS();
    const [isDndToggled, setIsDndToggled] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const handleDndToggle = () => {
        setIsDndToggled(!isDndToggled);
    };

 


    const handleDeleteData = () => {
        // Implement delete data logic
    };
    
    useEffect(() => {
        if (!user) return;
        console.log(user, " exists")
        const fetchUser = async () => {
            try {
                const token = await fb.getToken();
                const response = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/${user.user.uid}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
             
                setUserInfo(response.data );
            } catch (error) {
                console.error('Error fetching user data:', error);
              
            }
        };

        fetchUser();
    }, [user]);
  
    const handleExportData = () => {
        console.log("in handle export data")
      if (!userInfo) return;

  console.log("handle export data continued", userInfo, user)
      // Create a new jsPDF instance
      const pdf = new jsPDF();
        
      // Define the content for the PDF
      const content = `
      ---------User Information---------
      Username: ${userInfo.username}
      Name: ${userInfo.fname + " " + userInfo.lname}
      Email: ${userInfo.email}
      Bio: ${userInfo.bio}
      Achievements: ${userInfo.achievements}
      Aliases: ${userInfo.aliases}



      -------------Education--------------
      Courses: ${userInfo.courses}
      Education: ${userInfo.education}
      Learning Material: ${userInfo.learningMaterial}



      -----------Accessibility------------
      Color Blind Filter: ${userInfo.colorBlindFilter}
      Preferred Font Size: ${userInfo.fontSize}
      Language: ${userInfo.language}
      Theme: ${userInfo.theme}



      -------------Security--------------
      Two Factor Authentication: ${userInfo.twoFA}



      -------------Socials--------------
      Friend Requests: ${userInfo.friendRequests}
      Friends: ${userInfo.friends}
      Team Invites: ${userInfo.teamInvites}
      Teams: ${userInfo.teams}
      Blocked: ${userInfo.blocked}



      -------------Projects--------------
      Content Maps: ${userInfo.contentMaps}
      Documents: ${userInfo.documents}
      `;
  
      // Add the content to the PDF
      pdf.text(content, 10, 10); // Adjust coordinates as needed
  
      // Save the PDF with a specific filename
      pdf.save('user_information.pdf');
    };
    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="bg-basicallylight rounded-md flex w-full p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
                <div className="flex flex-col w-full space-y-5">
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Do not disturb")}
                        onMouseLeave={stop}>
                            {t('dnd')}
                        </p>
                        <ToggleButtonExample
                            isToggled={isDndToggled}
                            handleToggle={handleDndToggle}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Export my data")}
                        onMouseLeave={stop}>
                            {t('export_data')}
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleExportData}
                            onMouseEnter={() => isTTSEnabled && speak("Export my data button")}
                            onMouseLeave={stop}
                        >
                           &nbsp;&nbsp;{t('export_button')}&nbsp;
                        </button>
                    </div>
                    
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Delete my data")}
                        onMouseLeave={stop}>
                            {t('delete_data')}
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-9 py-3"
                            onClick={handleDeleteData}
                            onMouseEnter={() => isTTSEnabled && speak("Delete my data button")}
                            onMouseLeave={stop}
                        >
                            {t('delete_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
//  NOTIFICATIONS SETTINGS PAGE
const NotificationsOverlay = () => {
    const { t } = useTranslation('notif_overlay');
    const { speak, stop, isTTSEnabled, toggleTTS } = useTTS();
    const [selectedNotiLabel, setSelectedNotiLabel] = useState(t('notif_type'));
    const [isNotiSoundToggled, setIsNotiSoundToggled] = useState(false);

    const handleNotiSelect = (label) => {
        setSelectedNotiLabel(label);
    };

    const handleNotiSoundToggle = () => {
        setIsNotiSoundToggled(!isNotiSoundToggled);
    };



    // Function to handle configuration of notification sounds can be added here
    // For example:
    const handleConfigureNotificationSound = () => {
        // Implement configuration logic
    };

    const dropdownItems3 = [
        { label: t('notif_everywhere'), value: "everywhere" },
        { label: t('notif_other'), value: "other" },
    ];

    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="w-full h-full p-5  bg-basicallylight flex overflow-auto">
                {/* RIGHT SIDE */}
                <div className="  w-full h-full space-y-5">
                    <div className="mb-4">
                        <p className="mb-2 text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Receive notifications from")}
                        onMouseLeave={stop}>
                            {t('notif_source')}
                        </p>
                        <Dropdown
                            buttonLabel={selectedNotiLabel}
                            dropdownItems={dropdownItems3}
                            onSelect={handleNotiSelect}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Notification sound")}
                        onMouseLeave={stop}>
                            {t('sound_toggle')}
                        </p>
                        <ToggleButtonExample
                            isToggled={isNotiSoundToggled}
                            handleToggle={handleNotiSoundToggle}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Choose notification sound")}
                        onMouseLeave={stop}>
                            {t('sound_type')}
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureNotificationSound}
                            onMouseEnter={() => isTTSEnabled && speak("Configure notification sound button")}
                            onMouseLeave={stop}
                        >
                            {t('config')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
// ACCESSIBILITY SETTINGS PAGE
const AccessibilityOverlay = () => {
    const { t } = useTranslation('access_overlay');
    const { speak, stop, isTTSEnabled, toggleTTS } = useTTS();

    // Functions to handle configuration can be added here
    // For example:
    const handleConfigureTTS = () => {
        // Implement Text-to-speech configuration logic
    };

    const handleConfigureFontSize = () => {
        // Implement Font-size configuration logic
    };

    const handleConfigureColorblindFilters = () => {
        // Implement Colorblind Filters configuration logic
    };

    return (
        <TTSProvider>
        <div className="w-full h-5/6 flex justify-center items-start">
        <div className="w-full h-full p-5  bg-basicallylight flex overflow-auto">
           {/* RIGHT SIDE */}
                <div className="  w-full overflow-auto ">
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark" 
                        onMouseEnter={() => isTTSEnabled && speak("Text-to-speech")}
                            onMouseLeave={stop}>
                            {t('tts')}
                        </p>
                        <ToggleButtonExample
                            isToggled={isTTSEnabled}
                            handleToggle={toggleTTS}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Font size")}
                        onMouseLeave={stop}>
                            {t('font_size')}
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureFontSize}
                            onMouseEnter={() => isTTSEnabled && speak("Configure font size button")}
                            onMouseLeave={stop}
                        >
                            {t('config')}
                        </button>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark"
                        onMouseEnter={() => isTTSEnabled && speak("Colorblind Filters")}
                        onMouseLeave={stop}>
                            {t('colorblind')}
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureColorblindFilters}
                            onMouseEnter={() => isTTSEnabled && speak("Configure colorblind filters button")}
                            onMouseLeave={stop}
                        >
                            {t('config')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </TTSProvider>
    );
};


export default SettingsOverlay;
