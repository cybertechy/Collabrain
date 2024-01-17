"use client";

const { signOut, isAuth, getToken } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
const axios = require("axios");
import Sidebar from "../../components/ui/sidebar/sidebar";
import Navbar from "../../components/ui/navbar/navbar";
import DashboardInfoBar from "../../components/ui/dashboardComponents/dashboardInfoBar";
import DashboardFolder from "../../components/ui/dashboardComponents/dashboardFolder";
import DropdownDashboard from '../../components/ui/dashboardComponents/dropdownDashboard'; // Adjust the import path as needed
import DashboardNewFolder from '../../components/ui/dashboardComponents/dashboardNewFolder'
import DashboardProjectButton from '../../components/ui/dashboardComponents/dashboardProjectButton'
export default function Dashboard() {
    const router = useRouter();
    const typeItems = ['Type 1', 'Type 2', 'Type 3'];
    const peopleItems = ['Person 1', 'Person 2', 'Person 3'];
    const modifiedItems = ['Date 1', 'Date 2', 'Date 3'];
    if (!isAuth()) {
        //router.push('/'); // Redirect to home page
        return <h1 className="text-xl font-bold">Please sign in</h1>;
    }
    // NOTE: Not finished
    // Needs to be tested with backend

    let currentDoc;
   
    const createDoc = async () => {
        // Create a new document
        const title = document.querySelector("#doc-title").value;
        const content = document.querySelector("#doc-text").value;
        const token = await getToken();
        console.log(title);
        console.log(content);

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
        <div className="flex flex-col h-screen bg-gray-100 ">
        <div className="flex flex-grow overflow-hidden">
            <Sidebar />
            <div className="flex-grow flex flex-col">
                <div className="w-full">
                    <Navbar />
                    <DashboardInfoBar />
                   
                   
                </div>
                <div className="px-4 py-2 ">
                        <div className="flex content-start items-start w-full justify-start space-x-8">
                            <DropdownDashboard title="Type" items={typeItems} hasBorders={true} />
                            <DropdownDashboard title="People" items={peopleItems} hasBorders={true} />
                            <DropdownDashboard title="Modified" items={modifiedItems} hasBorders={true} />
                        </div>
                    </div>
                {/* Content area */}
                <div className="flex-grow p-4 flex flex-col">
                <div> 
                <p className="text-2xl text-left text-primary ml-4 mb-4" >Folders</p>
                
                <div className="flex flex-wrap content-start items-start w-full justify-start gap-8">
                <DashboardFolder title="Folder 1" folder="folder1" onClick={()=>{}} />
                <DashboardFolder title="Folder 1" folder="folder1" onClick={()=>{}} />
                <DashboardNewFolder onClick={()=>{}} />
                        </div>
                </div>
                 <div> 

        <p className="text-2xl text-left text-primary ml-4 mb-4 mt-5">Projects</p>
        
        <div className="flex flex-wrap gap-4 justify-start">
            <DashboardProjectButton title="Project 1" project="project1" type="Mind Map" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 2" project="project2" type="Document" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 3" project="project3" type="Mind Map" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 4" project="project4" type="Document" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 5" project="project5" type="Document" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            {/* <DashboardProjectButton title="Project 6" project="project6" type="Document" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 7" project="project7" type="Document" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 8" project="project8" type="Mind Map" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" />
            <DashboardProjectButton title="Project 9" project="project9" type="Mind Map" onClick={()=>{}} imageSrc="/assets/images/imagenotFound.jpg" /> */}
        </div>
    </div>
</div>
            </div>
        </div>
        </div>
    );
}
