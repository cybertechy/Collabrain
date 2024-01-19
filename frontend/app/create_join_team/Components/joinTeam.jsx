import React from "react";
import "./index.css";
 
export default function JoinTeamOverlay({ switchToHome }) {
  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-2/4 h-3/5 shadow-lg bg-white rounded-md">
        <div className="flex justify-end">
          <button className='bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' 
          onClick={switchToHome}>X</button>
        </div>
        <div className="inline-block text-center mt-7 ml-20">
          <p className="text-4xl block text-center font-light">Join a team</p>
          <p className="text-xl text-center mb-5 ml-20 mr-20 mt-5 font-light" >Enter the invite details to join an existing team.</p>
        </div>
        <div className="input_field2">
            <p className="ml-8 pb-3 font-normal">Invite Link</p>
            <input className="bg-gray-200 w-11/12 h-8 flex justify-center ml-8 mb-2" type = 'url'></input>
        </div>
        <div className='flex justify-center mt-7 mb-10'>
            <button className="h-20 w-4/5 flex focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-md  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" >
              <img className="h-14 mt-3 ml-3" src={require('./pics/link.png')} alt= 'image2'/>
              <div className="grid grid-rows-2 mt-2.5"> 
                <p className="text-white text-2xl w-56 ml-6 "> Don't have an invite?</p>  
                <p className="text-white w-80 ml-3">Check out public teams in the discovery</p> 
              </div>
              <img className="h-6 ml-36 mt-7" src={require('./pics/arrow.png')} alt= 'image3'/> 
            </button>
        </div>
        <div className="h-32 bg-purple-200 mt-30 flex justify-between">
          <button className="px-10 text-gray-500 text-lg" onClick={switchToHome}>Back</button>
          <button className="mt-11 mr-10 w-24 h-10 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-md text-lg  dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Join</button>
        </div>
      </div>
    </div>
  );
}