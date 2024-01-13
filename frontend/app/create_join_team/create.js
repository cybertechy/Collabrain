//create team modal screen

import React from "react";
import "./createJoin.css";
import './pics/upload_icon.png';
 
export default function CreateTeamScreen({ switchToHome }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={switchToHome}>X</button>
        </div>
        <div className="title">
          <h1>Customize your team</h1>
          <p id= "para">Give your team a nice snazzy name and an icon. You can always change it later.</p>
        </div>
        <div className="upload_button">
                <button><img src={require('./pics/upload_icon.png')} alt= 'image'/> <p id='upload'>UPLOAD</p></button>
                {/* <input id='upload' type= 'file'></input> */}
        </div>
        <div className="team_name">
                <p id= 'tm'><b> Team Name</b></p>
                <input id ='input' type = 'text'></input>
                <p id='para2'>By creating a team, you agree to Collabrain's Community Guidelines</p>
        </div>
        <div className="footer1">
          <button id='back' onClick={switchToHome}>Back</button>
          <button id= 'create'>Create</button>
        </div>
      </div>
    </div>
  );
}