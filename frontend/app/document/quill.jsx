// import { useEffect, useState } from 'react';
// const ReactQuill = require("react-quill");
// import "react-quill/dist/quill.snow.css";

// export default function Quill()
// {
// 	const [value, setValue] = useState("");

// 	var toolbarOptions = [
// 		[{ 'font': [] }],

// 		[{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'header': 1 }, { 'header': 2 }],

// 		[{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme

// 		['bold', 'italic', 'underline', 'strike', { 'script': 'sub' }, { 'script': 'super' }], // toggled buttons
// 		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
// 		['code-block'],

// 		[{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
// 		[{ 'direction': 'rtl' }], // text direction
// 		[{ 'align': [] }],
// 	];

// 	const module = {
// 		toolbar: toolbarOptions,
// 	};

// 	return <ReactQuill modules={module} theme="snow" value={value} onChange={setValue} />;
// }