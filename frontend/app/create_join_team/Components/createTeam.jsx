import React from "react";
import "./index.css";
import './pics/upload_icon.png';

 
export default function CreateTeamOverlay({ switchToHome }) {
  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-2/4 h-3/5 shadow-lg bg-white rounded-md ">
        <div className="flex justify-end">
          <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' onClick={switchToHome}>X</button>
        </div>
        <div className="inline-block text-center mt-7">
          <p className="text-4xl block text-center font-light">Customize your team</p>
          <p className="text-xl text-center mb-30 ml-20 mr-20 mt-6 font-light">Give your team a nice snazzy name and an icon. You can always change it later.</p>
        </div>
        <div className="justify-center flex place-items-center mt-5">
                <button className="justify-center "><img className='h-24'src={require('./pics/upload_icon.png')} alt= 'image'/>
                <p className="text-purple-600 text-xs absolute top-96 bottom-80 translate-x-1/2 translate-y-1/2">UPLOAD</p></button>
        </div>
        <div className="">
                <p className="ml-7 pb-3 font-normal"><b> Team Name</b></p>
                <input className="bg-gray-200 w-11/12 h-8 object-center flex place-items-center ml-7 mb-2" type = 'text'></input>
                <p className="ml-7 mb-3 text-xs">By creating a team, you agree to Collabrain's Community Guidelines</p>
        </div>
        <div className="h-32 bg-purple-200 mt-30 flex justify-between ">
          <button className="px-10 text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button className="mt-11 mr-10 w-24 h-10 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Create</button>
        </div>
      </div>
    </div>
  );
}