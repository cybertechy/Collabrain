"use client";
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
const { useRouter, useSearchParams } = require("next/navigation");
const { useEffect, useState, useMemo } = require("react");
import DashboardInfoBar from "@/components/ui/dashboardComponents/dashboardInfoBar";
import DashboardFolder from "@/components/ui/dashboardComponents/dashboardFolder";
import DashboardNewFolder from "@/components/ui/dashboardComponents/dashboardNewFolder";
import DashboardProjectButton from "@/components/ui/dashboardComponents/dashboardProjectButton";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import MapIcon from "@mui/icons-material/Map";
import ContextMenu from "@/components/ui/contextMenu/contextMenu";
import CreateFolderOverlay from "@/components/ui/overlays/CreateFolderOverlay";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import smallLoader from '@/public/assets/json/smallLoaderLottie.json';
import axios from "axios";
import {
    fetchFolders,
    fetchProjects,
    newContentMap,
} from "@/app/utils/filesAndFolders";
import { hasUsername } from "@/app/utils/user";
import { TTSProvider, useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
const LoaderComponent = dynamic(() => import('@/components/ui/loader/loaderComponent'), { ssr: false });
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
export default function Dashboard() {
    const { t } = useTranslation('dashboard');
    const { speak, stop, isTTSEnabled } = useTTS();
    const [user, loading] = fb.useAuthState();
    const [isLoading, setIsLoading] = useState(true);
    const [loadingState, setLoadingState] = useState("LOGGING_IN");
    const [folders, setFolders] = useState([]);
    const [projects, setProjects] = useState([]);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [folderChanges, setFolderChanges] = useState(0);
    const [projectChanges, setProjectChanges] = useState(0);
    const [contentMaps, setContentMaps] = useState([]);
    const [isContentMapsLoading, setContentMapsLoading] = useState(true);
    const [isFoldersLoading, setFoldersLoading] = useState(true);
    const [isProjectsLoading, setProjectsLoading] = useState(true);
    const [sortCriteria, setSortCriteria] = useState({ sortName: false, sortDate: false, isAscending: true });
    const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] =
        useState(false);
    const searchParams = useSearchParams();
    const [path, setPath] = useState(searchParams.get("path") || "/");
    useEffect(() => {
        const newPath = searchParams.get("path") || "/";
        console.log("Updated path in Dashboard:", newPath); // Debugging line
        setPath(newPath);
    }, [searchParams]);


    let sock_cli;
    let currentDoc;
    const toggleCreateFolderOverlay = () => {
        setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
    };
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    });

    const router = useRouter();

    const contextMenuOptions = [
        {
            text: t('new_folder_rclick'),
            icon: <FolderIcon />,
            onClick: () => {
                toggleCreateFolderOverlay();
            },
            onMouseEnter: () => {
                isTTSEnabled && speak("New Folder")
            },
            onMouseEnter: () => isTTSEnabled && speak("New folder"),
            onMouseLeave: stop
        },
        {
            text: t('new_map_rclick'),
            icon: <MapIcon />,
            onClick: () => {
                createContentMap();
            },
            onMouseEnter: () => isTTSEnabled && speak("New map"),
            onMouseLeave: stop
        },
        {
            text: t('new_doc_rclick'), icon: <DescriptionIcon />, onClick: () => { createDocument(); },
            onMouseEnter: () => isTTSEnabled && speak("New document"),
            onMouseLeave: stop
        },
    ];

    async function CheckServerStatus() {
        try {
            let res = await fetch(SERVERLOCATION + '/api/home')
            if (res.status === 200) return true;
            else return false;
        } catch (error) {
            return false;
        }
    }





    useEffect(() => {
        if (
            user &&
            !isFoldersLoading &&
            !isProjectsLoading &&
            !isContentMapsLoading
        ) {
            setLoadingState("");
            setIsLoading(false);
        }
    }, [user, isFoldersLoading, isProjectsLoading, isContentMapsLoading]);




    useEffect(() => {
        // Wait for the loading state to confirm that the auth check is complete
        if (!loading) {
            if (user) {
                // User is logged in, proceed with any logged-in only logic here
                console.log("User is logged in:", user);
            } else {
                // No user is logged in, redirect to the root
                console.log("No user found, redirecting to /");
                router.push("/");
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        const checkServer = async () => {
            try {
                const serverStatus = await CheckServerStatus();
                console.log("Server status is", serverStatus);
                if (!serverStatus) {
                    console.log("Server is down");
                    router.push("/error500");
                    return false;
                } else  return true;
            } catch (error) {
                console.error("Error checking server status:", error);
                router.push("/error500");
                return false;
            }
        };

        const checkUserUsername = async () => {
            if (user) {
                setLoadingState("");
                const userHasUsername = await hasUsername();
                if (userHasUsername) {
                    console.log("User has username", userHasUsername);
                    router.push("/dashboard"); // Redirect to dashboard if user has username
                } else {
                    console.log("userHasUsername is ", userHasUsername);
                    console.log("User does not have a username");
                    router.push("/username"); // Redirect to username page if user does not have username
                }
            }
        };

        checkServer().then((status) => {
           if(status) checkUserUsername();
        });
    }, [user]);
    const handleSort = (newSortCriteria) => {
        setSortCriteria(newSortCriteria);
    };
    const sortedProjects = useMemo(() => {
        return [...projects].filter(project => project.path === path).sort((a, b) => {
            if (sortCriteria.sortName) {
                return sortCriteria.isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (sortCriteria.sortDate) {
                const dateA = new Date(a.updatedAt); // Ensure correct property name
                const dateB = new Date(b.updatedAt); // Ensure correct property name
                return sortCriteria.isAscending ? dateA - dateB : dateB - dateA;
            }
            return 0; // Default case if no sorting criteria are set
        });
    }, [projects, sortCriteria, path]);

    const sortedFolders = useMemo(() => {
        return [...folders].filter(folder => {
            // Split the folder's path and the current path on '/'
            const folderPathParts = folder.path.split('/').filter(part => part);
            const currentPathParts = path.split('/').filter(part => part);

            // For the root path, match folders that are directly under root
            if (path === "/") {
                return folderPathParts.length === 1;
            } else {
                // For nested paths, check if the folder is exactly one level deeper than the current path
                // This requires matching all parts of the current path, plus one additional segment for the folder
                return folderPathParts.slice(0, -1).every((part, index) => currentPathParts[index] === part) && folderPathParts.length === currentPathParts.length + 1;
            }
        })
            .sort((a, b) => {
                if (sortCriteria.sortName) {
                    return sortCriteria.isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                } else if (sortCriteria.sortDate) {
                    const dateA = new Date(a.updatedAt); // Corrected to match your example date format
                    const dateB = new Date(b.updatedAt); // Corrected to match your example date format
                    return sortCriteria.isAscending ? dateA - dateB : dateB - dateA;
                }
                return 0; // Default case if no sorting criteria are set
            });
    }, [folders, sortCriteria, path]);

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
    const addNewProject = (newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);

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


    const createContentMap = async () => {
        setIsLoading(true);
        console.log("Creating new content map", path);
        await newContentMap(fb.getToken, (url) => {
            setProjectChanges((prevCount) => prevCount + 1);
            router.push(url);



        }, path);
        setIsLoading(false);
        setProjectChanges((prevCount) => prevCount + 1);
    };
    const createDocument = async () => {
        setIsLoading(true);
        console.log("Creating new document", path);
        await newDocument(fb.getToken, (url) => {
            setProjectChanges((prevCount) => prevCount + 1);
            router.push(url);
        }, path);
        setIsLoading(false);
        setProjectChanges((prevCount) => prevCount + 1);
    };
    const newDocument = async (getToken, callback, path) => {
        try {
            const token = await getToken();
            const response = await axios.post(
                `${SERVERLOCATION}/api/docs`,
                {
                    name: "New Document",
                    path: path,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log("Document created successfully");
                callback(`/document?id=${response.data.id}`);
            } else {
                console.error("Failed to create document");
            }
        } catch (error) {
            console.error("Error creating document:", error);
        }
    };


    // const NewDocument = async () =>
    // {
    // 	let token = await fb.getToken();
    // 	if (!token) return null;

    // 	try
    // 	{
    // 		const res = await axios.post(`${SERVERLOCATION}/api/docs`, {
    // 			name: "New Document",
    // 			path: "/",
    // 		}, {
    // 			headers: {
    // 				authorization: `Bearer ${token}`,
    // 			},
    // 		});


    // 		if (res.status !== 200) return null;


    // 		setOpenModal();
    // 		router.push(`/document?id=${res.data.id}`);
    // 	}
    // 	catch (err)
    // 	{
    // 		console.log(err);
    // 		toast.error("Error creating new content map", {
    // 			position: "bottom-right",
    // 			autoClose: 5000,
    // 			hideProgressBar: false,
    // 			closeOnClick: true,
    // 			pauseOnHover: true,
    // 			theme: "colored"
    // 		});

    // 		return null;
    // 	}
    // };
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
    const moveProjectToPath = async (projectId, newPath, type) => {
        console.log("MOving project to path", projectId, newPath, type);
        try {
            const token = await fb.getToken(); // Assuming you have a function to get the user's token
            const response = await axios.patch(
                `${SERVERLOCATION}/api/dashboard/moveFile/${projectId}`, // Adjust the endpoint URL
                {
                    to: newPath, // Specify the new path you want to move the project to
                    fileType: type, // Specify the file type ('contentMap' or 'document')
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Project moved successfully, you can update your UI here if needed
                console.log('Project moved successfully');
                setProjectChanges((prevCount) => prevCount + 1);

                // For example, you might want to navigate the user to the new project location or refresh the project list
                router.push(`/dashboard?path=${newPath}`); // Adjust according to your routing logic
            } else {
                // Handle the case where the request was not successful
                console.error('Failed to move project');
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error moving project:', error);
        }
    };

    useEffect(() => {
        console.log(loading);
        console.log(user);
        if (user) {
            sock_cli = socket.init(SERVERLOCATION);
            //    fetchTeams();
            //    fetchTeams();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setLoadingState("FETCHING_FILES");
            setProjectsLoading(true);
            (async () => {
                try {
                    const files = await fetchProjects(path);
                    setProjects(files);
                } catch (error) {
                    console.error("Error while fetching projects:", error);
                } finally {
                    setContentMapsLoading(false);
                    setProjectsLoading(false);
                    setLoadingState("");
                }
            })();
        } else {
            console.log("User not logged in, skipping fetch");
            setProjectsLoading(false);
        }
    }, [user, path, projectChanges]);

    useEffect(() => {
        if (user) {
            console.log("before fetching folders");
            setFoldersLoading(true);
            (async () => {
                try {
                    setLoadingState("FETCHING_FOLDERS");
                    const tempFolders = await fetchFolders(path);

                    console.log("Fetched Folders:", tempFolders);

                    setFolders(tempFolders || []);
                } catch (error) {
                    console.error("Error while fetching folders:", error);
                    setFolders([]);
                } finally {
                    setFoldersLoading(false);
                    setLoadingState("");
                }
            })();
        } else {
            console.log("User not logged in, skipping folder fetch");
            setFoldersLoading(false);
        }
    }, [user, folderChanges, path]);

    return (
        <div className="overflow-y-auto">
            <LoaderComponent
                isLoading={isLoading}
                loadingState={loadingState}
            />

            <DashboardInfoBar
                currentPath={searchParams.get("path") ? "My Brain" + searchParams.get("path") : "My Brain"}
                moveProjectToPath={moveProjectToPath}
                onSort={handleSort}
                sortCriteria={sortCriteria}
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
                    <p className="text-2xl text-left text-primary ml-4 mb-4"
                        onMouseEnter={() => isTTSEnabled && speak("Folders")}
                        onMouseLeave={stop}>
                        {t('folders')}
                    </p>

                    <div className="flex flex-wrap content-start items-start w-full justify-start ml-4 gap-8 ">
                        <DashboardNewFolder
                            onNewFolderCreated={addNewFolder}
                        />
                        {
                            isFoldersLoading ? (
                                <Lottie animationData={smallLoader} play="true" loop="true"
                                    style={{ width: 100, height: 100 }} />
                            ) : sortedFolders.length > 0 ? (
                                sortedFolders.map((folder) => (
                                    <DashboardFolder
                                        key={folder.id}
                                        id={folder.id}
                                        title={folder.name}
                                        folder={folder}
                                        onFolderDeleted={
                                            handleFolderDeleted
                                        }
                                        handleProjectDeleted={handleProjectDeleted}
                                        projectUpdate={() => { setProjectChanges((prevCount) => prevCount + 1); }}
                                    />
                                ))
                            ) : null // Do not display any text if there are no folders
                        }

                    </div>
                </div>

                <div>
                    <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5"
                        onMouseEnter={() => isTTSEnabled && speak("Projects")}
                        onMouseLeave={stop}>
                        {t('projects')}
                    </p>
                    <div
                        // className="scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-scrollbar h-full  overflow-auto pr-28"
                        className="scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-scrollbar h-full  overflow-auto pr-4"
                        style={{ maxHeight: "500px" }}
                    >
                        <div className="flex flex-wrap gap-4 ml-4 justify-start">


                            {isProjectsLoading ? (
                                <Lottie animationData={smallLoader} play="true" loop="true"
                                    style={{ width: 100, height: 100 }} />
                            ) : sortedProjects.length > 0 ? (
                                sortedProjects.map((project) => (
                                    <DashboardProjectButton
                                        id={project.id}
                                        key={project.id}
                                        title={project.name}
                                        createdAt={project.createdAt}
                                        updatedAt={project.updatedAt}
                                        project={project}
                                        type={
                                            project.type === "contentmap"
                                                ? "Content Map"
                                                : "Document"
                                        }
                                        OnClick={() => { setIsLoading(true); setLoadingState("FETCHING_FILES"); }}
                                        renamedProject={renamedProject}
                                        handleProjectDeleted={
                                            handleProjectDeleted
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-primary font-poppins text-xl italic"
                                    onMouseEnter={() => isTTSEnabled && speak("Right click to make your first project!")}
                                    onMouseLeave={stop}>
                                    {t('rclick_msg')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isCreateFolderOverlayOpen && (
                <CreateFolderOverlay
                    isOpen={isCreateFolderOverlayOpen}
                    onClose={toggleCreateFolderOverlay}
                    onFolderCreated={addNewFolder}

                />
            )}
        </div>
    );
}
