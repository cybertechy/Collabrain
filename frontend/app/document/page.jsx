"use client";

import Quill from "./quill";

export default function Editor()
{
	return (
		<div className="flex items-center justify-center h-max bg-gray-100">
			<div className="p-8 mt-[200px] bg-white shadow-md rounded-md w-1/2 min-h-screen">
				<Quill />
			</div>
		</div>
	);
}