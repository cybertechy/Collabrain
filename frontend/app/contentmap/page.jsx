"use client";
import React from "react";

import Image from "next/image";
import LogoIcon from "../../public/assets/images/logo_whitebackground.png";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
const { isAuth, getToken } = require("_firebase/auth");




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



    /* UI states */
    const [New, setNew] = useState(false);
    const [Delete, setDelete] = useState(false);

    const router = useRouter();
    const searchParms = useSearchParams();



    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) =>
            setExcalidraw(comp.Excalidraw),
        );
    }, []);

    useEffect(() => {
        getToken().then((token) => {
            setToken(token);
            getInitialData(token).then((res) => {
                setContentMapName(res?.name);
                setIntialData(res);
            });
        });
    }, [isAuth()]);

    useEffect(() => {

        if (pointerState?.button !== "up") {
            setisSaved(false);
            return;
        }

        let appdata = {
            elements: ExcalidrawAPI.getSceneElements(),
            //appState: ExcalidrawAPI.getAppState(),
            files: ExcalidrawAPI.getFiles(),
        }

        // make axois put rquest with token in header to update the content map, pass data (appState) in body
        axios.put(`http://localhost:8080/api/contentmap/${id}`, { name: IntialData?.name, data: appdata }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setisSaved(true);
        })



    }, [pointerState]);

    const getInitialData = async (token) => {
        let id = searchParms.get("id");
        if (!token || !id) return null;

        setid(id);

        try {
            const res = await axios.get(`http://localhost:8080/api/contentmap/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            if (res.status !== 200) return null;
            return res.data;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const NewContentMap = async () => {
        let token = await getToken();
        if (!token) return null;

        try {
            const res = await axios.post(`http://localhost:8080/api/contentmap`, {
                name: "New Content Map",
                data: ""
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setNew(false);
            if (res.status !== 200) return null;

            console.log(res.data);

            setid(res.data.id);
            setIntialData({ name: "New Content Map", data: "" });
            router.push(`/contentmap?id=${res.data.id}`);
            router.reload();
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const DeleteContentMap = async () => {
        let token = await getToken();
        if (!token) return null;

        try {
            const res = await axios.delete(`http://localhost:8080/api/contentmap/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setDelete(false);
            if (res.status !== 200) return null;

            setid(null);
            setIntialData(null);
            router.push(`/dashboard`);
            router.reload();
        }
        catch (err) {
            console.log(err);
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
        axios.put(`http://localhost:8080/api/contentmap/${id}`, { name: ContentMapName }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setIsEditing(false);
            setisSaved(true);
        })
    };



    return <div className="flex justify-center items-center flex-col h-screen w-screen">
        <div className="flex justify-between items-center w-screen h-[12%]  bg-purple-600 p-3 ">
            <div className="flex">
                <Link href="/dashboard">
                    <Image src={LogoIcon} alt="Collabrain logo" width={75} height={50} />
                </Link>
                <div className="grid grid-rows-2 grid-cols-1 ml-8">
                    <div>
                        {isEditing ? (
                            <input
                                className="text-white bg-transparent border-b-2 border-white outline-none p-1"
                                type="text"
                                value={ContentMapName}
                                onChange={handleInputChange}
                                onBlur={handleSaveClick}
                            />
                        ) : (
                            <h1 className="text-white text-xl mt-2" onClick={handleEditClick}>
                                {ContentMapName}
                            </h1>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setNew(New => !New)} className=" text-white rounded-md px-1 py-1 ">New</button>
                        { /* New button dropdown containing first new content map, second new doument, It should be right below the new button*/
                            New && <div className="absolute z-10 top-[12%] left-[80px] bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
                                <button onClick={NewContentMap} className="text-purple-600">New Content Map</button>
                                <button className="text-purple-600">New Document</button>
                            </div>
                        }
                        <button disabled={!(id && IntialData && Excalidraw)} onClick={() => setDelete(Delete => !Delete)} className=" text-white rounded-md px-1 py-1 ">Delete</button>
                        { /* Ask for confirmation before deleting the content map in the center of screen as pop out*/
                            id && IntialData && Excalidraw && Delete && <div className="absolute z-10 top-[50%] left-[35%] bg-white rounded-md shadow-md py-2 px-4 flex flex-col gap-2 border border-purple-600">
                                <h1 className="text-xl text-purple-600">Are you sure you want to delete this content map?</h1>
                                <hr className="border-purple-600" />
                                <div className="flex gap-8">
                                    <button onClick={DeleteContentMap} className="text-white text-xl bg-purple-600 rounded-lg px-3 py-1">Yes</button>
                                    <button onClick={() => setDelete(Delete => !Delete)} className="text-purple-600 text-xl">No</button>
                                </div>
                            </div>


                        }
                        <button className=" text-white rounded-md px-1 py-1 ">Insert</button>
                        <button className=" text-white rounded-md px-1 py-1 ">View</button>
                        <button className="bg-white text-purple-600 rounded-lg px-2 py-1">Share</button>
                    </div>
                </div>
            </div>


        </div>
        <div className="w-screen h-[88%] flex justify-center items-center">
            {id && IntialData && Excalidraw && <Excalidraw
                key={id}
                renderTopRightUI={() => (
                    <>
                        {/* <button className="bg-blue-600 py-1 px-3  text-white rounded-xl" onClick={() => setCollabaration(Collabaration => !Collabaration)}>
                        {Collabaration ? "Stop" : "Start"} Collaboration
                    </button> */}
                        <p className={`text-white rounded-lg px-2 py-1 ${isSaved ? "bg-green-600" : "bg-red-600"}`}> {isSaved ? "Saved" : "Unsaved"}</p>
                    </>
                )}
                ViewModeEnabled={ViewMode}
                isCollaborating={Collabaration}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                initialData={IntialData?.data ? JSON.parse(IntialData?.data) : null}
                onPointerUpdate={(payload) => setPointerState(payload)}
            />}
            {!id && <h1 className="text-2xl font-bold text-purple-500"> Searching the cloud, Please wait ..</h1>}
            {id && !Excalidraw && <h1 className="text-2xl font-bold text-purple-500 ">Loading...</h1>}
            {id && Excalidraw && !IntialData && <h1 className="text-2xl font-bold text-purple-500">Network Error, Try refreshing...</h1>}
        </div>
    </div>
}




export default page;
