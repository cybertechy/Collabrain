"use client";

import { useEffect } from "react";
import Sidebar from "../../components/ui/sidebar/sidebar";
import Quill from "./quill";
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import SimpleImage from "@editorjs/simple-image";
import List from "@editorjs/list";
import Table from '@editorjs/table';
const ColorPlugin = require('editorjs-text-color-plugin');


export default function Editor()
{
	// const initEditor = () =>
	// {
	// 	const editor = new EditorJS({
	// 		/** Id of Element that should contain Editor instance */
	// 		holder: 'editorjs',
	// 		tools: {
	// 			quote: {
	// 				class: Quote,
	// 				inlineToolbar: true,
	// 				config: {
	// 					quotePlaceholder: 'Enter a quote',
	// 					captionPlaceholder: 'Quote\'s author',
	// 				},
	// 			},
	// 			header: {
	// 				class: Header,
	// 				config: {
	// 					placeholder: 'Enter a header',
	// 					levels: [2, 3, 4],
	// 					defaultLevel: 3
	// 				}
	// 			},
	// 			checklist: {
	// 				class: Checklist,
	// 				inlineToolbar: true,
	// 			},
	// 			code: CodeTool,
	// 			image: SimpleImage,
	// 			list: {
	// 				class: List,
	// 				inlineToolbar: true,
	// 				config: {
	// 					defaultStyle: 'unordered'
	// 				}
	// 			},
	// 			table: {
	// 				class: Table,
	// 				inlineToolbar: true,
	// 				config: {
	// 					rows: 2,
	// 					cols: 3,
	// 				},
	// 			}, Color: {
	// 				class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
	// 				config: {
	// 					colorCollections: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
	// 					defaultColor: '#FF1300',
	// 					type: 'text',
	// 					customPicker: true // add a button to allow selecting any colour  
	// 				}
	// 			},
	// 			Marker: {
	// 				class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
	// 				config: {
	// 					defaultColor: '#FFBF00',
	// 					type: 'marker',
	// 					icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
	// 				}
	// 			},
	// 		},
	// 	});
	// };

	// useEffect(() =>
	// {
	// 	initEditor();
	// }, []);

	return (
		// <div className="flex items-center justify-center h-max bg-gray-100">
		// <div className="flex flex-col h-screen bg-gray-100 ">
		<div className="flex flex-grow overflow-hidden">
			<Sidebar />
			{/* <div className="p-20 mt-[200px] bg-white shadow-md rounded-md w-1/2 min-h-screen" id="editorjs" /> */}
			<div className="p-20 bg-white shadow-md rounded-md max-h-screen overflow-x-hidden overflow-y-auto flex-1">
				<Quill />
			</div>
		</div>
		// </div>
		// </div>
	);
}