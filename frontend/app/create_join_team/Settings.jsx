import React, { useState } from "react";
import './index.css';
 
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
        className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-20 py-3 rounded"
        type="button"
      >
        {buttonLabel}{' '}
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
          className="z-10 absolute bg-white divide-y divide-white-100 rounded-lg shadow dark:bg-white-700 "
        >
          <ul className="py-2 " aria-labelledby="dropdownDefaultButton">
            {dropdownItems.map((item, index) => (
              <li key={index}>
                <button href={item.link} onClick={() => handleItemClick(item.label)} className="block text-center px-20 py-3 text-xl hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white text-purple-500 w-full ">
               
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
          isToggled ? 'bg-purple-500' : 'bg-gray-400'
        }`}
        onClick={handleToggle}
      >
        <span
          className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
            isToggled ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
 
 
const SettingsOverlay = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("profile");
 
  const switchToProfile = () => setCurrentScreen("profile");
  const switchToGeneral = () => setCurrentScreen("general");
  const switchToSound = () => setCurrentScreen("sound");
  const switchToPrivacy = () => setCurrentScreen("privacy");
  const switchToNotifications = () => setCurrentScreen("notifications");
  const switchToAccessibility = () => setCurrentScreen("accessibility");
 
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setCurrentScreen("profile");
  };
 
 
  return (
    <>
      <div>
        {modalVisible && (
          <div>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-20 backdrop-blur-sm">
              {currentScreen === "profile" && (<ProfileOverlay setOpenModal={toggleModal} switchToGeneral={switchToGeneral} switchToSound={switchToSound} switchToPrivacy={switchToPrivacy} switchToNotifications={switchToNotifications} switchToAccessibility={switchToAccessibility} />)}
              {currentScreen === "general" && (<GeneralOverlay switchToProfile={switchToProfile} switchToSound={switchToSound} switchToPrivacy={switchToPrivacy} switchToNotifications={switchToNotifications} switchToAccessibility={switchToAccessibility} />)}
              {currentScreen === "sound" && <SoundOverlay switchToProfile={switchToProfile} switchToGeneral={switchToGeneral} switchToPrivacy={switchToPrivacy} switchToNotifications={switchToNotifications} switchToAccessibility={switchToAccessibility} />}
              {currentScreen === "privacy" && <PrivacyOverlay switchToProfile={switchToProfile} switchToSound={switchToSound} switchToGeneral={switchToGeneral} switchToNotifications={switchToNotifications} switchToAccessibility={switchToAccessibility} />}
              {currentScreen === "notifications" && <NotificationsOverlay switchToProfile={switchToProfile} switchToSound={switchToSound} switchToPrivacy={switchToPrivacy} switchToGeneral={switchToGeneral} switchToAccessibility={switchToAccessibility} />}
              {currentScreen === "accessibility" && <AccessibilityOverlay switchToProfile={switchToProfile} switchToSound={switchToSound} switchToPrivacy={switchToPrivacy} switchToNotifications={switchToNotifications} switchToGeneral={switchToGeneral} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
 
 
const ProfileOverlay = ({ switchToGeneral, switchToSound, switchToPrivacy, switchToNotifications, switchToAccessibility }) => {
  const [inputValue, setInputValue] = useState('Enter your name');
  const [inputValue1, setInputValue1] = useState('Enter your Username');
  const [inputValue2, setInputValue2] = useState('Enter your Email');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEdit1Mode, setIsEdit1Mode] = useState(false);
  const [isEdit2Mode, setIsEdit2Mode] = useState(false);
 
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  }
  const handleEdit1Click = () => {
    setIsEdit1Mode(!isEdit1Mode);
  }
  const handleEdit2Click = () => {
    setIsEdit2Mode(!isEdit2Mode);
  }
  return (
    <>
      <div className="w-screen h-max flex items-center justify-center overflow-auto  ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
            <div className="flex flex-col justify-start px-16 py-8">
              {/* LEFT SIDE */}
              <p className="py-10 text-4xl font-bold">Settings</p>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200`}>Profile</button>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToGeneral}>General </button>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToSound}>Sound</button>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToPrivacy}>Privacy</button>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToNotifications}>Notifications</button>
              <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToAccessibility}>Accessibility</button>
            </div>
              {/* RIGHT SIDE */}
            <div className='pt-5 w-full h-screen  '>
            <p className="text-2xl pl-10 font-medium">My Account</p>
            <div className=" w-11/12 h-96  ml-5 bg-white rounded-md">
              <div className="flex flex-col justify-start p-5 h-full">
                <div>
                <label className="relative group text-center"><input type="file" className="hidden" /> <img className="h-24" src={require('./usericon.png')} alt="Profile Pic" /><div className="hidden group-hover:block absolute top-0 left-0 w-24 h-full bg-gray-300 opacity-75 flex items-center py-8 justify-center"><span className="text-black text-center font-bold">Upload</span></div> </label>
                </div>
                <div className=" mb-6 mt-6">
                  <div className="mb-4 block">
                    <p className="text-lg ">Name</p>
                    <div className="mb-4 flex justify-between">
                    <input type="text" placeholder="Enter your name" value={inputValue} onChange={(e) => setInputValue(e.target.value)}className="border bg-white border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-purple-500 text-gray-500" disabled={!isEditMode}/>
                    <button onClick={handleEditClick}className="text-center text-sm inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-2 rounded-lg">{isEditMode ? 'Save' : 'Edit'}</button>      
                    </div>
                  </div>
                  <div className="mb- 4 block">
                    <p className="text-lg">Username</p>
                    <div className="mb-4 flex justify-between">
                    <input type="text" placeholder="Enter your name" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)}className="border bg-white border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-purple-500 text-gray-500" disabled={!isEdit1Mode}/>
                    <button onClick={handleEdit1Click}className="text-center text-sm inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-2 rounded-lg">{isEdit1Mode ? 'Save' : 'Edit'}</button>      
                    </div>
                  </div>
                  <div className="mb-4 block">
                    <p className="text-lg ">Email</p>
                    <div className="mb-4 flex justify-between">
                    <input type="text" placeholder="Enter your name" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)}className="border bg-white border-gray-400 p-2 w-5/6 rounded-md focus:outline-none focus:border-purple-500 text-gray-500" disabled={!isEdit2Mode}/>
                    <button onClick={handleEdit2Click}className="text-center text-sm inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-2 rounded-lg">{isEdit2Mode ? 'Save' : 'Edit'}</button>      
                    </div>
                  </div>
                </div>
                <div className="w-11/12 h-72  bg-white rounded-md">    
                <div className="mb-6">
                    <p className="mb-2 text-2xl ">Password and Authentication</p>
                    <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Change Password</button>
                  </div>  
                  <div className="mb-6 ">
                    <p className="mb-2 text-2xl ">Two-factor Authentication</p>
                    <p className="mb-2 ">Protect your Collabrain account with an extra layer of security.</p>
                    <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Enable</button>
                  </div>  
                </div>
 
                <div className="  w-11/12 h-48  bg-white rounded-md">
                  <div className="mb-6 ">
                    <p className="mb-2 text-2xl  ">Account Removal</p>
                    <p className="mb-2  ">Disabling your account means you can recover it at any time after taking this action</p>
                    <div className="flex space-x-5">
                    <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Delete</button>
                    <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Disable</button>
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
}
 
