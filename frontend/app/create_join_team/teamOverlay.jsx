import React, { useState } from "react";
import CreateJoinTeamScreen from "./Components/createJoinTeam";
import CreateTeamOverlay from "./Components/createTeam";
import JoinTeamOverlay from "./Components/joinTeam";

 
export default function TeamOverlay() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");
 
  const switchToHome = () => {
    setCurrentScreen("home");
  };
 
  const switchToCreateTeam = () => {
    setCurrentScreen("create");
  };
 
  const switchToJoinTeam = () => {
    setCurrentScreen("join");
  };
 
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setCurrentScreen("home"); // Reset to home screen when toggling modal
  };
 
  return (
    <>
    <div> </div>
    <div>
      <button onClick={toggleModal}>+</button>
      {modalVisible && (
        <div>
          {currentScreen === "home" && ( <CreateJoinTeamScreen setOpenModal={toggleModal} switchToCreateTeam={switchToCreateTeam} switchToJoinTeam={switchToJoinTeam} />)}
          {currentScreen === "create" && <CreateTeamOverlay switchToHome={switchToHome} />}
          {currentScreen === "join" && <JoinTeamOverlay switchToHome={switchToHome} />}
        </div>
      )}
    </div>
    </>
  );
}
 
