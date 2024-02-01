"use client";

const fb = require("_firebase/firebase");
import Template from "@/components/ui/template/template";
import { Editor } from "novel";

export default function TextEditor()
{
	return (
		<Template> 
			<div className="flex flex-grow overflow-hidden">
				<div className="flex justify-center bg-gray-200 shadow-md rounded-md flex-1">
					<Editor
						defaultValue={{
							type: "doc",
							content: []
						}}
						disableLocalStorage={true}
						className="w-full overflow-x-hidden overflow-y-auto bg-white"
					/>
				</div>
			</div>
		</Template>
	);
}