"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
const { useAuthState, getToken } = require("_firebase/firebase");
import { ToastContainer, toast } from "react-toastify";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Socket from "_socket/socket";
import { TriangleAlert } from "lucide-react";
import SearchingJSON from "@/public/assets/json/Searching.json";
import LoadingJSON from "@/public/assets/json/Loading.json";
import ErrorJSON from "@/public/assets/json/Error.json";
import WorkingJSON from "@/public/assets/json/Working.json";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import FileToolbar from "@/components/ui/FileToolbar/fileToolbar";
import logo from "@/public/assets/images/logo_whitebackground.png";
import Image from "next/image";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const SOCKET_DEBUG = false;
const POINTER_DEBUG = false;

const Serverlocation = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const AIoverlay = ({ OverlayDisplay, updateExcalidraw , ExcalidrawData , UpdateScene}) => {

    const [Prompt, setPrompt] = useState("");
    const [loadingResult, setloadingResult] = useState(false);
    const [Error, setError] = useState("");

    const askAI = async () => {
        if (!Prompt) return;
        setError("");
        setloadingResult(true);
        let res = await axios.get(`${Serverlocation}/api/ai`, {
            params: {
                query: Prompt
            }
        })
        if (res.status === 200) {
            try {
                console.log(res.data)
                if(!res.data.mermaid) {
                    setError("Sorry, we could not convert the topic into a Diagram. Please try again with a different prompt.")
                    setloadingResult(false);
                    return;
                }

                parseMermaidToExcalidraw(res.data.mermaid).then((elements, files) => {
                    console.log("Parse: ", elements, files);
                   
                    if (!elements && !files && !("elements" in elements) && !("files" in files)) {
                        setError("Sorry, we could not convert the topic into a Diagram. Please try again with a different prompt.")
                    } else {
                        elements = elements.elements;
                        const ExcalidrawElements =  updateExcalidraw(elements);
                        console.log("Excalidraw elements: ",ExcalidrawElements);

                        // Generate a random id for the Excalidraw elements
                        let randomId = Math.random().toString(36).substring(7);

                        //Assign a group id to the Excalidraw elements
                        ExcalidrawElements.forEach((element) => {
                            element.groupIds = [randomId];
                        });

                        let current_elements = ExcalidrawData();
                        UpdateScene({
                            elements: [...current_elements, ...ExcalidrawElements]
                        })
                        OverlayDisplay(false);
                    }
                }).catch((err) => {
                    console.log(err);
                    setError("Sorry, we could not convert the topic into diagram. Please try again with a different prompt.");
                });
            } catch (err) {
                console.log(err);
                setError("Sorry, we could not convert the topic into diagram. Please try again with a different prompt.");
            }
        } else {
            setError("Error in fetching the result");
        }
        setloadingResult(false);
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white w-[80%] h-[80%] flex flex-col rounded-xl">
                <div className="w-full h-[10%] bg-primary text-white flex items-center justify-between py-2 px-3" >
                    <p className="text-xl text-center">Text to Diagram</p>
                    {/* Close Button */}
                    <button onClick={() => OverlayDisplay(false)} className="text-white bg-primary px-2 md:px-4 lg:px-6  py-1 rounded-md border">Close</button>
                </div>
                <div className="w-full h-[4%] flex flex-row  items-center mt-8">
                   <p className=" ml-2 lg:ml-6">  <span className="text-red-600 font-semibold">Beta:</span>  Kindly note this is an AI based exprimental feature and may or may not show valid result</p>
                </div>
                <div className="w-full h-[85%] flex flex-col items-center gap-3 pt-10">
                    <p className="text-lg font-semibold text-primary"> Enter the topic </p>
                    <textarea value={Prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="w-[90%] h-[50%] border-2 border-primary rounded-md p-2" />
                    <button onClick={askAI} className="text-white bg-primary px-2 md:px-4 lg:px-6  py-1 rounded-md border">Convert</button>
                    {loadingResult && <Lottie animationData={LoadingJSON} style={{ width: 50, height: 50 }} />}
                    {loadingResult && <p className="text-primary animate-pulse font-semibold">Loading...</p>}
                    {Error && <p className="text-red-800 font-semibold px-2">{Error}</p>}
                </div>

            </div>
        </div>
    )
}


function page() {
    const { t } = useTranslation('content_map');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [token, setToken] = useState(null);
    const [Excalidraw, setExcalidraw] = useState(null);
    const [ExcalidrawOtherComponents, setExcalidrawOtherComponents] = useState(null);
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
    const [AI, setAI] = useState(false);


    let Guide = {
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: t('doneBtn'),
        closeBtnText: t('closeBtn'),
        nextBtnText: t('nextBtn'),
        prevBtnText: t('prevBtn'),
        keyboardControl: true,
        popoverClass: "recommendation-popover",
        steps: [
            { element: "#excalidraw", popover: { title: t('msg1_title'), description: t('msg1') } },
            { element: "#Name", popover: { title: t('msg2_title'), description: t('msg2') } },
            { element: "#share", popover: { title: t('msg3_title'), description: t('msg3') } },
            { element: "#save", popover: { title: t('msg4_title'), description: t('msg4') } },
        ]
    };

    const searchParms = useSearchParams();
    const driverObj = driver(Guide);
    let sockCli = useRef(null);
    const abortController = new AbortController();

    ///Load excalidraw
    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) => {
            setExcalidraw(comp.Excalidraw)
            setExcalidrawOtherComponents(comp)
            console.log(comp)
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
            try {
                updateInfo.collaborators = updateInfo?.collaborators?.filter((collaborator) => collaborator.button === "down" && collaborator.id !== user.uid);
            } catch (err) {
                console.log(err);
                updateInfo.collaborators = [];
            }


            // abort any ongoing requests
            if (updateInfo?.collaborators?.length > 0) {
                abortController.abort();
                setConcurrencyStop(true);
            }

            if (updateInfo?.BroadcasterID === user.uid) return;


            let appElements = ExcalidrawAPI.getSceneElements();
            let mergeElements = []
            if (updateInfo?.elements) {
                mergeElements = updateInfo?.elements?.map((element) => {
                    let index = appElements.findIndex((appElement) => appElement.id === element.id);
                    if (index === -1) return element;
                    return { ...appElements[index], ...element };
                });
            } else {
                mergeElements = appElements;
            }

            // unlock the elements
            if (updateInfo?.unLockElement?.length > 0) {
                mergeElements = mergeElements.map((element) => {
                    if (updateInfo?.unLockElement?.includes(element.id)) {
                        element.isLocked = false;
                        element.locked = false;
                    }
                    return element;
                });
            }

            // Lock the selected elements
            if (updateInfo?.selectedElementIds?.length > 0) {
                mergeElements = mergeElements.map((element) => {
                    if (updateInfo?.selectedElementIds?.includes(element.id)) {
                        element.isLocked = true;
                        element.locked = true;
                    }
                    return element;
                });
            }


            let updateData = {
                elements: mergeElements,
                appState: { ...ExcalidrawAPI.getAppState(), ...updateInfo.appState },
                collaborators: updateInfo.collaborators
            }


            ExcalidrawAPI.updateScene(updateData);

            //timeout to prevent concurrency
            if (updateInfo?.collaborators?.length > 0) setTimeout(() => {
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
                collaborators: { ...appState.collaborators },
                BroadcasterID: user.uid
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
        if (!appState) return;
        if (!appState.collaborators) return;
        // find the index (if exists) of the user in the collaborators array
        let index = -1;

        try {
            index = appState?.collaborators?.findIndex((collaborator) => collaborator.id === user.uid);
        } catch (err) {
            console.log(err);
            return;
        }
        if (index === null) index = -1;
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
        let ShareData = {
            id: id,
            user: user.uid,
            data: { collaborators: [...appState.collaborators.slice(0, index), mstate, ...appState.collaborators.slice(index + 1)] },
            BroadcasterID: user.uid
        }

        // TEMP : send the current user mstate to the room
        if (POINTER_DEBUG) {
            console.log("Sending Ponter State: ", ShareData);
            console.log("AppState: ", appState);
        }

        if (sockCli.current && mstate.button === "down") sockCli.current.emit('collabData', ShareData);


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

        return () => sockCli.current.emit("stopCollab", { user: { id: user.uid, name: (user.displayName) ? user.displayName : "Anonymous" }, id: id });

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
            console.log(res.data);
            console.log(user)
            return res.data;
        }
        catch (err) {
            // If there is an axios error, set the error state    
            if (err?.response?.data) setError(err.response.data);
            else if (err.message) setError({ error: err.message });
            return null;
        }
    }


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

            },
            files: ExcalidrawAPI.getFiles(),
            collaborators: appState.collaborators,
            unLockElement: Object.keys(appState.selectedElementIds).filter((id) => appState.selectedElementIds[id]),
            BroadcasterID: user.uid
        }

        if (SOCKET_DEBUG) {
            console.log("Emitting collabData");
            console.log(appdata);
        }
        if (sockCli.current) sockCli.current.emit('collabData', { id: id, user: user.uid, data: appdata });

        appdata.appState.collaborators = [];

        if (ConcurrencyStop) {
            setisSaved(false);

            return;
        }

        let res = await updatecontent({ name: IntialData?.name, data: appdata })


        if (res?.status === 200) setisSaved(true);
    }

    const setpublic = (data) => setIntialData({ ...IntialData, public: data });

    if (loading || !user) {
        return (
            <div className="bg-[#F3F3F3] w-screen h-full flex flex-col justify-center items-center text-basicallydark">
                <Lottie animationData={LoadingJSON} style={{ width: 300, height: 300 }} />
                <h1 className="text-2xl font-bold text-primary px-10">Loading...</h1>
            </div>
        );
    }

    return <div>
        {id && user && IntialData?.Access && <FileToolbar publicData={IntialData?.public} setpublicData={setpublic} isSaved={isSaved} commentsEnabled={false} fileID={id} fileData={{ access: IntialData?.Access }} fileType="map" name={ContentMapName} userID={user.uid}></FileToolbar>}
        <div className="flex justify-center items-center flex-col h-[85vh] w-[100vw] md:w-[88vw] lg:w-[94vw] overflow-hidden">
            <ToastContainer />
            <div id="excalidraw" className=" h-[100%] w-[100%] flex justify-center items-center text-basicallydark">
                {id && IntialData && Excalidraw && <Excalidraw
                    key={id}
                    ViewModeEnabled={ViewMode}
                    isCollaborating={Collabaration}
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    initialData={IntialData?.data ? JSON.parse(IntialData?.data) : null}
                    onPointerUpdate={updatecontentmap}
                    libraryReturnUrl={window.location.origin + window.location.pathname + `?id=${id}&`}
                    renderTopRightUI={() => {
                        return (
                            <button
                                className="text-white bg-primary px-2 md:px-4 lg:px-6  py-1 rounded-md"
                                onClick={() => setAI(AI => !AI)}
                            >
                                AI
                            </button>
                        );
                    }}
                >
                    <ExcalidrawOtherComponents.WelcomeScreen>
                        <ExcalidrawOtherComponents.WelcomeScreen.Center>
                            <ExcalidrawOtherComponents.WelcomeScreen.Center.Logo>
                                <Image src={logo} alt="logo" width={200} height={200} />
                            </ExcalidrawOtherComponents.WelcomeScreen.Center.Logo>
                            <ExcalidrawOtherComponents.WelcomeScreen.Center.Heading>
                                <h1 className="text-2xl font-bold text-primary">Welcome to Collabrain Content Map</h1>
                            </ExcalidrawOtherComponents.WelcomeScreen.Center.Heading>
                        </ExcalidrawOtherComponents.WelcomeScreen.Center>
                    </ExcalidrawOtherComponents.WelcomeScreen>
                </Excalidraw>
                }

                {AI && <AIoverlay ExcalidrawData={ExcalidrawAPI.getSceneElements} updateExcalidraw={ExcalidrawOtherComponents.convertToExcalidrawElements} OverlayDisplay={setAI} UpdateScene={ExcalidrawAPI.updateScene} />}
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
    </div>
}




export default page;