
"use client";
import React from "react";

import Image from "next/image";
import LogoIcon from "_public/assets/images/logo_whitebackground.png";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { RefreshCcw, FilePenLine, HelpCircle } from 'lucide-react';
const { useAuthState, getToken } = require("_firebase/firebase");
import { ToastContainer, toast } from "react-toastify";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import SearchingJSON from "_public/assets/json/Searching.json";
import LoadingJSON from "_public/assets/json/loading.json";
import ErrorJSON from "_public/assets/json/Error.json";
import WorkingJSON from "_public/assets/json/Working.json";
import Lottie from "lottie-react";


const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

function page() {
    const [token, setToken] = useState(null);
    const [Excalidraw, setExcalidraw] = useState(null);
    
    const [ExcalidrawAPI, setExcalidrawAPI] = useState(null);
    const [Collabaration, setCollabaration] = useState(false);
    const [ViewMode, setViewMode] = useState(false);
    const [IntialData, setIntialData] = useState(null);
    const [id, setid] = useState(null);
    const [pointerState, setPointerState] = useState(null);
    const [isSaved, setisSaved] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [ContentMapName, setContentMapName] = useState("New Content Map");
    const [Error, setError] = useState(null);
    const [isOwner, setisOwner] = useState(false);
    const [user, loading] = useAuthState();
    const [OverrideMessage, setOverrideMessage] = useState("");
    const [showSignInModal, setShowSignInModal] = useState(false);

    /* UI states */
    const [New, setNew] = useState(false);
    const [Delete, setDelete] = useState(false);
    const [Share, setShare] = useState(false);


    const router = useRouter();
    const searchParms = useSearchParams();

    let Guide =   {
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: "Understood",
        closeBtnText: "Close",
        nextBtnText: "Next",
        prevBtnText: "Previous",
        keyboardControl: true,
        popoverClass: "recommendation-popover",
        steps:[
        { element: "#excalidraw", popover: { title: "Bring ideas onto life", description: "This is the content map, you can create diagrams and much more here"}},
        { element: "#ContentMapName", popover: { title: "Content Map Name", description: "You can edit the content map name by clicking on the icon"}},
        { element: "#new", popover: { title: "New Content Map", description: "You can create a new content map or create a copy of the current content map by clicking on it"}},
        { element: "#delete", popover: { title: "Delete Content Map", description: "You can delete the current content map by clicking on it"}},
        { element: "#share", popover: { title: "Share Content Map with others", description: "You can share the current content map to others by clicking on it"}},
        { element: "#save", popover: { title: "Saved Status", description: "This icon shows the saving status of the content map"}},
    ]
}
    ;

    const driverObj = driver(Guide);
   
    ///Load excalidraw
    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) =>{
            setExcalidraw(comp.Excalidraw) 
        }
        );
        console.log("Fetch data");
        getInitialData().then((res) => {
            setIntialData(res);
            console.log(res);
        });

    }, []);

    // load excalidraw Data
    useEffect(() => {
        
       
    }, []);

    // Initialize driver.js for the first time
    useEffect(() => {
        let createdAt = IntialData?.createdAt;
        let updatedAt = IntialData?.updatedAt;
        if(!IntialData) return;


        console.log(createdAt,updatedAt,ContentMapName,ExcalidrawAPI);
        if(ExcalidrawAPI && ContentMapName=="New Content Map" && IntialData && createdAt === updatedAt ) driverObj.drive();
    }, [IntialData,ExcalidrawAPI,ContentMapName])


    const getInitialData = async () => {
        console.log("Fetching data");
        let id = searchParms.get("id");
        console.log(id);
        if (!id) return null;

        setid(id);
        // console.log("Fetchingg data");

        try {
            const res = await axios.get(`${SERVERLOCATION}/api/maps/public/${id}`, {
            });
            console.log("res");
            if (res.status !== 200) {
                return null;
            }
            setisSaved(true);
            setisOwner(res.data.userAccess === "owner");
            setContentMapName(res.data.name);
            return res.data;
        }
        catch (err) {
            // If there is an axios error, set the error state  
            console.log("err");  
            if (err?.response?.data) setError(err.response.data);
            else if (err.message) setError({ error: err.message });
            return null;
        }
    }

    const handleInputChange = (e) => {
        setContentMapName(e.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setisSaved(false);

        let token = await getToken();
        if (!token) return null;

        // make axois put rquest with token in header to update the content map, pass data (appState) in body
        axios.put(`${SERVERLOCATION}/api/maps/public${id}`, { name: ContentMapName }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setIsEditing(false);
            setisSaved(true);
        })
    };

    const setpublic= (data) => setIntialData({ ...IntialData, public: data });

    // if (!user) return <div className="flex flex-col justify-center items-center text-basicallydark">
    //     <h1>You're not signed in</h1>
    // </div>

    if (loading) return <div className="flex flex-col justify-center items-center text-basicallydark">
        <h1>Loading...</h1>
    </div>


    return <div className="flex justify-center items-center flex-col h-screen w-screen">
        <ToastContainer />
        <div className="flex justify-between items-center w-screen h-[12%]  bg-primary px-3  ">
            <div className="flex w-screen h-[100%]">
                {/* Left side of navbar */}
                <div className="flex items-center">
                <Link tooltip="help" className="" href="/dashboard">
                    <Image src={LogoIcon} alt="Collabrain logo" width={75} height={50} />
                </Link>
                </div> 
                {/* Right side of navbar */}
                <div className="grid grid-rows-2 grid-cols-1 ml-8 w-[100%] pt-3 ">
                    {/* upper part of navbar */}
                    <div className=" flex items-center justify-between h-[50%] pt-1 lg:pt-0">
                        {isEditing ? (
                            <div  className="flex items-center gap-2">
                                <input
                                    className="text-basicallylight bg-transparent border-b-2 border-basicallylight outline-none p-1 no-underline"
                                    type="text"
                                    value={ContentMapName}
                                    onChange={handleInputChange}
                                    onBlur={handleSaveClick}
                                />
                                <button className="text-basicallylight" onClick={() => setIsEditing(isEditing => !isEditing)}>
                                    <FilePenLine tooltip="Edit content map name" width={20} height={20} />
                                </button>
                            </div>
                        ) : (
                            <div id="ContentMapName" className=" flex items-center gap-2"><h1 className="text-basicallylight text-lg font-semibold" onClick={handleEditClick}>
                                {ContentMapName}
                            </h1>
                                <button disabled={!isOwner} className="text-basicallylight" onClick={() => setIsEditing(isEditing => !isEditing)}>
                                    <FilePenLine width={20} height={20} />
                                </button>

                            </div>
                        )}
                        <button className="flex justify-center items-center gap-3" onClick={()=>driverObj.drive()} > 
                        <HelpCircle className="text-basicallylight" width={20} height={20} /> 
                        <p className="hidden lg:block text-basicallylight"> Help </p>
                        </button>
                    </div>

                    {/* Lower part of navbar removed*/}
                    <div className="flex items-center gap-4 p-0 h-[50%]">
                    
                        <button
                onClick={() => setShowSignInModal(true)}
                className="text-basicallylight rounded-md"
            >
                Sign up
            </button>
            {showSignInModal && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-basicallylight rounded-md shadow-md py-2 px-4 flex flex-col gap-2 border border-primary z-30">
                    <h1 className="text-xl text-primary">
                        Discover Collabrain and become a user to access exciting features apart from viewing and collaborate with your friends!
                    </h1>
                    <hr className="border-primary" />
                    <div className="flex gap-8">
                        <button onClick={() => window.location.href="/register"} className="text-basicallylight bg-primary rounded-lg px-3 py-1">
                        Discover Collabrain
                        </button>
                        <button onClick={() => setShowSignInModal(false)} className="text-primary rounded-lg border-2 border-primary px-1 py-1">
                            Cancel
                        </button>
                    </div>
                </div>
            )}       

                        
                    </div>

                    {/* sign in/become a user/ redict to sign up */}
                </div>
            </div>


        </div>
        <div id="excalidraw" className="w-screen h-[88%] flex justify-center items-center text-basicallydark">
            {id && IntialData && Excalidraw && <Excalidraw
                key={id}
                renderTopRightUI={() => (
                    <>
                        {/* <button className="bg-blue-600 py-1 px-3  text-basicallylight rounded-xl" onClick={() => setCollabaration(Collabaration => !Collabaration)}>
                        {Collabaration ? "Stop" : "Start"} Collaboration
                    </button> */}

                    </>
                )}
                ViewModeEnabled={ViewMode}
                isCollaborating={Collabaration}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                initialData={IntialData?.data ? JSON.parse(IntialData?.data) : null}
                // onPointerUpdate={updatecontentmap}
                libraryReturnUrl={window.location.origin + window.location.pathname+`?id=${id}&`}
            >
                {/* <WelcomeScreen>
                    <WelcomeScreen.Center>
                        <WelcomeScreen.Center.Logo >
                            <Image src={LogoIcon} alt="Collabrain logo" width={75} height={50} />
                        </WelcomeScreen.Center.Logo>
                        <WelcomeScreen.Center.Heading>
                            Welcome to Collabrain Content Map <br></br>
                            Select the tools from top navbar and start creating your content map
                        </WelcomeScreen.Center.Heading>
                    </WelcomeScreen.Center>
                </WelcomeScreen> */}

            </Excalidraw>

            }
            {!id && <div className="flex items-center flex-col w-screen h-[88%]">
            <Lottie animationData={SearchingJSON} style={{width:300,height:300}} />
            <h1 className="text-2xl font-bold text-primary px-10 text-center"> Searching the cloud, Please wait ...</h1>
            </div> 
            }
            {id && !Excalidraw && <div className="flex items-center flex-col w-screen h-[88%]">
            <Lottie animationData={LoadingJSON} style={{width:300,height:300}} />
            <h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
            </div>
            }
            {id && Excalidraw && !IntialData && !Error && !OverrideMessage && <div className="flex items-center flex-col w-screen h-[88%]">
            <Lottie animationData={WorkingJSON} style={{width:300,height:300}} />
            <h1 className="text-2xl font-bold text-primary px-10 text-center"> Working to load the Map ... </h1>
            </div>
            }
            {id && Excalidraw && !IntialData && Error && !OverrideMessage &&  <div className="flex items-center flex-col w-screen h-[88%]">
            <Lottie animationData={ErrorJSON} style={{width:300,height:300}} />
            <h1 className="text-2xl font-bold text-primary px-10 text-center"> {Error.error} </h1>
            </div>
            }
            {id && Excalidraw && !IntialData && !Error && OverrideMessage &&<div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={WorkingJSON} style={{width:300,height:300}} />
             <h1 className="text-2xl font-bold text-primary px-10 text-center"> {OverrideMessage} </h1>
             </div>
             }
        </div>
    </div>
}




export default page;