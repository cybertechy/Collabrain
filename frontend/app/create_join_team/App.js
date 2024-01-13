import React, { useState } from "react";
import "./createJoin.css";
import HomeScreen from "./createJoin";
import CreateTeamScreen from "./create";
import JoinTeamScreen from "./join";
import './App.css';
// import Navbar from "./Navbar";

 
export default function App() {
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
   
    {/* <div> <Navbar/></div> */}
    <div> </div>
    <div>
      {/* <p>click here to open the create and join team modal</p> */}
      <button onClick={toggleModal}>+</button>
      {modalVisible && (
        <div>
          {currentScreen === "home" && (
            <HomeScreen setOpenModal={toggleModal} switchToCreateTeam={switchToCreateTeam} switchToJoinTeam={switchToJoinTeam} />
          )}
          {currentScreen === "create" && <CreateTeamScreen switchToHome={switchToHome} />}
          {currentScreen === "join" && <JoinTeamScreen switchToHome={switchToHome} />}
        </div>
      )}
    </div>
    </>
  );
}
 
