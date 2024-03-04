"use client";
const fb = require("_firebase/firebase"); // Import the authentication functions
const socket = require("_socket/socket");
const { useRouter, useSearchParams } = require("next/navigation");
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
export default function Dashboard()
{
	const [isUsernameOverlayOpen, setIsUsernameOverlayOpen] = useState(false);
	const [user, loading] = fb.useAuthState();
	const [folders, setFolders] = useState([]);
	const [projects, setProjects] = useState([]);
	const [newFolderAdded, setNewFolderAdded] = useState(false); // State to track if a new folder has been added
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [teams, setTeams] = useState([]);
	const [folderChanges, setFolderChanges] = useState(0);
	const [projectChanges, setProjectChanges] = useState(0);
	const [contentMaps, setContentMaps] = useState([]);
	const [isContentMapsLoading, setContentMapsLoading] = useState(true);
	const [isFoldersLoading, setFoldersLoading] = useState(true);
	const [isProjectsLoading, setProjectsLoading] = useState(true);
	const [sortName, setSortName] = useState(false);
	const [sortDate, setSortDate] = useState(false);
	const [isAscending, setIsAscending] = useState(true);
	const [isCreateFolderOverlayOpen, setIsCreateFolderOverlayOpen] = useState(false);
	const searchParams = useSearchParams();
	const [hasUserUsername, setHasUserUsername] = useState(false);
	const [isCheckingUsername, setIsCheckingUsername] = useState(true);
	const path = searchParams.get("path") || "/";
	const toggleCreateFolderOverlay = () =>
	{
		setIsCreateFolderOverlayOpen(!isCreateFolderOverlayOpen);
	};
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0,
	});
	const onFolderCreated = (newFolder) =>
	{
		setFolders(currentFolders => [...currentFolders, newFolder]);
	};
	const router = useRouter();
	let sock_cli;
	let currentDoc;
	const contextMenuOptions = [
		{ text: "New Folder", icon: <FolderIcon />, onClick: () => { toggleCreateFolderOverlay(); } },
		{
			text: "New Map",
			icon: <MapIcon />,
			onClick: () =>
			{
				NewContentMap();
			},
		},
		{ text: "New Document", icon: <DescriptionIcon />, onClick: () => { } },
	];


	const hasUsername = async () => {
        const token = await fb.getToken();
        const uid = fb.getUserID();

        try {
            const res = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = res.data;
			
			
            return user.username ? true : false;
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

	const openUsernameOverlay = () =>
	{
		setIsUsernameOverlayOpen(true);
	};

	const closeUsernameOverlay = () =>
	{
		setIsUsernameOverlayOpen(false);
	};

	
	const addNewFolder = (newFolder) =>
	{
		setFolders((prevFolders) => [...prevFolders, newFolder]);

		// Increment the folderChanges count when a new folder is added
		setFolderChanges((prevCount) => prevCount + 1);
	};

	const handleFolderDeleted = (deletedFolder) =>
	{
		// Filter out the deleted folder from the current state
		setFolders((prevFolders) =>
			prevFolders.filter((folder) => folder?.id !== deletedFolder?.id)
		);

		// Increment the folderChanges count when a folder is deleted
		setFolderChanges((prevCount) => prevCount + 1);
	};
	const renamedProject = (newFolder) =>
	{


		// Increment the folderChanges count when a new folder is added
		setProjectChanges((prevCount) => prevCount + 1);
	};

	const handleProjectDeleted = (deletedProject) =>
	{
		// Filter out the deleted project from the current state
		setProjects((prevProjects) =>
			prevProjects.filter((project) => project?.id !== deletedProject?.id)
		);
	};

	useEffect(() =>
	{
		const handleClickOutside = (event) =>
		{
			if (contextMenuVisible)
			{
				const menuElement = document.querySelector(".context-menu");
				const clickedInsideMenu =
					menuElement && menuElement.contains(event.target);

				if (!clickedInsideMenu)
				{
					setContextMenuVisible(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
		{
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [contextMenuVisible]);

	// Define useEffect for user state changes
	const NewContentMap = async () =>
	{

		let token = await fb.getToken();

		if (!token) return null;



		try
		{
			const res = await axios.post(`https://collabrain-backend.cybertech13.eu.org/api/maps`, {
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
		catch (err)
		{
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

	const handleContextMenu = (e) =>
	{
		e.preventDefault(); // Prevent the default right-click context menu
		const xPos = e.clientX;
		const yPos = e.clientY;
		setContextMenuPosition({ x: xPos, y: yPos });
		setContextMenuVisible(true);
	};

	const handleCloseContextMenu = () =>
	{
		setContextMenuVisible(false);
	};
	useEffect(() =>
	{
		setNewFolderAdded(true);

		// Reset newFolderAdded back to false after triggering the re-fetch
		return () =>
		{
			setNewFolderAdded(false);
		};
	}, [folders]);


	useEffect(() =>
	{
		console.log(loading);
		console.log(user);
		if (user)
		{
			sock_cli = socket.init("https://collabrain-backend.cybertech13.eu.org");
			//    fetchTeams();
			//    fetchTeams();

		}
	}, [user]);

	useEffect(() =>
	{
		if (user)
		{ // Check if user is logged in
			const fetchProjects = () =>
			{
				new Promise((resolve, reject) =>
				{
					const token = fb.getToken(); // Synchronously get the token
					if (token)
					{
						resolve(token);
					} else
					{
						reject("No token found");
					}
				})
					.then(token =>
					{
						console.log(token);
						return axios.get("https://collabrain-backend.cybertech13.eu.org/api/dashboard/files", {
							headers: {
								Authorization: `Bearer ${token}`,
							},
							params: {
								path: path, // Pass the 'path' query parameter
							},
						});
					})
					.then(response =>
					{
						if (response.status === 200)
						{
							setProjects(response.data.files); // Update the projects state
							console.log("Projects Fetched:", response.data.files);
						} else
						{
							console.error("Failed to fetch projects data", response.status);
						}
					})
					.catch(error =>
					{
						console.error("Error fetching projects data:", error);
					})
					.finally(() =>
					{
						// Update loading status if needed
						setContentMapsLoading(false);
						setProjectsLoading(false);
					});
			};

			fetchProjects();
			console.log("Fetching projects...");
		} else
		{
			console.log("User not logged in, skipping fetch");
		}
	}, [user, path, projectChanges]);

	// const fetchTeams = async () => {
	//     try {
	//         const token = await fb.getToken();
	//         // console.log("Token: ", token);
	//         const response = await axios.get(
	//             "https://collabrain-backend.cybertech13.eu.org/api/profile/",
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
	//             "https://collabrain-backend.cybertech13.eu.org/api/profile/",
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

	// useEffect(() => {
	//     if (user) { // Check if user is logged in
	//         const fetchContentMaps = () => {
	//             new Promise((resolve, reject) => {
	//                 const token = fb.getToken(); // Synchronously get the token
	//                 if (token) {
	//                     resolve(token);
	//                 } else {
	//                     reject("No token found");
	//                 }
	//             })
	//             .then(token => {
	//                 console.log(token);
	//                 return axios.get("https://collabrain-backend.cybertech13.eu.org/api/maps", {
	//                     headers: {
	//                         Authorization: `Bearer ${token}`,
	//                     },
	//                 });
	//             })
	//             .then(response => {
	//                 if (response.status === 200) {
	//                     setContentMaps(response.data);
	//                     console.log("Content Maps Fetched:", response.data);
	//                 } else {
	//                     console.error("Failed to fetch content maps data", response.status);
	//                 }
	//             })
	//             .catch(error => {
	//                 console.error("Error fetching content maps data:", error);
	//             })
	//             .finally(() => {
	//                 setContentMapsLoading(false); // Update loading status
	//             });
	//         };

	//         fetchContentMaps();
	//         console.log("Fetching content maps...");
	//     } else {
	//         console.log("User not logged in, skipping fetch");
	//     }
	// }, [user, projectChanges]);
	const sortedContentMaps = [...contentMaps];

	if (sortName || sortDate)
	{
		sortedContentMaps.sort((a, b) =>
		{
			// Sort by name
			if (sortName)
			{
				return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			}

			// Sort by date (assuming createdAt is a valid date string)
			if (sortDate)
			{
				return isAscending
					? new Date(a.createdAt) - new Date(b.createdAt)
					: new Date(b.createdAt) - new Date(a.createdAt);
			}


		});
	}
	useEffect(() =>
	{
		if (user)
		{ // Only proceed if the user is logged in
			console.log("Fetching folders...");
			const fetchFolders = () =>
			{
				// Wrap the token retrieval in a Promise to handle it asynchronously
				new Promise((resolve, reject) =>
				{
					const token = fb.getToken(); // Synchronously get the token
					if (token)
					{
						resolve(token);
					} else
					{
						reject("No token found");
					}
				})
					.then(token =>
					{
						return axios.get("https://collabrain-backend.cybertech13.eu.org/api/dashboard/folders", {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
					})
					.then(response =>
					{
						if (response.status === 200)
						{
							setFolders(response.data.folders);
							console.log("Folders Fetched:", response.data.folders);
						} else
						{
							console.error("Failed to fetch folders data", response.status);
						}
					})
					.catch(error =>
					{
						console.error("Error fetching folders data:", error);
					})
					.finally(() =>
					{
						setFoldersLoading(false); // Ensure loading status is updated
					});
			};

			fetchFolders();
		} else
		{
			console.log("User not logged in, skipping folder fetch");
			// Optionally, you might want to handle the UI state here for when the user is not logged in
		}
	}, [user, folderChanges]);

	const showToken = async () =>
	{
		const token = await fb.getToken();
		return token;
	};


	if (!user || isCheckingUsername)
	{

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

		//need to fix this part
	}
	// NOTE: Not finished
	// Needs to be tested with backend

	const createDoc = async () =>
	{
		// Create a new document
		const title = document.querySelector("#doc-title").value;
		const content = document.querySelector("#doc-text").value;
		const token = await getToken();

		let res = await axios
			.post("https://collabrain-backend.cybertech13.eu.org/api/doc/new", {
				token: token,
			})
			.catch((err) => console.log(err));

		if (res.status == 200)
		{
			currentDoc = res.data.id;
			res = await axios
				.post(`https://collabrain-backend.cybertech13.eu.org/api/doc/${currentDoc}`, {
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
		let res = await axios
			.delete(`https://collabrain-backend.cybertech13.eu.org/api/doc/${currentDoc}`, {
				data: {
					token: token,
				},
			})
			.catch((err) => console.log(err));
	};

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

				{path === "/" ? <div>
					<p className="text-2xl text-left text-primary ml-4 mb-4">
						Folders
					</p>

					<div className="flex flex-wrap content-start items-start w-full justify-start ml-4 gap-8 ">
					<DashboardNewFolder onNewFolderCreated={addNewFolder} />
					{isFoldersLoading ? (
							<div className="loader mb-5"></div> // Adjust loader class as needed
						) : folders.length > 0 ? (
							folders.map((folder) => (
								<DashboardFolder
									key={folder?.id}
									id={folder?.id}
									title={folder?.name}
									folder={folder}

									onFolderDeleted={handleFolderDeleted}
								/>
							))
						) : null // Do not display any text if there are no folders
						}
						
					</div>
				</div> : null}
				<div>
					<p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">
						Projects
					</p>
					<div
						className="scrollbar-thin scrollbar-thumb-primary h-full  overflow-y-scroll pr-1"
						style={{ maxHeight: "500px" }}
					>
						<div className="flex flex-wrap gap-x-4 ml-4 justify-start">
							{console.log("Content Maps:", contentMaps)}

							{isProjectsLoading ? (
								<div className="loader mb-5"></div>
							) : projects.length > 0 ? (
								projects.map((project) => (
									<DashboardProjectButton
										id={project?.id}
										key={project?.id}
										title={project?.name}
										createdAt={project?.createdAt}
										updatedAt={project?.updatedAt}
										project={project}
										type={project?.type == "contentmap" ? "Content Map" : "Document"}
										renamedProject={renamedProject}
										handleProjectDeleted={handleProjectDeleted} // Pass the function
										onClick={() => { }}
									/>
								))
							) : (
								<div className="text-primary font-poppins text-xl italic">Right click to make your first project!</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* uncomment the below for username popup when the server can be used */}
			{
				isUsernameOverlayOpen && !isCheckingUsername && <UsernameOverlay onClose={closeUsernameOverlay} hasUserUsername = {hasUserUsername} setHasUserUsername = {setHasUserUsername}/>
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
}
