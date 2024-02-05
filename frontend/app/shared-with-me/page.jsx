"use client";
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
const { useRouter, useSearchParams } = require("next/navigation");
const { useEffect, useState } = require("react");
const axios = require("axios");
import Sidebar from "../../components/ui/template/sidebar/sidebar";
import Navbar from "../../components/ui/template/navbar/navbar";
import DashboardInfoBar from "../../components/ui/dashboardComponents/dashboardInfoBar";
import DashboardProjectButton from "../../components/ui/dashboardComponents/dashboardProjectButton";
import DescriptionIcon from "@mui/icons-material/Description";
import MapIcon from "@mui/icons-material/Map";
import ContextMenu from "../../components/ui/contextMenu/contextMenu";
import UsernameOverlay from "../../components/ui/overlays/usernameOverlay";
import Template from "@/components/ui/template/template";
import CreateFolderOverlay from "../../components/ui/overlays/CreateFolderOverlay";

export default function SharedWithMe() {
  const [isUsernameOverlayOpen, setIsUsernameOverlayOpen] = useState(false);
  const [user, loading] = fb.useAuthState();
  const [projects, setProjects] = useState([]);
  const [newFolderAdded, setNewFolderAdded] = useState(false); // State to track if a new folder has been added
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [projectChanges, setProjectChanges] = useState(0);
  const [contentMaps, setContentMaps] = useState([]);
  const [isContentMapsLoading, setContentMapsLoading] = useState(true);
  const [isProjectsLoading, setProjectsLoading] = useState(true);
  const [sortName, setSortName] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] = useState(false);
  const searchParams = useSearchParams();
  const [hasUserUsername, setHasUserUsername] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const path = searchParams.get("path") || "/";
  const toggleCreateFolderOverlay = () => {
    setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
  };
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const router = useRouter();
  let sock_cli;
  let currentDoc;
  const contextMenuOptions = [
    { text: "New Map", icon: <MapIcon />, onClick: () => { NewContentMap(); } },
    { text: "New Document", icon: <DescriptionIcon />, onClick: () => { } },
  ];

  const hasUsername = async () => {
    const token = await fb.getToken();
    const uid = fb.getUserID();

    try {
        const res = await axios.get(`http://localhost:8080/api/users/${uid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Use the state value returned by setUserInfo as a callback
        setUserInfo((prevUserInfo) => {
            return res.data;
        });

        return res.data.username ? true : false;
    } catch (err) {
        console.log(err);
        return false;
    }
};
useEffect(() => {
    const checkUsername = async () => {
        if (user) {
            setIsCheckingUsername(true);
            try {
                console.log("Checking username...");
                const result = await hasUsername();
                console.log("Result from hasUsername:", result);
                setHasUserUsername(result === true ? true : false);
                console.log("hasUserUsername:", hasUserUsername);
                if (!hasUserUsername) {
                    console.log("User does not have username");
                    setIsUsernameOverlayOpen(true);
                } else {
                    console.log("User has username");
                    setIsUsernameOverlayOpen(false);
                }
            } catch (err) {
                console.error("Error checking username:", err);
            } finally {
                setIsCheckingUsername(false);
            }
        }
    };

    checkUsername();
}, [user, hasUserUsername]);

  const openUsernameOverlay = () => {
    setIsUsernameOverlayOpen(true);
  };

  const closeUsernameOverlay = () => {
    setIsUsernameOverlayOpen(false);
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
    } catch (err) {
      console.log(err);
      toast.error("Error creating new content map", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored"
      });

      return null;
    }
  };

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
  }, [projects]);

  useEffect(() => {
    console.log(loading);
    console.log(user);
    if (user) {
      sock_cli = socket.init("http://localhost:8080");
    }
  }, [user]);

  useEffect(() => {
    if (userInfo && userInfo.AccessContentMaps && userInfo.AccessContentMaps.length > 0) {
      // Extract content map IDs from userInfo.AccessContentMaps
      
      const contentMapIds = userInfo.AccessContentMaps
      console.log("Content Map IDs:", contentMapIds);
  
      // Fetch content maps based on the IDs
      const fetchContentMaps = async () => {
        try {
          const token = await fb.getToken();
          const contentMapsData = await Promise.all(
            contentMapIds.map(async (contentMapId) => {
              console.log("Fetching content map with ID:", contentMapId);
              const response = await axios.get(`http://localhost:8080/api/maps/${contentMapId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log("Fetched content map:", response.data);
              return {...response.data , id: contentMapId};
            })
          );
  
          // Update the contentMaps state with the fetched data
          setContentMaps(contentMapsData);
          setContentMapsLoading(false);
        } catch (error) {
          console.error("Error fetching content maps:", error);
          setContentMapsLoading(false);
        }
      };
  
      fetchContentMaps();
    } else {
      // Handle the case where userInfo or AccessContentMaps is not available
      setContentMapsLoading(false);
    }
  }, [userInfo]);

  const sortedContentMaps = [...contentMaps];

  if (sortName || sortDate) {
    sortedContentMaps.sort((a, b) => {
      // Sort by name
      if (sortName) {
        return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }

      // Sort by date (assuming createdAt is a valid date string)
      if (sortDate) {
        return isAscending
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }



  const showToken = async () => {
    const token = await fb.getToken();
    return token;
  };

  if (!user || isCheckingUsername) {
    return (
      <div className={``}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-xl font-bold mb-5 text-primary">
            {" Trying to sign in"}
          </h1>
          <div className="loader mb-5"></div>
          <p className="text-lg font-bold text-primary mb-5 ">
            {"If you're not signed in, sign in "}
            {<span
              className="underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              here
            </span>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Template>
      <DashboardInfoBar
        currentPath={searchParams.get("path") ? "My Brain" + searchParams.get("path") : "My Brain"}
        sortName={sortName}
        setSortName={setSortName}
        sortDate={sortDate}
        setSortDate={setSortDate}
        isAscending={isAscending}
        setIsAscending={setIsAscending}
      />

      {/* Main Content area */}
      <div className="flex-grow p-4 flex flex-col" onContextMenu={handleContextMenu}>
        <ContextMenu
          className="context-menu"
          xPos={contextMenuPosition.x}
          yPos={contextMenuPosition.y}
          isVisible={contextMenuVisible}
          onClose={handleCloseContextMenu}
          menuOptions={contextMenuOptions}
        />
        <div>
          <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">
            Projects
          </p>
          <div
            className="scrollbar-thin scrollbar-thumb-primary h-full  overflow-y-scroll pr-28"
            style={{ maxHeight: "500px" }}
          >
            <div className="flex flex-wrap gap-x-4 ml-4 justify-start">
              {console.log("Content Maps:", contentMaps)}
              {isContentMapsLoading ? (
                <div className="loader mb-5"></div>
              ) : contentMaps.length > 0 ? (
                contentMaps.map((project) => (
                  <DashboardProjectButton
                    id={project?.id}
                    key={project?.id}
                    title={project?.name}
                    createdAt={project?.createdAt}
                    updatedAt={project?.updatedAt}
                    project={project}
                    type={"Content Map" }
                    
                    handleProjectDeleted={handleProjectDeleted} // Pass the function
                    onClick={() => {console.log("clicked", project?.id); router.push(`/contentmap?id=${project?.id}`)}}
                  />
                ))
              ) : (
                <div className="text-primary font-poppins text-xl italic">Right click to make your first project!</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isUsernameOverlayOpen && !isCheckingUsername && <UsernameOverlay onClose={closeUsernameOverlay} hasUserUsername={hasUserUsername} setHasUserUsername={setHasUserUsername} />}
      {isCreateFolderOverlayOpen && (
        <CreateFolderOverlay
          isOpen={isCreateFolderOverlayOpen}
          onClose={toggleCreateFolderOverlay}
          onFolderCreated={addNewFolder}
        />
      )}
    </Template>
  );
}
