//Home modal screen (create/join team screen)

import React from "react";
import "./createJoin.css";
 
export default function HomeScreen({ setOpenModal, switchToCreateTeam, switchToJoinTeam }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={() => setOpenModal(false)}>X</button>
        </div>
        <div className="title">
          <h1>Create a team</h1>
          <p id= 'body'>Creating a team has never been simpler, you're only a few clicks away from your exclusive space.</p>
        </div>
        <div className="create_team">
          <button onClick={switchToCreateTeam}>Create a Team</button>
        </div>
        <div className="footer">
          <h2>Have an invite already?</h2>
          <button onClick={switchToJoinTeam}>Join a Team</button>
        </div>
      </div>
    </div>
  );
}