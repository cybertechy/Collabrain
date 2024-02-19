"use client";
import React from "react";
import Image from "next/image";
import LogoIcon from "../../public/assets/images/logo_whitebackground.png";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { RefreshCcw, FilePenLine, HelpCircle } from 'lucide-react';
import ShareComponent from "../../components/ui/share";
const { useAuthState, getToken } = require("_firebase/firebase");
import { ToastContainer, toast } from "react-toastify";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Socket from "_socket/socket";

import SearchingJSON from "../../public/assets/json/Searching.json";
import LoadingJSON from "../../public/assets/json/Loading.json";
import ErrorJSON from "../../public/assets/json/Error.json";
import WorkingJSON from "../../public/assets/json/Working.json";
import Lottie from "lottie-react";

const SOCKET_DEBUG = false;
const POINTER_DEBUG = true;

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
    const [ConcurrencyStop, setConcurrencyStop] = useState(false);
    

    /* UI states */
    const [New, setNew] = useState(false);
    const [Delete, setDelete] = useState(false);
    const [Share, setShare] = useState(false);

    const Serverlocation = "http://192.168.0.115:8080";




    let Guide = {
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: "Understood",
        closeBtnText: "Close",
        nextBtnText: "Next",
        prevBtnText: "Previous",
        keyboardControl: true,
        popoverClass: "recommendation-popover",
        steps: [
            { element: "#excalidraw", popover: { title: "Bring ideas onto life", description: "This is the content map, you can create diagrams and much more here" } },
            { element: "#ContentMapName", popover: { title: "Content Map Name", description: "You can edit the content map name by clicking on the icon" } },
            { element: "#new", popover: { title: "New Content Map", description: "You can create a new content map or create a copy of the current content map by clicking on it" } },
            { element: "#delete", popover: { title: "Delete Content Map", description: "You can delete the current content map by clicking on it" } },
            { element: "#share", popover: { title: "Share Content Map with others", description: "You can share the current content map to others by clicking on it" } },
            { element: "#save", popover: { title: "Saved Status", description: "This icon shows the saving status of the content map" } },
        ]
    };


    const router = useRouter();
    const searchParms = useSearchParams();
    const driverObj = driver(Guide);
    let sockCli = useRef(null);
    const abortController = new AbortController();

    ///Load excalidraw
    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) => {
            setExcalidraw(comp.Excalidraw)
        });
    }, []);

    // load excalidraw Data
    useEffect(() => {

        if (!user) return;

        getToken()?.then((token) => {
            setToken(token);
            getInitialData(token).then((res) => {
                setIntialData(res);
            });
        })

    }, [user]);

    // Recieve collabData
    useEffect(() => {
        if (!ExcalidrawAPI) return;
        if (!sockCli.current) return;

        sockCli.current.on('updateCollabData', (updateInfo) => {

            if (SOCKET_DEBUG) {
                console.log(ExcalidrawAPI.getAppState());
                console.log("Received collabData");
                console.log(updateInfo);
            }

            if (updateInfo?.activeMembers?.length > 0) setCollabaration(true);
            else setCollabaration(false);

            // filter out collabortors that have button up
            updateInfo.collaborators = updateInfo.collaborators.filter((collaborator) => collaborator.button === "down" && collaborator.id !== user.uid);

            // abort any ongoing requests
            if(updateInfo?.collaborators?.length > 0){
                abortController.abort();
                setConcurrencyStop(true);
            }
           

            ExcalidrawAPI.updateScene({ elements: updateInfo.elements, collaborators: updateInfo.collaborators, appState: { files: updateInfo.files } });

            //timeout to prevent concurrency
            if(updateInfo?.collaborators?.length > 0) setTimeout(() => {
                setConcurrencyStop(false);
            }, 1000);
        });


        sockCli.current.on("reconnectRoom", (data) => {
            sockCli.current.emit('startCollab', { user: { id: user.uid, name: (user.displayName) ? user.displayName : "Anonymous" }, id: id });

            let appState = ExcalidrawAPI.getAppState();
            let appdata = {
                elements: ExcalidrawAPI.getSceneElements(),
                appState: appState,
                files: ExcalidrawAPI.getFiles(),
                collaborators: { ...appState.collaborators }
            }

            sockCli.current.emit('collabData', { id: id, user: user.uid, data: appdata });
        });
    }, [ExcalidrawAPI, sockCli.current]);

    // Update pointer state
    useEffect(() => {
        if (!ExcalidrawAPI) return;
        if (!pointerState) return;
        if (!Collabaration) return;

        let appState = ExcalidrawAPI.getAppState();
        // find the index (if exists) of the user in the collaborators array

        let index = appState.collaborators.findIndex((collaborator) => collaborator.id === user.uid);
        if (index === -1) index = appState.collaborators.length;
        let mstate = appState.collaborators[index];
        mstate = {
            pointer: {
                x: pointerState.pointer.x,
                y: pointerState.pointer.y,
            },
            button: pointerState.button,
            username: (user.displayName) ? user.displayName : "Anonymous",
            id: user.uid,
            selectedElementIds: appState.selectedElementIds,
        }

        // TEMP : send the current user mstate to the room
        if(POINTER_DEBUG) {
            console.log("Sending mstate");
            console.log({ id: id, user: user.uid, data: { collaborators: [...appState.collaborators.slice(0, index), mstate, ...appState.collaborators.slice(index + 1)] } });
        }
        if (sockCli.current && mstate.button==="down" ) sockCli.current.emit('collabData', { id: id, user: user.uid, data: { collaborators: [...appState.collaborators.slice(0, index), mstate, ...appState.collaborators.slice(index + 1)] } });


    }, [pointerState, ExcalidrawAPI, Collabaration]);

    // Start collab 
    useEffect(() => {
        if (!user || !id || !sockCli.current) return;
        if (SOCKET_DEBUG) console.log("Starting collab");

        sockCli.current.emit('startCollab', { user: { id: user.uid, name: (user.displayName) ? user.displayName : "Anonymous" }, id: id });

        sockCli.current.io.on('reconnect', () => {
            sockCli.current.emit('startCollab', { user: { id: user.uid, name: (user.displayName) ? user.displayName : "Anonymous" }, id: id });
        });

        sockCli.current.io.on('reconnect_failed', () => {
            setCollabaration(false);
        });

    }, [id, user, sockCli.current]);

    // Initialize driver.js for the first time / Set up socket
    useEffect(() => {
        let createdAt = IntialData?.createdAt;
        let updatedAt = IntialData?.updatedAt;
        if (!IntialData) return;

        if (ExcalidrawAPI && ContentMapName == "New Content Map" && IntialData && createdAt === updatedAt) driverObj.drive();

        if ((IntialData?.userAccess === "edit" || IntialData?.userAccess === "owner")) sockCli.current = Socket.init(Serverlocation, {
            reconnection: true,
        }) || {};

        if (sockCli.current) sockCli.current.on('roomFull', (data) => {
            toast.error(data.msg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
            setCollabaration(false);
        });
    }, [IntialData, ExcalidrawAPI, ContentMapName, sockCli.current]);




    const getInitialData = async (token) => {
        let id = searchParms.get("id");
        if (!token || !id) return null;

        setid(id);

        try {
            const res = await axios.get(`${Serverlocation}/api/maps/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
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
            if (err?.response?.data) setError(err.response.data);
            else if (err.message) setError({ error: err.message });
            return null;
        }
    }

    const NewContentMap = async () => {
        let token = await getToken();
        if (!token) return null;

        let backup = IntialData;
        setIntialData(null);
        setOverrideMessage("Creating new content map, Please wait ...");
        setNew(false);

        try {
            const res = await axios.post(`${Serverlocation}/api/maps`, {
                name: "New Content Map",
                data: ""
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setNew(false);
            if (res.status !== 200) return null;

            setid(res.data.id);
            setIntialData({ name: "New Content Map", data: "", userAccess: "owner" });
            setContentMapName("New Content Map");
            setisOwner(true);
            setOverrideMessage("");

            router.push(`/contentmap?id=${res.data.id}`);
        }
        catch (err) {
            console.log(err);
            toast.error("Error creating new content map", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
            setIntialData(backup);
            return null;
        }
    }

    const duplicateContentMap = async () => {
        let token = await getToken();
        if (!token) return null;

        let appdata = {
            elements: ExcalidrawAPI.getSceneElements(),
            appState: ExcalidrawAPI.getAppState(),
            files: ExcalidrawAPI.getFiles(),
        }

        setIntialData(null);
        setOverrideMessage("Creating new content map, Please wait ...");
        setNew(false);

        try {
            const res = await axios.post(`${Serverlocation}/api/maps`, {
                name: ContentMapName + " (copy)",
                data: appdata
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setNew(false);
            if (res.status !== 200) return null;

            setid(res.data.id);
            setIntialData({ name: ContentMapName + " (copy)", data: JSON.stringify(appdata), userAccess: "owner" });
            setContentMapName(ContentMapName + " (copy)");
            setisOwner(true);
            setOverrideMessage("");

            router.push(`/contentmap?&id=${res.data.id}`);

        }
        catch (err) {
            console.log(err);
            toast.error("Error creating new content map", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
            setIntialData(backup);
            return null;
        }

    }

    const DeleteContentMap = async () => {
        let token = await getToken();
        if (!token) return null;
        driverObj.destroy();

        let backup = IntialData;
        setIntialData(null);
        setOverrideMessage("Deleting content map, Please wait ...");
        setDelete(false);

        try {
            const res = await axios.delete(`${Serverlocation}/api/maps/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setDelete(false);
            if (res.status !== 200) return null;


            setid(null);
            setIntialData(null);
            setContentMapName("New Content Map");
            setisOwner(false);
            setOverrideMessage("");
            router.push(`/dashboard`);
        }
        catch (err) {
            console.log(err);
            toast.error("Error deleting content map", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });

            setIntialData(backup);
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
        axios.put(`${Serverlocation}/api/maps/${id}`, { name: ContentMapName }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setIsEditing(false);
            setisSaved(true);
        })
    };

    const updatecontent = async (data) => {
        try {
            let res = await axios.put(`${Serverlocation}/api/maps/${id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                timeout: 100000

            })

            return res;

        } catch (err) {

            return null
        }
    }

    const updatecontentmap = async (data) => {
        if (!(pointerState?.button === "down" && data.button === "up")) {
            setPointerState(data);
            return;
        }

        

        setPointerState(data);
        setisSaved(false);

        if (!ExcalidrawAPI) {
            updatecontentmap(data);
            return;
        }

        let appState = ExcalidrawAPI.getAppState();
        let appdata = {
            elements: ExcalidrawAPI.getSceneElements(),
            appState: {
                originSnapOffset: appState.originSnapOffset,
                penMode: appState.penMode,
                ViewModeEnabled: appState.ViewModeEnabled,
                viewBackgroundColor: appState.viewBackgroundColor,
                zoom: appState.zoom,
            },
            files: ExcalidrawAPI.getFiles(),
            collaborators: appState.collaborators
        }

        if (SOCKET_DEBUG) {
            console.log("Emitting collabData");
            console.log(appdata);
        }
        if (sockCli.current) sockCli.current.emit('collabData', { id: id, user: user.uid, data: appdata });

        appdata.appState.collaborators = [];

        if(ConcurrencyStop) {
            setisSaved(false);
            
            return;
        }

        let res = await updatecontent({ name: IntialData?.name, data: appdata })


        if (res?.status === 200) setisSaved(true);
    }

    const getdata = async (query) => {
        try {
            let res = await axios.get(`${Serverlocation}/api/maps/ut/search?${query}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })

            return res;
        } catch (err) {
            return null;
        }
    }

    if (!user) return <div className="flex flex-col justify-center items-center text-basicallydark">
        <h1>You're not signed in</h1>
    </div>

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
                            <div className="flex items-center gap-2">
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
                        <button className="flex justify-center items-center gap-3" onClick={() => driverObj.drive()} >
                            <HelpCircle className="text-basicallylight" width={20} height={20} />
                            <p className="hidden lg:block text-basicallylight"> Help </p>
                        </button>
                    </div>

                    {/* Lower part of navbar */}
                    <div className="flex items-center gap-4 p-0 h-[50%]">
                        <button id="new" onClick={() => setNew(New => !New)} className=" text-basicallylight rounded-md ">New</button>
                        { /* New button dropdown containing first new content map, second new doument, It should be right below the new button*/
                            New && <div className="absolute z-10 top-[12%] left-[80px] bg-basicallylight rounded-md shadow-md p-2 flex flex-col gap-2">
                                <button onClick={NewContentMap} className="text-primary">New Content Map</button>
                                <button onClick={duplicateContentMap} className="text-primary">Create a copy</button>
                            </div>
                        }
                        <button id="delete" disabled={!(id && IntialData && Excalidraw) || !isOwner} onClick={() => setDelete(Delete => !Delete)} className=" text-basicallylight rounded-md ">Delete</button>
                        { /* Ask for confirmation before deleting the content map in the center of screen as pop out*/
                            id && IntialData && Excalidraw && Delete && <div className="absolute z-10 top-[50%] lg:left-[40%] md:left-[30%] left-[15%] w-72 bg-basicallylight rounded-md shadow-md py-2 px-4 flex flex-col gap-2 border border-primary">
                                <h1 className="text-xl text-primary">Are you sure you want to delete this content map?</h1>
                                <hr className="border-primary" />
                                <div className="flex gap-8">
                                    <button onClick={DeleteContentMap} className="text-basicallylight text-xl bg-primary rounded-lg px-3 py-1">Yes</button>
                                    <button onClick={() => setDelete(Delete => !Delete)} className="text-primary text-xl">No</button>
                                </div>
                            </div>
                        }
                        <button disabled={!(id && IntialData && Excalidraw)} id="share" onClick={() => setShare(Share => !Share)} className="rounded-lg text-basicallylight">Share</button>
                        {Share && <div className="absolute z-10 top-[13%] lg:left-[200px] left-[10px] md:left-[100px] bg-basicallylight rounded-md shadow-md p-2 flex flex-col gap-2 border border-primary">
                            <ShareComponent getdata={getdata} updatecontent={updatecontent} contentMapName={IntialData?.name} setShare={setShare} sData={IntialData?.Access} isOwner={isOwner} />
                        </div>}

                        {(IntialData?.userAccess === "edit" || IntialData?.userAccess === "owner") && <div id="save" className="flex items-center gap-2 bg-basicallylight text-primary rounded-md  px-2 py-1 ">
                            <p className={`rounded-t-lg `}> <RefreshCcw width={20} height={20} className={`${!isSaved && "animate-spin"}`} />  </p>
                            <p className="lg:block hidden  "> {isSaved ? "Saved" : "Saving..."}</p>
                        </div>}
                    </div>
                </div>
            </div>


        </div>
        <div id="excalidraw" className="w-screen h-[88%] flex justify-center items-center text-basicallydark">
            {id && IntialData && Excalidraw && <Excalidraw
                key={id}

                ViewModeEnabled={ViewMode}
                isCollaborating={Collabaration}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                initialData={IntialData?.data ? JSON.parse(IntialData?.data) : null}
                onPointerUpdate={updatecontentmap}
                libraryReturnUrl={window.location.origin + window.location.pathname + `?id=${id}&`}
            >
            </Excalidraw>

            }
            {!id && <div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={SearchingJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10 text-center"> Searching the cloud, Please wait ...</h1>
            </div>
            }
            {id && !Excalidraw && <div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={LoadingJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
            </div>
            }
            {id && Excalidraw && !IntialData && !Error && !OverrideMessage && <div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={WorkingJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10 text-center"> Working to load the Map ... </h1>
            </div>
            }
            {id && Excalidraw && !IntialData && Error && !OverrideMessage && <div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={ErrorJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10 text-center"> {Error.error} </h1>
            </div>
            }
            {id && Excalidraw && !IntialData && !Error && OverrideMessage && <div className="flex items-center flex-col w-screen h-[88%]">
                <Lottie animationData={WorkingJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10 text-center"> {OverrideMessage} </h1>
            </div>
            }
        </div>
    </div>
}




export default page;
