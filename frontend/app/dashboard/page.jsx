"use client";

const { signOut, isAuth, getToken } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
const axios = require("axios");
import Sidebar from "../../components/ui/sidebar/sidebar";
import Navbar from "../../components/ui/navbar/navbar";
import DashboardInfoBar from "../../components/ui/dashboardComponents/dashboardInfoBar";
import DropdownDashboard from '../../components/ui/dashboardComponents/dropdownDashboard'; // Adjust the import path as needed
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
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        <div className="flex flex-grow overflow-hidden">
            <Sidebar />
            <div className="flex-grow flex flex-col">
                <div className="w-full">
                    <Navbar />
                    <DashboardInfoBar />
                    {/* Container for dropdowns */}
                   
                </div>
                <div className="px-4 py-2 ">
                        <div className="flex content-end items-end w-full justify-end space-x-4">
                            <DropdownDashboard title="Type" items={typeItems} hasBorders={true} />
                            <DropdownDashboard title="People" items={peopleItems} hasBorders={true} />
                            <DropdownDashboard title="Modified" items={modifiedItems} hasBorders={true} />
                        </div>
                    </div>
                {/* Content area */}
                <div className="flex-grow p-4 flex flex-col justify-center items-center">
    <h1 className="text-xl font-bold text-black">Dashboard</h1>
    <p className = "text-black">This is your dashboard</p>
    <p className = "text-black">There should be something here</p>
    <button className="text-black" onClick={signOut}>
        Sign Out
    </button>
    <input
        id="doc-title"
        style={{ color: "black", padding: 10, marginTop: 10 }}
        type="text"
    />
    <textarea
        id="doc-text"
        style={{ color: "black", padding: 10, marginTop: 10 }}
        name="text"
        cols="30"
        rows="10"
    ></textarea>
    <div style={{ display: "flex", justifyContent: "center" }}>
        <button
            onClick={createDoc}
            style={{
                color: "black",
                backgroundColor: "white",
                padding: 10,
                borderRadius: 5,
                margin: 10,
            }}
        >
            Save doc
        </button>
        <button
            onClick={deleteDoc}
            style={{
                color: "black",
                backgroundColor: "white",
                padding: 10,
                borderRadius: 5,
                margin: 10,
            }}
        >
            Delete doc
        </button>
    </div>
</div>
            </div>
        </div>
        </div>
    );
}
