"use client";

const fb = require("_firebase/firebase");
// const axios = require('axios');
import Sidebar from "../../components/ui/sidebar/sidebar";
import Navbar from "../../components/ui/navbar/navbar";
import { Editor } from "novel";

export default function TextEditor()
{
	return (
		<div className="flex flex-grow overflow-hidden">

			<Sidebar />
			<div className="flex-col flex-1 overflow-hidden">
				<Navbar />
				<div className="flex justify-center bg-gray-200 shadow-md rounded-md overflow-x-hidden overflow-y-auto flex-1">
					<Editor
						defaultValue={{
							type: "doc",
							content: []
						}}
						disableLocalStorage={true}
					/>
				</div>
			</div>
		</div>
	);
}