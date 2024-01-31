import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import PersonIcon from "@mui/icons-material/Person";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Image from 'next/image';
const BadBehaviorStrikes = ({ strikes }) => {
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
            <p className="p-1">{`${strikes} out of 3`}</p>
        </div>
    );
};


const Dropdown = ({ buttonLabel, dropdownItems, onSelect }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    const handleItemClick = (label) => {
        onSelect(label);
        toggleDropdown();
    };
    return (
        <div className="relative inline-block text-left">
            <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
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

const ToggleButtonExample = () => {
    const [isToggled, setToggled] = useState(false);
    const handleToggle = () => {
        setToggled(!isToggled);
    };
    return (
        <div>
            <button
                className={`relative w-12 h-6 rounded-full focus:outline-none transition-colors duration-300 ease-in-out ${
                    isToggled ? "bg-primary" : "bg-gray-400"
                }`}
                onClick={handleToggle}
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
   
  
    const handleButtonClick = (screen) => {
      setCurrentScreen(screen);
    };
  
 
        return (
            <div className=" h-full w-1/4 bg-basicallylight shadow-md rounded-bl-xl rounded-tl-xl z-50">
             <div className="p-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <ul className="mt-4">
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "profile" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "general" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("general")}
              >
                General
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "sound" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("sound")}
              >
                Sound
              </button>
            </li>
            <li>
              <button
                className={`w-full p-2 text-left ${
                  currentScreen === "privacy" ? "bg-primary text-basicallylight" : ""
                }`}
                onClick={() => handleButtonClick("privacy")}
              >
                Privacy
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
              >
                Notifications
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
              >
                Accessibility
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  const SettingsOverlay = ({ onClose }) => {
    const [currentScreen, setCurrentScreen] = useState("profile");
  
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
                        />
                    </button>

            {currentScreen === "profile" && (
              <ProfileOverlay  />
            )}
            {currentScreen === "general" && (
              <GeneralOverlay  />
            )}
            {currentScreen === "sound" && (
              <SoundOverlay />
            )}
            {currentScreen === "privacy" && (
              <PrivacyOverlay />
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
const ProfileOverlay = ({  }) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isNameEditMode, setIsNameEditMode] = useState(false);
    const [isUsernameEditMode, setIsUsernameEditMode] = useState(false);
    const [isEmailEditMode, setIsEmailEditMode] = useState(false);

    const handleNameEditClick = () => {
        setIsNameEditMode(!isNameEditMode);
    };

    const handleUsernameEditClick = () => {
        setIsUsernameEditMode(!isUsernameEditMode);
    };

    const handleEmailEditClick = () => {
        setIsEmailEditMode(!isEmailEditMode);
    };

    return (
        <>
        <div className="w-full h-5/6 flex ">
            <div className=" bg-basicallylight p-5 rounded-md flex overflow-y-scroll scrollbar-thin scrollbar-thumb-primary ">
                <div className="w-full h-full">

                    <div className="w-11/12 h-96  bg-basicallylight rounded-md">
                        <div className="flex flex-col justify-start h-full">
                            <div>
                                <label className="relative group text-center">
                                    <input type="file" className="hidden" />
                                    <div className="group-hover:block relative w-24">
                                        <PersonIcon
                                            style={{ fontSize: 100 }}
                                        />
                                        <div className="absolute top-0 left-0 w-24 h-24 group-hover:bg-gray-300 opacity-0 group-hover:opacity-75 flex items-center py-5 justify-center">
                                            <span className="text-basicallydark text-center font-bold">
                                                Upload
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="mb-6 mt-6">
                                <div className="mb-4 block">
                                    <p className="text-lg text-basicallydark">Name</p>
                                    <div className="mb-4 flex justify-between">
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="border bg-basicallylight border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-primary text-gray-500"
                                            disabled={!isNameEditMode}
                                        />
                                        <button
                                            onClick={handleNameEditClick}
                                            className="text-center text-sm inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-2 rounded-lg"
                                        >
                                            {isNameEditMode ? "Save" : "Edit"}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4 block">
                                    <p className="text-lg text-basicallydark">Username</p>
                                    <div className="mb-4 flex justify-between">
                                        <input
                                            type="text"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            className="border bg-basicallylight border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-primary text-gray-500"
                                            disabled={!isUsernameEditMode}
                                        />
                                        <button
                                            onClick={handleUsernameEditClick}
                                            className="text-center text-sm inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-2 rounded-lg"
                                        >
                                            {isUsernameEditMode ? "Save" : "Edit"}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4 block">
                                    <p className="text-lg text-basicallydark">Email</p>
                                    <div className="mb-4 flex justify-between">
                                        <input
                                            type="text"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="border bg-basicallylight border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-primary text-gray-500"
                                            disabled={!isEmailEditMode}
                                        />
                                        <button
                                            onClick={handleEmailEditClick}
                                            className="text-center text-sm inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-2 rounded-lg"
                                        >
                                            {isEmailEditMode ? "Save" : "Edit"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-11/12 h-11/12 bg-basicallylight rounded-md">
                                    <div className="mb-6">
                                        <p className="mb-2 text-2xl  text-basicallydark ">
                                            Password and Authentication
                                        </p>
                                        <button className="text-center text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 ">
                                            Change Password
                                        </button>
                                    </div>
                                    <div className="mb-6 ">
                                        <p className="mb-2 text-2xl text-basicallydark ">
                                            Two-factor Authentication
                                        </p>
                                        <p className="mb-2  text-base text-basicallydark ">
                                            Protect your Collabrain account with
                                            an extra layer of security.
                                        </p>
                                        <button className="text-center text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 ">
                                            Enable
                                        </button>
                                    </div>
                                </div>
                                <div className="  w-11/12 h-48  bg-basicallylight rounded-md">
                                    <div className="mb-6 ">
                                        <p className="mb-2 text-2xl  text-basicallydark   ">
                                            Account Removal
                                        </p>
                                        <p className="mb-2  text-basicallydark  ">
                                            Disabling your account means you can
                                            recover it at any time after taking
                                            this action
                                        </p>
                                        <div className="flex space-x-5">
                                            <button className="text-center text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 ">
                                                Delete
                                            </button>
                                            <button className="text-center text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 ">
                                                Disable
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
    const [selectedLangLabel, setSelectedLangLabel] = useState("Select your language");
    const [selectedAppearance, setSelectedAppearance] = useState(null);
    const [badBehaviorStrikes, setBadBehaviorStrikes] = useState(3);
  
    const handleLangSelect = (label) => {
      setSelectedLangLabel(label);
    };
  
    const handleAppearanceSelect = (index) => {
      setSelectedAppearance(index);
    };
  
    const handleStrikeChange = (newStrikes) => {
      setBadBehaviorStrikes(newStrikes);
    };
  
    const appearanceOptions = [
      { label: "Dark Background", colorClass: "bg-basicallydark" },
      { label: "Default Background", colorClass: "bg-primary" },
    ];
  
  
    const dropdownItems4 = [
      { label: "Arabic", link: "/option1" },
      { label: "English (US)", link: "/option2" },
    ];
  
    return (
      <>
        <div className="w-full h-5/6 flex justify-center items-start">
          <div className="bg-basicallylight rounded-md flex w-full p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary">
            <div className="flex flex-col w-full">
              <p className="mb-2 text-2xl text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl">
                Change Appearance
              </p>
              <div className="flex flex-wrap sm:flex-nowrap space-y-2 sm:space-x-5 sm:space-y-0 mb-4">
              {appearanceOptions.map((option, index) => (
                <button
                  key={index}
                  className={`h-16 w-16 lg:w-32 lg:h-32 flex justify-center items-center relative ${
                    selectedAppearance === index ? "border-4 border-secondary" : ""
                  }`}
                  onClick={() => handleAppearanceSelect(index)}
                >
                  <div className={`w-full h-full ${option.colorClass} flex justify-center items-center`}>
                    <div className="w-12 h-12 bg-basicallylight"></div> {/* Adjust the size as needed */}
                  </div>
                </button>
              ))}
            </div>
              <div className="mb-4">
                <p className="mb-2 text-2xl text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl">
                  Language
                </p>
                <Dropdown
                  buttonLabel={selectedLangLabel}
                  dropdownItems={dropdownItems4}
                  onSelect={handleLangSelect}
                />
              </div>
              <div className="mb-4">
                <p className="text-2xl pb-2 text-left text-basicallydark md:text-lg sm:text-sm lg:text-2xl">
                  Bad behavior strikes
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
    const [selectedSpeakerLabel, setSelectedSpeakerLabel] = useState("Default Speaker");
    const [selectedMicrophoneLabel, setSelectedMicrophoneLabel] = useState("Default Microphone");

    const handleSpeakerSelect = (label) => {
        setSelectedSpeakerLabel(label);
    };

    const handleMicrophoneSelect = (label) => {
        setSelectedMicrophoneLabel(label);
    };

    const dropdownOutputItems = [
        { label: "External Speakers", link: "/option1" },
        { label: "Choose other Option", link: "/option2" },
    ];

    const dropdownInputItems = [
        { label: "Built-in Microphone", link: "/option1" },
        { label: "Choose other Option", link: "/option2" },
    ];

    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="bg-basicallylight rounded-md flex h-full w-full p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary">
                <div className="flex flex-col w-full">
                    <div className="mb-4">
                        <p className="text-2xl text-left text-basicallydark mb-2">
                            Speaker Device
                        </p>
                        <Dropdown
                            buttonLabel={selectedSpeakerLabel}
                            dropdownItems={dropdownOutputItems}
                            onSelect={handleSpeakerSelect}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-2xl text-left text-basicallydark mb-2">
                            Microphone
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
const PrivacyOverlay = () => {
    const [isDndToggled, setIsDndToggled] = useState(false);

    const handleDndToggle = () => {
        setIsDndToggled(!isDndToggled);
    };

    // Functions to handle export and delete data can be added here
    // For example:
    const handleExportData = () => {
        // Implement export data logic
    };

    const handleDeleteData = () => {
        // Implement delete data logic
    };

    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="bg-basicallylight rounded-md flex w-full p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary">
                <div className="flex flex-col w-full space-y-5">
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Do not disturb
                        </p>
                        <ToggleButtonExample
                            isToggled={isDndToggled}
                            handleToggle={handleDndToggle}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Export my data
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleExportData}
                        >
                           &nbsp;&nbsp;Export&nbsp;
                        </button>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Delete my data
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-9 py-3"
                            onClick={handleDeleteData}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
//  NOTIFICATIONS SETTINGS PAGE
const NotificationsOverlay = () => {
    const [selectedNotiLabel, setSelectedNotiLabel] = useState("Select an option");
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
        { label: "Everywhere", value: "everywhere" },
        { label: "Choose other Option", value: "other" },
    ];

    return (
        <div className="w-full h-5/6 flex justify-center items-start">
            <div className="w-full h-full p-5  bg-basicallylight flex overflow-auto">
                {/* RIGHT SIDE */}
                <div className="  w-full h-full space-y-5">
                    <div className="mb-4">
                        <p className="mb-2 text-2xl text-basicallydark">
                            Receive Notifications from
                        </p>
                        <Dropdown
                            buttonLabel={selectedNotiLabel}
                            dropdownItems={dropdownItems3}
                            onSelect={handleNotiSelect}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Notification Sound
                        </p>
                        <ToggleButtonExample
                            isToggled={isNotiSoundToggled}
                            handleToggle={handleNotiSoundToggle}
                        />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Choose Notification Sound
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureNotificationSound}
                        >
                            Configure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
// ACCESSIBILITY SETTINGS PAGE
const AccessibilityOverlay = () => {
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
        <div className="w-full h-5/6 flex justify-center items-start">
        <div className="w-full h-full p-5  bg-basicallylight flex overflow-auto">
           {/* RIGHT SIDE */}
                <div className="  w-full overflow-auto ">
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Text-to-speech (TTS)
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureTTS}
                        >
                            Configure
                        </button>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Font-size
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureFontSize}
                        >
                            Configure
                        </button>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="text-2xl text-basicallydark">
                            Colorblind Filters
                        </p>
                        <button 
                            className="text-xl inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3"
                            onClick={handleConfigureColorblindFilters}
                        >
                            Configure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SettingsOverlay;
