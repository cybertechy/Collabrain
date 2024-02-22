import { useRef } from 'react';
const ReactQuill = require("react-quill");
import "react-quill/dist/quill.snow.css";

export default function Quill(props)
{
	const onChange = (content, delta, source, editor) =>
	{
		props.setValue(content);
		if (source != "user" || props.socket.current == null)
			return;

		props.socket.current.emit("send-doc-changes", delta);
	};

	var toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['image', 'blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
		[{ 'direction': 'rtl' }],                         // text direction

		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'font': [] }],
		[{ 'align': [] }],

		['clean'],                                        // remove formatting button
	];

	const module = {
		toolbar: toolbarOptions,
	};

	return <ReactQuill ref={props.quillRef} modules={module} theme="snow" value={props.value} onChange={onChange} />;
}
