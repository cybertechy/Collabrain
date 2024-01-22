import React from "react";
import "./index.css";


export default function CreateJoinTeamScreen({ setOpenModal, switchToCreateTeam, switchToJoinTeam }) {
  return (
    <div className = 'w-screen h-screen bg-gray-200 flex items-center justify-center'>
      <div className='w-2/4 h-3/5 shadow-lg bg-white rounded-md'>
        <div className="flex justify-end">
          <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' 
          onClick={() => setOpenModal(false)}>X</button>
        </div>
        <div className="inline-block text-center mt-7">
          <p className="text-4xl block text-center font-light">Create a team</p>
          <p className="text-xl text-center mb-30 ml-20 mr-20 mt-10 font-light">Creating a team has never been simpler, you're only a few clicks away from your exclusive space.</p>
        </div>
        <div className="flex items-center mt-12 border border-white justify-center">
          <button className ="w-96 h-16 mb-14 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          onClick={switchToCreateTeam}>Create a Team</button>
        </div>
        <div className="grid grid-cols-1 h-36 place-items-center items-center justify-center bg-purple-200 mt-30 text-center">
          <p className="text-2xl pt-5 pb-3 font-normal ">Have an invite already?</p>
          <button className='w-80 h-12 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg mb-20 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
          onClick={switchToJoinTeam}>Join a Team</button>
        </div>
      </div>
    </div>
  );
}