const GeneralOverlay = ({ switchToProfile, switchToSound, switchToPrivacy, switchToNotifications, switchToAccessibility }) => {
  const [selectedLangLabel, setSelectedLangLabel] = useState('Select an option');
  const handleLangSelect = (label) => {
    setSelectedLangLabel(label);
     
  };
  const dropdownItems4= [
    { label: 'Arabic', link: '/option1' },
    { label: 'English (US)', link: '/option2' },
  ];
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
          <div className="flex flex-col justify-start px-16 py-8">
            <p className="py-10 text-4xl font-bold">Settings</p>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToProfile}>Profile</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200`}>General </button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToSound}>Sound</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToPrivacy}>Privacy</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToNotifications}>Notifications</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToAccessibility}>Accessibility</button>
          </div>
          {/* RIGHT SIDE */}
          <div className="pt-36 px-8 w-full">
          <p className="mb-2 text-2xl ">Change Apperaence</p>
            <div className="flex space-x-5 mb-4">
              <buttons className=" h-44 w-44"><img src={require("./blackBG.png")} alt="image1"></img></buttons>
              <buttons className=' h-44 w-44 '><img src={require("./purpleBG.png")} alt="image2"></img></buttons></div>
            <div className="mb-4">
              <p className="mb-2 text-2xl ">Language</p>
              <Dropdown buttonLabel={selectedLangLabel} dropdownItems={dropdownItems4} onSelect={handleLangSelect} />
            </div>
            <div className="mb-4">
              <p className="text-2xl pb-2">Bad behavior strikes</p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" width="120" height="30">
                <circle cx="20" cy="15" r="12" stroke="purple" strokeWidth="2" fill="none" />
                <circle cx="60" cy="15" r="12" stroke="purple" strokeWidth="2" fill="none" />
                <circle cx="100" cy="15" r="12" stroke="purple" strokeWidth="2" fill="none" />
              </svg>
              </div>
          </div>
        </div>
      </div>
    </>
 
 
  );
}
 
const SoundOverlay = ({ switchToProfile, switchToGeneral, switchToPrivacy, switchToNotifications, switchToAccessibility}) => {
 
  const [selectedSpeakerLabel, setSelectedSpeakerLabel] = useState('Select an option');
  const [selectedMicrophoneLabel, setSelectedMicrophoneLabel] = useState('Select an option');
 
  const handleSpeakerSelect = (label) => {
    setSelectedSpeakerLabel(label);
  };
 
  const handleMicrophoneSelect = (label) => {
    setSelectedMicrophoneLabel(label);
  };
 
  const dropdownItems = [
    { label: 'External Speakers', link: '/option1' },
    { label: 'Choose other Option', link: '/option2' },
  ];
 
  const dropdownItems2 = [
    { label: 'Built-in Microphone', link: '/option1' },
    { label: 'Choose other Option', link: '/option2' },
  ];
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
          <div className="flex flex-col justify-start px-16 py-8">
            <p className="py-10 text-4xl font-bold">Settings</p>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToProfile}>Profile</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToGeneral}>General </button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200`}>Sound</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToPrivacy}>Privacy</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToNotifications}>Notifications</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToAccessibility}>Accessibility</button>
          </div>
          {/* RIGHT SIDE */}
          <div className="pt-36 px-8 w-full ">
            <div className="mb-4">
              <p className="mb-2 text-2xl ">Speaker Device</p>
              <Dropdown buttonLabel={selectedSpeakerLabel} dropdownItems={dropdownItems} onSelect={handleSpeakerSelect} />
            </div>
            <div>
              <p className="mb-2 text-2xl ">Microphone</p>
              <Dropdown
                buttonLabel={selectedMicrophoneLabel} dropdownItems={dropdownItems2} onSelect={handleMicrophoneSelect} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
 
 
 
