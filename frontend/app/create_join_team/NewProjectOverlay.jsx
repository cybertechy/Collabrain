import React, { useState } from "react";
 
const NewProjectOverlay =() =>{
  const [modalVisible, setModalVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("contentMap");
 
  const switchToContent = () => setCurrentScreen("contentMap");
  const switchToDocument = () => setCurrentScreen("document");

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setCurrentScreen("contentMap"); 
  };
 
  return (
    <>
    <div>
      {modalVisible && (
        <div>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-20 backdrop-blur-sm"> 
          {currentScreen === "contentMap" && ( <ContentMapOverlay setOpenModal={toggleModal} switchToDocument={switchToDocument}  />)
          }
          {currentScreen === "document" && <DocumentOverlay switchToContent={switchToContent} />
          }
          </div>
        </div>
      )}
    </div>
    </>
  );
}
 

const ContentMapOverlay = ({ setOpenModal, switchToDocument }) => {
return (
    <>
    <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-2/4 h-3/5 shadow-lg bg-white rounded-md "> 
            <div className="bg-[url('./pics/bgDesign.png')] w-full h-full bg-contain bg-no-repeat bg-left">
                  <div className="flex justify-end">
                  <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' onClick={setOpenModal}>X</button>
                  </div>
                  <div className=" text-center mt-24 flex justify-center">
                    <p className='text-2xl block text-center font-light'>Choose the type of project you would like to create</p>
                  </div>
                  <div className=" h-32 mt-30 justify-center grid grid-rows-2 gap-10">

                    <button className="flex mt-11 mr-10 w-56 h-16 text-white font-normal rounded text-lg  dark:bg-purple-400 dark:hover:bg-purple-500">
                      <img className='h-6 mt-4 ml-3'src= {require('./pics/content.png')}/>
                      <p className="mt-4 ml-8">Content Map</p></button>
                    <button className="flex mt-11 mr-10 w-56 h-16 text-black font-normal rounded text-lg" onClick={switchToDocument}>
                    <p className="mt-4 ml-16">Document</p></button>
                  </div>
                  <div className="mt-36 flex justify-end">
                    <button className="mr-10 w-44 h-12  text-white bg-purple-600 hover:bg-purple-700  font-normal rounded text-lg shadow-xl ">Create Project</button>
                  </div>
          </div>
      </div>
    </div>

    </>
      );
}

const DocumentOverlay=({ setOpenModal, switchToContent }) => {
    return (
        <>
        <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
            <div className="w-2/4 h-3/5 shadow-lg bg-white rounded-md ">
            
                  <div className="flex justify-end">
                  <button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' onClick={setOpenModal}>X</button>
                  </div>
                  <div className=" text-center mt-24 flex justify-center">
                    <p className='text-2xl block text-center font-light'>Choose the type of project you would like to create</p>
                  </div>
                  <div className="bg-[url('./pics/bgDesign2.png')] w-full h-28 bg-contain bg-no-repeat bg-left">
                  <div className=" h-32 mt-30 justify-center grid grid-rows-2 gap-10">

                    <button className="flex mt-11 mr-10 w-56 h-16 text-black font-normal rounded text-lg " onClick={switchToContent}>
                      <p className="mt-4 ml-16">Content Map</p></button> 
                      <img className='h-7 mt-4 ml-3'src= {require('./pics/doc.png')}/>
                    <button className="flex mt-11 mr-10 w-56 h-16 text-white font-normal rounded text-lg dark:bg-purple-400 dark:hover:bg-purple-500">
                    <img className='h-7 mt-4 ml-3'src= {require('./pics/doc.png')}/>
                    <p className="mt-4 ml-10">Document</p></button>
                  </div>
                  <div className="mt-36 flex justify-end">
                    <button className="mr-10 w-44 h-12  text-white bg-purple-600 hover:bg-purple-700  font-normal rounded text-lg shadow-xl ">Create Project</button>
                  </div>
          </div>
                
            </div>
        </div>
    
        </>
          );
}
export default NewProjectOverlay;
