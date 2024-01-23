"use client";
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
const { useRouter } = require('next/navigation');
const { useEffect , useState} = require("react");
const axios = require("axios");
import Sidebar from "../../components/ui/sidebar/sidebar";
import Navbar from "../../components/ui/navbar/navbar";
import DashboardInfoBar from "../../components/ui/dashboardComponents/dashboardInfoBar";
import DashboardFolder from "../../components/ui/dashboardComponents/dashboardFolder";
import DropdownDashboard from '../../components/ui/dashboardComponents/dropdownDashboard'; // Adjust the import path as needed
import DashboardNewFolder from '../../components/ui/dashboardComponents/dashboardNewFolder';
import DashboardProjectButton from '../../components/ui/dashboardComponents/dashboardProjectButton';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from '@mui/icons-material/Map';
import ContextMenu from "../../components/ui/contextMenu/contextMenu";
import UsernameOverlay from "../../components/ui/usernameOverlay/usernameOverlay";
export default function Dashboard() {
   
    const contextMenuOptions = [
        {text:"New Folder", icon: <FolderIcon/>,onClick:()=>{} },
        {text:"New Map", icon: <MapIcon/>,onClick:()=>{console.log("new map to be made")}} 
        ,{text:"New Document", icon: <DescriptionIcon/>,onClick:()=>{} }
        
    ];
    const [isUsernameOverlayOpen, setIsUsernameOverlayOpen] = useState(true);

    const openUsernameOverlay = () => {
      setIsUsernameOverlayOpen(true);
    };
  
    const closeUsernameOverlay = () => {
      setIsUsernameOverlayOpen(false);
    };
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [teams, setTeams] = useState([]); 
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const handleClickOutside = (event) => {
        if (contextMenuVisible) {
            const menuElement = document.querySelector('.context-menu');
            const clickedInsideMenu = menuElement && menuElement.contains(event.target);
    
            if (!clickedInsideMenu) {
                setContextMenuVisible(false);
            }
        }
    };
    

    // Add event listener on mount and remove on unmount
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenuVisible]);
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
    const router = useRouter();
	const [user, loading] = fb.useAuthState();

    const fetchTeams = async () => {
        try {
            const token = await fb.getToken();
            // console.log("Token: ", token); 
            const response = await axios.get('http://localhost:8080/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log("Response: ", response);
            if (response.status === 200) {
                setTeams(response.data.teams); 
            } else {
                console.error('Failed to fetch team data', response.status);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
            
        }
    };
    

    // useEffect(() => {
    //     if (user) {
            
    //     }
    // }, [user]);


	let sock_cli;
	useEffect(() =>
	{ console.log(loading);
        console.log(user);
		if (user){
            // fb.signOut(); //using this to sign out temporarily
			sock_cli = socket.init('http://localhost:8080');
            fetchTeams();

           
        }
	}, [user]);

	if (loading|| !user )
    return (
        <div className="flex flex-col items-center justify-around min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold mb-5 text-primary">Trying to sign in</h1>
                <div className="loader mb-5"></div>

                <p className="text-lg font-bold text-primary mb-5 ">
                    If you're not signed in, sign in&nbsp;
                    <span className="underline cursor-pointer" onClick={() => router.push("/")}>
                        here
                    </span>
                </p>
            </div>
        </div>
    );



    // NOTE: Not finished
    // Needs to be tested with backend


   
    let currentDoc;

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

	const deleteDoc = async () =>
	{
		console.log(currentDoc);
		const token = await getToken();
		let res = await axios.delete(`http://localhost:8080/api/doc/${currentDoc}`, {
			data: {
				"token": token
			}
		}).catch(err => console.log(err));
	};


	return (
    
        <div className="flex flex-col h-screen bg-white ">
         
        <div className="flex flex-grow overflow-hidden">
            <Sidebar />
            <div className="flex-grow flex flex-col">
                <div className="w-full">
                    <Navbar />
                    <DashboardInfoBar />
                 
                   
                </div>
                
                {/* Main Content area */}
                <div className="flex-grow p-4 flex flex-col" onContextMenu={handleContextMenu}>
                <ContextMenu className="context-menu"
        xPos={contextMenuPosition.x}
        yPos={contextMenuPosition.y}
        isVisible={contextMenuVisible}
        onClose={handleCloseContextMenu}
        menuOptions = {contextMenuOptions}
      />
      
                <div> 
                <p className="text-2xl text-left text-primary ml-4 mb-4"  >Folders</p>
                
                <div className="flex flex-wrap content-start items-start w-full justify-start ml-4 gap-8 ">
                <DashboardFolder title="Folder 1" folder="folder1" onClick={() => {}} />
                <DashboardFolder title="Folder 1" folder="folder1" onClick={()=>{}} />
                <DashboardNewFolder onClick={()=>{}} />
                        </div>
                </div>
                 <div> 

        <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">Projects</p>
        <div className="scrollbar-thin scrollbar-thumb-primary  overflow-y-scroll pr-28" style={{ maxHeight: "400px" }}>
  <div className="flex flex-wrap gap-4 ml-4 justify-start"> 
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
</div>
</div>
    </div>
</div>
            </div>
        </div>
        {/* uncomment the below for username popup when the server can be used */}
        {/* { (user && !user.username)  && <UsernameOverlay isOpen = {isUsernameOverlayOpen} onClose={closeUsernameOverlay}/>} */}
        </div>
    );
    }
