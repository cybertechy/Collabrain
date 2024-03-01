import React from 'react';

export default function FileToolbar(props)
{
	return (
		<div className="flex justify-between items-center p-4 bg-[#f3f3f3] border-b border-gray-300">
			{/* Document Name (leftmost element) */}
			<div className="text-lg font-bold">{props.name}</div>

			{/* Share Button on the right */}
			<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white focus:outline-none">
				Share
			</button>
		</div>
	);
};
