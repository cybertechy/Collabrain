"use client";
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
const { useRouter } = require("next/navigation");
const { useEffect, useState } = require("react");
const axios = require("axios");
import Sidebar from "../../components/ui/template/sidebar/sidebar";
import Navbar from "../../components/ui/template/navbar/navbar";
import DashboardInfoBar from "../../components/ui/dashboardComponents/dashboardInfoBar";
import DashboardFolder from "../../components/ui/dashboardComponents/dashboardFolder";
import DropdownDashboard from "../../components/ui/dashboardComponents/dropdownDashboard"; // Adjust the import path as needed
import DashboardNewFolder from "../../components/ui/dashboardComponents/dashboardNewFolder";
import DashboardProjectButton from "../../components/ui/dashboardComponents/dashboardProjectButton";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import MapIcon from "@mui/icons-material/Map";
import ContextMenu from "../../components/ui/contextMenu/contextMenu";
import UsernameOverlay from "../../components/ui/overlays/usernameOverlay";
import Template from "@/components/ui/template/template";
import CreateFolderOverlay from "../../components/ui/overlays/CreateFolderOverlay";
export default function Dashboard() {
    const [isUsernameOverlayOpen, setIsUsernameOverlayOpen] = useState(true);
    const [user, loading] = fb.useAuthState();
    const [folders, setFolders] = useState([]);
    const [Projects, setProjects] = useState([]);
    const [newFolderAdded, setNewFolderAdded] = useState(false); // State to track if a new folder has been added
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [teams, setTeams] = useState([]);
    const [folderChanges, setFolderChanges] = useState(0);
    const [projectChanges, setProjectChanges] = useState(0);
    const [contentMaps, setContentMaps] = useState([]);
    const [isContentMapsLoading, setContentMapsLoading] = useState(true);
    const [isFoldersLoading, setFoldersLoading] = useState(true);
    const [sortName, setSortName] = useState(false);
    const [sortDate, setSortDate] = useState(false);
    const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] = useState(false);

    const toggleCreateFolderOverlay = () => {
        setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
    };
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    });
    const onFolderCreated = (newFolder) => {
        setFolders(currentFolders => [...currentFolders, newFolder]);
    };
    const router = useRouter();
    let sock_cli;
    let currentDoc;
    const contextMenuOptions = [
        { text: "New Folder", icon: <FolderIcon />, onClick: () => {toggleCreateFolderOverlay()} },
        {
            text: "New Map",
            icon: <MapIcon />,
            onClick: () => {
                NewContentMap();
            },
        },
        { text: "New Document", icon: <DescriptionIcon />, onClick: () => {} },
    ];

    const openUsernameOverlay = () => {
        setIsUsernameOverlayOpen(true);
    };

    const closeUsernameOverlay = () => {
        setIsUsernameOverlayOpen(false);
    };
    const addNewFolder = (newFolder) => {
        setFolders((prevFolders) => [...prevFolders, newFolder]);

        // Increment the folderChanges count when a new folder is added
        setFolderChanges((prevCount) => prevCount + 1);
    };

    const handleFolderDeleted = (deletedFolder) => {
        // Filter out the deleted folder from the current state
        setFolders((prevFolders) =>
            prevFolders.filter((folder) => folder?.id !== deletedFolder?.id)
        );

        // Increment the folderChanges count when a folder is deleted
        setFolderChanges((prevCount) => prevCount + 1);
    };
    const renamedProject = (newFolder) => {
      

        // Increment the folderChanges count when a new folder is added
        setProjectChanges((prevCount) => prevCount + 1);
    };

    const handleProjectDeleted = (deletedProject) => {
        // Filter out the deleted project from the current state
        setProjects((prevProjects) =>
            prevProjects.filter((project) => project?.id !== deletedProject?.id)
        );
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuVisible) {
                const menuElement = document.querySelector(".context-menu");
                const clickedInsideMenu =
                    menuElement && menuElement.contains(event.target);

                if (!clickedInsideMenu) {
                    setContextMenuVisible(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextMenuVisible]);

    // Define useEffect for user state changes
    const NewContentMap = async () => {
        
        let token = await fb.getToken();

        if (!token) return null;
      
      
      
        try {
            const res = await axios.post(`http://localhost:8080/api/maps`, {
                name: "New Content Map",
                data: ""
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
      
           
            if (res.status !== 200) return null;
      
            
      
            router.push(`/contentmap?id=${res.data.id}`);
        }
        catch (err) {
            console.log(err);
            toast.error("Error creating new content map",{
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
          
            return null;
        }
      }
      
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default right-click context menu
        const xPos = e.clientX;
        const yPos = e.clientY;
        setContextMenuPosition({ x: xPos, y: yPos });
        setContextMenuVisible(true);
    };

    const handleCloseContextMenu = () => {
        setContextMenuVisible(false);
    };
    useEffect(() => {
        setNewFolderAdded(true);
    
        // Reset newFolderAdded back to false after triggering the re-fetch
        return () => {
            setNewFolderAdded(false);
        };
    }, [folders]);
    

    useEffect(() => {
        console.log(loading);
        console.log(user);
        if (user) {
            sock_cli = socket.init("http://localhost:8080");
        //    fetchTeams();
        //    fetchTeams();
           
        }
    }, [user]);

  
    // const fetchTeams = async () => {
    //     try {
    //         const token = await fb.getToken();
    //         // console.log("Token: ", token);
    //         const response = await axios.get(
    //             "http://localhost:8080/api/profile/",
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    // const fetchTeams = async () => {
    //     try {
    //         const token = await fb.getToken();
    //         // console.log("Token: ", token);
    //         const response = await axios.get(
    //             "http://localhost:8080/api/profile/",
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         console.log("Response: ", response);
    //         if (response.status === 200) {
    //             setTeams(response.data.teams);
    //         } else {
    //             console.error("Failed to fetch team data", response.status);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching team data:", error);
    //     }
    // };
    //         console.log("Response: ", response);
    //         if (response.status === 200) {
    //             setTeams(response.data.teams);
    //         } else {
    //             console.error("Failed to fetch team data", response.status);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching team data:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (user) {

    //     }
    // }, [user]);

    useEffect(() => {
        if (user) { // Check if user is logged in
            const fetchContentMaps = () => {
                new Promise((resolve, reject) => {
                    const token = fb.getToken(); // Synchronously get the token
                    if (token) {
                        resolve(token);
                    } else {
                        reject("No token found");
                    }
                })
                .then(token => {
                    console.log(token);
                    return axios.get("http://localhost:8080/api/maps", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                })
                .then(response => {
                    if (response.status === 200) {
                        setContentMaps(response.data);
                        console.log("Content Maps Fetched:", response.data);
                    } else {
                        console.error("Failed to fetch content maps data", response.status);
                    }
                })
                .catch(error => {
                    console.error("Error fetching content maps data:", error);
                })
                .finally(() => {
                    setContentMapsLoading(false); // Update loading status
                });
            };
    
            fetchContentMaps();
            console.log("Fetching content maps...");
        } else {
            console.log("User not logged in, skipping fetch");
        }
    }, [user, projectChanges]);
    const sortedContentMaps = [...contentMaps];
    if (sortName) {
        sortedContentMaps.sort((a, b) => {
            // Sort by name
            return a.name.localeCompare(b.name);
        });
    } else if (sortDate) {
        sortedContentMaps.sort((a, b) => {
            // Sort by date (assuming createdAt is a valid date string)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }
    useEffect(() => {
        if (user) { // Only proceed if the user is logged in
            console.log("Fetching folders...")
            const fetchFolders = () => {
                // Wrap the token retrieval in a Promise to handle it asynchronously
                new Promise((resolve, reject) => {
                    const token = fb.getToken(); // Synchronously get the token
                    if (token) {
                        resolve(token);
                    } else {
                        reject("No token found");
                    }
                })
                .then(token => {
                    return axios.get("http://localhost:8080/api/dashboard/folders", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                })
                .then(response => {
                    if (response.status === 200) {
                        setFolders(response.data.folders);
                    } else {
                        console.error("Failed to fetch folders data", response.status);
                    }
                })
                .catch(error => {
                    console.error("Error fetching folders data:", error);
                })
                .finally(() => {
                    setFoldersLoading(false); // Ensure loading status is updated
                });
            };
    
            fetchFolders();
        } else {
            console.log("User not logged in, skipping folder fetch");
            // Optionally, you might want to handle the UI state here for when the user is not logged in
        }
    }, [user, folderChanges]);

    const showToken = async () => {
        const token = await fb.getToken();
        return token;
    };
   
           
    if ( !user){
  
        return (
           
            <div className={``}>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-xl font-bold mb-5 text-primary">
                        {isContentMapsLoading? "Loading Projects":" Trying to sign in"}
                    </h1>
                    <div className="loader mb-5"></div>

                    <p className="text-lg font-bold text-primary mb-5 ">
                        {isContentMapsLoading? "" : "If you're not signed in, sign in "}
                        {isContentMapsLoading? "" :<span
                            className="underline cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            here
                        </span>}
                        
                    </p>
                </div>
            </div>
        );

        //need to fix this part
    }
    // NOTE: Not finished
    // Needs to be tested with backend

    const createDoc = async () => {
        // Create a new document
        const title = document.querySelector("#doc-title").value;
        const content = document.querySelector("#doc-text").value;
        const token = await getToken();

        let res = await axios
            .post("http://localhost:8080/api/doc/new", {
                token: token,
            })
            .catch((err) => console.log(err));

        if (res.status == 200) {
            currentDoc = res.data.id;
            res = await axios
                .post(`http://localhost:8080/api/doc/${currentDoc}`, {
                    token: token,
                    title: title,
                    content: content,
                })
                .catch((err) => console.log(err));
        }
    };

    const deleteDoc = async () => {
        console.log(currentDoc);
        const token = await getToken();
        let res = await axios
            .delete(`http://localhost:8080/api/doc/${currentDoc}`, {
                data: {
                    token: token,
                },
            })
            .catch((err) => console.log(err));
    };
   
    return (
        <Template>
 

<DashboardInfoBar
    sortName={sortName}
    setSortName={setSortName}
    sortDate={sortDate}
    setSortDate={setSortDate}
/>



            {/* Main Content area */}
            <div
                className="flex-grow p-4 flex flex-col"
                onContextMenu={handleContextMenu}
            >
                <ContextMenu
                    className="context-menu"
                    xPos={contextMenuPosition.x}
                    yPos={contextMenuPosition.y}
                    isVisible={contextMenuVisible}
                    onClose={handleCloseContextMenu}
                    menuOptions={contextMenuOptions}
                />

                <div>
                    <p className="text-2xl text-left text-primary ml-4 mb-4">
                        Folders
                    </p>

                    <div className="flex flex-wrap content-start items-start w-full justify-start ml-4 gap-8 ">
                    {isFoldersLoading ? (
        <div className="loader mb-t">Loading...</div> // Adjust loader class as needed
    ) : folders.length > 0 ? (
        folders.map((folder) => (
            <DashboardFolder
                key={folder?.id}
                id={folder?.id}
                title={folder?.name}
                folder={folder}
                onClick={() => {}}
                onFolderDeleted={handleFolderDeleted}
            />
        ))
    ) : null // Do not display any text if there are no folders
    }
                        <DashboardNewFolder onNewFolderCreated={addNewFolder}/>
                    </div>
                </div>
                <div>
                    <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">
                        Projects
                    </p>
                    <div
                        className="scrollbar-thin scrollbar-thumb-primary h-full  overflow-y-scroll pr-28"
                        style={{ maxHeight: "500px" }}
                    >
                        <div className="flex flex-wrap gap-4 ml-4 justify-start">
                            {console.log("Content Maps:", contentMaps)}
                            
                            {isContentMapsLoading ? (
                <div className="loader mb-t">Loading...</div> // Adjust loader class as needed
            ) : sortedContentMaps.length > 0 ? (
                sortedContentMaps.map((contentMap) => (
                    <DashboardProjectButton
                        id={contentMap?.id}
                        key={contentMap?.id}
                        title={contentMap?.name}
                        createdAt={contentMap?.createdAt}
                        updatedAt={contentMap?.updatedAt}
                        project={contentMap}
                        type="Content Map"
                        renamedProject={renamedProject}
                        handleProjectDeleted={handleProjectDeleted} // Pass the function
                        onClick={() => {}}
                    />
                ))
            ) : (
                <div>You have no content maps</div>
            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* uncomment the below for username popup when the server can be used */}
            {
            //   isUsernameOverlayOpen && <UsernameOverlay isOpen={isUsernameOverlayOpen} onClose={closeUsernameOverlay} />
            }
          {isCreateFolderOverlayOpen && (
             <CreateFolderOverlay 
            isOpen={isCreateFolderOverlayOpen} 
            onClose={toggleCreateFolderOverlay} 
            onFolderCreated={addNewFolder}
        />
            )}
        </Template>
    );
    {/*<div className="flex-grow p-4 flex flex-col" onContextMenu={handleContextMenu}>
        <ContextMenu className="context-menu"
        xPos={contextMenuPosition.x}
        yPos={contextMenuPosition.y}
        isVisible={contextMenuVisible}
        onClose={handleCloseContextMenu}
        menuOptions = {contextMenuOptions}
        />
      
            <div>
                <div className="flex items-center space-x-5">
                    <p className="text-2xl text-left text-primary ml-4 mb-4"  >Folders</p>
                    <DashboardNewFolder onClick={()=>{}} />
                </div> 
                <div className="flex flex-wrap content-start items-start w-full justify-start ml-6 gap-4">
                    <DashboardFolder title="Folder 1" folder="folder1" onClick={()=>{}} />
                    <DashboardFolder title="Folder 1" folder="folder1" onClick={()=>{}} />
                    {/* <DashboardNewFolder onClick={()=>{}} /> 
                    </div>
                    </div>
                <div> 
        
                <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">Projects</p>
                <div className="scrollbar-thin scrollbar-thumb-primary  overflow-y-scroll pr-2" style={{ maxHeight: "500px" }}>
          <div className="flex flex-wrap gap-4 ml-6 justify-start"> 
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="A Very Long Project Title" project="project4" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 9" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 4" project="project4" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 9" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 4" project="project4" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 9" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 4" project="project4" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="dasd" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 9" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 4" project="project4" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="dasd" project="project9" type="Mind Map" onClick={() => {}} imageSrc="/assets/images/imagenotFound.jpg" />
        
        </div>
        </div>
            </div>
        </div>
              
                {/* uncomment the below for username popup when the server can be used 
               {
                // <UsernameOverlay isOpen={isUsernameOverlayOpen} onClose={closeUsernameOverlay} />
               */}
        //  }
}
