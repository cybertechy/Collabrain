"use client";

const { signOut, isAuth, getToken } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
const axios = require("axios");

export default function Dashboard() {
    const router = useRouter();
    if (!isAuth()) {
        // router.push('/'); // Redirect to home page
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
		<div className="flex flex-col justify-center items-center">
			<h1 className="text-xl font-bold">Dashboard</h1>
			<p>This is your dashboard</p>
			<p>There should be something here</p>
			<button onClick={signOut}>Sign Out</button>
			<input id="doc-title" style={{ color: "black", padding: 10, marginTop: 10 }} type="text" />
			<textarea id="doc-text" style={{ color: "black", padding: 10, marginTop: 10 }} name="text" cols="30" rows="10"></textarea>
			<div style={{ display: "flex" }}>
				<button onClick={createDoc} style={{ color: "black", backgroundColor: "white", padding: 10, borderRadius: 5, margin: 10 }}>Save doc</button>
				<button onClick={deleteDoc} style={{ color: "black", backgroundColor: "white", padding: 10, borderRadius: 5, margin: 10 }}>Delete doc</button>
			</div>
		</div>
	);
}
