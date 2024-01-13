"use client";
import React from "react";

import Image from "next/image";
import LogoIcon from "../../public/assets/images/logo_whitebackground.png";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
const { isAuth, getToken } = require("_firebase/auth");




function page({ IntialDataContent }) {
    const [token, setToken] = useState(null);
    const [Excalidraw, setExcalidraw] = useState(null);
    const [ExcalidrawAPI, setExcalidrawAPI] = useState(null);
    const [Collabaration, setCollabaration] = useState(false);
    const [ViewMode, setViewMode] = useState(false);
    const [IntialData, setIntialData] = useState(null);
    const [id, setid] = useState(null);
    const [pointerState, setPointerState] = useState(null);
    const [isSaved, setisSaved] = useState(true);

    const searchParams = useSearchParams();


    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) =>
            setExcalidraw(comp.Excalidraw),
        );
    }, []);

    useEffect(() => {
        getToken().then((token) => {
            setToken(token);
            getInitialData(token).then((res) => {
                setIntialData(res);
            });
        });
    }, [isAuth()]);

    useEffect(() => {

        if(pointerState?.button!=="up") {
            setisSaved(false);
            return;
        }

        let appdata = {
            elements: ExcalidrawAPI.getSceneElements(),
            //appState: ExcalidrawAPI.getAppState(),
            files: ExcalidrawAPI.getFiles(),
        }

        // make axois put rquest with token in header to update the content map, pass data (appState) in body
        axios.put(`http://localhost:8080/api/contentmap/${id}`,{name: IntialData?.name, data: appdata } , {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res)=>{
            console.log(res.data);
            setisSaved(true);
        })
        

       
    }, [pointerState]);

    const getInitialData = async (token) => {
        let id = searchParams.get("id");
        if (!token || !id) return null;

        setid(id);

        // pass token in header authorization as bearer to authenticate
        const res = await axios.get(`http://localhost:8080/api/contentmap/${id}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    }


    return <div className="flex justify-center items-center flex-col h-screen w-screen">
        <div className="flex justify-between items-center w-screen h-[12%]  bg-purple-600 p-3 ">
            <div className="flex">
                <Image src={LogoIcon} alt="Collabrain logo" width={75} height={50} />
                <div className="flex flex-col ml-8 gap-2">
                    <h1 className="text-white text-xl mt-2">{IntialData ? IntialData.name : "Content Map"}</h1>
                    <div className="flex gap-4">
                        <button className=" text-white rounded-md px-1 py-1 ">New</button>
                        <button className=" text-white rounded-md px-1 py-1 ">Delete</button>
                        <button className=" text-white rounded-md px-1 py-1 ">Insert</button>
                        <button className=" text-white rounded-md px-1 py-1 ">View</button>
                        <button className="bg-white text-purple-600 rounded-lg px-3 py-1">Share</button>
                    </div>
                </div>
            </div>


        </div>
        <div className="w-screen h-[88%] flex justify-center items-center">
            {id && Excalidraw && <Excalidraw
                renderTopRightUI={() => (
                    <>
                    <button className="bg-blue-600 py-1 px-3  text-white rounded-xl" onClick={() => setCollabaration(Collabaration => !Collabaration)}>
                        {Collabaration ? "Stop" : "Start"} Collaboration
                    </button>
                    <p className={`text-white rounded-lg px-2 py-1 ${isSaved? "bg-green-600":"bg-red-600"}`}> {isSaved ? "Saved":"Unsaved"}</p>
                    </>
                )}
                ViewModeEnabled={ViewMode}
                isCollaborating={Collabaration}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                initialData={IntialData ? JSON.parse(IntialData?.data) : null}
                onPointerUpdate={(payload) => setPointerState(payload)}
            />}
            {!id && <h1 className="text-2xl font-bold text-purple-500"> Searching the cloud, Please wait ..</h1>}
            {id && !Excalidraw && <h1 className="text-2xl font-bold text-purple-500">Loading...</h1>}
        </div>
    </div>
}




export default page;
