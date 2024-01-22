import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
const TeamOverlay = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");

  const switchToHome = () => setCurrentScreen("home");
  const switchToCreateTeam = () => setCurrentScreen("create");
  const switchToJoinTeam = () => setCurrentScreen("join");

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setCurrentScreen("home");
  };

  return (
    <>
      <div>
        <button onClick={toggleModal} className="...">+</button>
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      {currentScreen === "home" && <CreateJoinTeamScreen switchToCreateTeam={switchToCreateTeam} switchToJoinTeam={switchToJoinTeam} />}
      {currentScreen === "create" && <CreateTeamOverlay switchToHome={switchToHome} />}
      {currentScreen === "join" && <JoinTeamOverlay switchToHome={switchToHome} />}
    </div>
      </div>
    </>
  );
};

const CreateJoinTeamScreen = ({ switchToCreateTeam, switchToJoinTeam }) => {
    return (
        <div className = 'w-screen h-screen bg-gray-200 flex items-center justify-center'>
          <div className='w-2/4 h-3/5 shadow-lg bg-white rounded-md'>
            <div className="flex justify-end">
              <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 mt-4 mr-4 text-black pt-2' 
              onClick={() =>{}}><CloseIcon fontSize = "large"/></button>
            </div>
            <div className="inline-block text-center mt-7">
              <p className="text-4xl block text-center text-black font-light">Create a team</p>
              <p className="text-xl text-center text-black mb-30 ml-20 mr-20 mt-10 font-light">Creating a team has never been simpler, you're only a few clicks away from your exclusive space.</p>
            </div>
            <div className="flex items-center mt-12 border border-white justify-center">
              <button className ="w-96 h-16 mb-14 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              onClick={switchToCreateTeam}>Create a Team</button>
            </div>
            <div className="flex flex-col justify-center items-center bg-purple-200 mt-30 text-center h-min">
              <p className="text-3xl pt-5 pb-3  text-black font-medium font-poppins">Have an invite already?</p>
              <button className='w-80 h-12 mt-5  focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg mb-20 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
              onClick={switchToJoinTeam}>Join a Team</button>
            </div>
          </div>
        </div>
      );
  };
  
  const CreateTeamOverlay = ({ switchToHome }) => {
    return (
        <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
          <div className="w-2/4 h-3/5 shadow-lg bg-white rounded-md ">
            <div className="flex justify-end">
              <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2  mr-4' onClick={switchToHome}><CloseIcon fontSize = "large" /></button>
            </div>
            <div className="inline-block text-center ">
              <p className="text-4xl block text-center font-light text-black">Customize your team</p>
              <p className="text-xl text-center mb-30 ml-20 mr-20 mt-6 text-black font-light">Give your team a nice snazzy name and an icon. You can always change it later.</p>
            </div>
            <div className="justify-center flex place-items-center mt-5">
                    <button className="justify-center "><img className='h-24'src={'/assets/images/upload_icon.png'} alt= 'image'/>
                    <p className="text-purple-600 text-xs absolute top-96 bottom-80 translate-x-1/2 translate-y-1/2">UPLOAD</p></button>
            </div>
            <div className="">
                    <p className="ml-7 pb-3 font-light text-black"><b> Team Name</b></p>
                    <input className="bg-gray-200 w-11/12 h-8 object-center flex place-items-center ml-7 mb-2" type = 'text'></input>
                    <p className="ml-7 mb-3 text-xs ">By creating a team, you agree to Collabrain's Community Guidelines</p>
            </div>
            <div className="h-32 bg-purple-200 mt-30 flex justify-between ">
              <button className="px-10 text-gray-500 text-lg" onClick={switchToHome}>Back</button>
              <button className="mt-11 mr-10 w-24 h-10 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Create</button>
            </div>
          </div>
        </div>
      );
  };
  
  const JoinTeamOverlay = ({ switchToHome }) => {
    return (
      <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-2/5 h-3/5 shadow-lg bg-white rounded-md flex flex-col ">
         <div className="flex justify-end">
              <button className='bg-transparent border-none text-black text-25 cursor-pointer mt-4 mr-4 pr-2 pt-2' 
              onClick={switchToHome}><CloseIcon fontSize = "large"/></button>
            </div>
            <div className="inline-block text-center justify-center items-center">
              <p className="text-4xl font-medium font-poppins text-black block mb-5 text-center ">Join a team</p>
              <p className="text-xl text-black text-center  font-poppins font-light" >Enter the invite details to join an existing team.</p>
            </div>
            <div className="input_field2 w-full ">
                <p className="ml-8 text-black pb-3 font-normal">Invite Link</p>
                <input className="bg-gray-200 w-11/12 h-16 flex justify-center ml-8 mb-2 text-black" type = 'url'></input>
            </div>
<div className='flex justify-center mt-7 mb-10 px-4 sm:px-6 lg:px-8'>
      <button className="h-20 w-full max-w-screen-sm flex items-center justify-between focus:outline-none text-white bg-primary hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
        <div className="flex items-center space-x-4 pl-4">
        <img className="h-14" src={'/assets/images/link.png'} alt= 'image2'/>
          <div>
            <p className="text-xl font-medium">Don't have an invite?</p>
            <p className="text-sm">Check out public teams in the discovery</p>
          </div>
        </div>
        <div className="pr-4">
        <img className="h-6 ml-36" src={'/assets/images/arrow.png'} alt= 'image3'/> 
        </div>
      </button>
    </div>
            <div className="h-full bg-purple-200 flex justify-between items-center">
              <button className="px-10 text-gray-500 text-lg" onClick={switchToHome}>Back</button>
              <button className="mr-5 w-24 h-10 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Join</button>
            </div>
          </div>
        </div>
      );
  };
  
  export default TeamOverlay;