const PrivacyOverlay = ({switchToProfile, switchToSound, switchToGeneral, switchToNotifications, switchToAccessibility,isToggled,handleToggle}) => {
 
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
          <div className="flex flex-col justify-start px-16 py-8">
            <p className="py-10 text-4xl font-bold">Settings</p>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToProfile}>Profile</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToGeneral}>General </button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToSound}>Sound</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200`}>Privacy</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToNotifications}>Notifications</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToAccessibility}>Accessibility</button>
          </div>
          {/* RIGHT SIDE */}
          <div className="pt-36 px-8 w-full ">
            <div className="mb-4 flex justify-between">
              <p className="p-2.5 text-2xl   ">Do not disturb</p>
              <ToggleButtonExample isToggled={isToggled} handleToggle={handleToggle} />
            </div>
            <div className="mb-4 flex justify-between">
              <p className="p-2.5 text-2xl   ">Request my data</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Request</button>
            </div>
            <div className="mb-4 flex justify-between ">
              <p className="p-2.5 text-2xl   ">Relete my data</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Delete</button>
            </div>          
          </div>
        </div>
      </div>
    </>
  );
}
 
 
 
const NotificationsOverlay = ({ switchToProfile, switchToSound, switchToPrivacy, switchToGeneral, switchToAccessibility, isToggled, handleToggle }) => {
  const [selectedNotiLabel, setSelectedNotiLabel] = useState('Select an option');
  const handleNotiSelect = (label) => {
    setSelectedNotiLabel(label);
     
  };
  const dropdownItems3= [
    { label: 'Everywhere', link: '/option1' },
    { label: 'Choose other Option', link: '/option2' },
  ];
  return (
 
    <>
   
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
          <div className="flex flex-col justify-start px-16 py-8">
            <p className="py-10 text-4xl font-bold">Settings</p>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToProfile}>Profile</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToGeneral}>General </button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToSound}>Sound</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToPrivacy}>Privacy</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200 `}>Notifications</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToAccessibility}>Accessibility</button>
          </div>
          {/* RIGHT SIDE */}
          <div className="pt-36 px-8 w-full ">
            <div className="mb-4">
              <p className="mb-2 text-2xl ">Recive Notifications from:</p>
              <Dropdown buttonLabel={selectedNotiLabel} dropdownItems={dropdownItems3} onSelect={handleNotiSelect} />
            </div>
            <div className="mb-4 flex justify-between">
              <p className="p-2.5 text-2xl   ">Notification Sound</p>
              <ToggleButtonExample isToggled={isToggled} handleToggle={handleToggle} />
            </div>
            <div className="mb-4 flex justify-between">
              <p className="p-2.5 text-2xl   ">Choose Notifcation Sound</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Configure</button>
            </div>          
          </div>
        </div>
      </div>
    </>
   
  );
}
 
const AccessibilityOverlay = ({ switchToProfile, switchToSound, switchToPrivacy, switchToNotifications, switchToGeneral }) => {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center ">
        <div className="w-2/4 h-screen shadow-lg bg-white rounded-md flex">
          <div className="flex flex-col justify-start px-16 py-8">
            <p className="py-10 text-4xl font-bold">Settings</p>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToProfile}>Profile</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToGeneral}>General </button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToSound}>Sound</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToPrivacy}>Privacy</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 `} onClick={switchToNotifications}>Notifications</button>
            <button className={`w-72 p-4 text-xl font-medium text-black text-start mb-2 bg-gray-200`}>Accessibility</button>
          </div>
          {/* RIGHT SIDE */}
          <div className="pt-36 px-8 w-full ">
            <div className="mb-4 flex justify-between">
              <p className="p-2.5 text-2xl   ">Text-to-speech(TTS)</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Configure</button>
            </div>
            <div className="mb-4 flex justify-between ">
              <p className="p-2.5 text-2xl   ">Fontsize</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Configure</button>
            </div>
            <div className="mb-4 flex justify-between ">
              <p className="p-2.5 text-2xl ">Colorblind Filters</p>
              <button className="text-center text-xl inline-flex items-center border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-7 py-3 ">Configure</button>
            </div>          
          </div>
        </div>
      </div>
     
    </>
  );
}
 
 
export default SettingsOverlay;