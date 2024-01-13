// Join team modal screen

import React from "react";
import "./createJoin.css";
 
export default function JoinTeamScreen({ switchToHome }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={switchToHome}>X</button>
        </div>
        <div className="title">
          <h1>Join a team</h1>
          <p id='para3' >Enter the invite details to join an existing team.</p>
        </div>
        <div className="input_field2">
            <p>Invite Link</p>
            <input id ='input2' type = 'url'></input>
        </div>
        <div className='link_body'>
            <button id='link_button'>
              <img id="img2" src={require('./pics/link.png')} alt= 'image2'/>
              <img id="img3" src={require('./pics/arrow.png')} alt= 'image3'/> 
              <p id='para4'> Don't have an invite?</p>  
              <p id= 'para5'>Check out public teams in the discovery</p> 
            </button>
        </div>
        <div className="footer2">
          <button id='back' onClick={switchToHome}>Back</button>
          <button id= 'create'>Join</button>
        </div>
      </div>
    </div>
  );
}