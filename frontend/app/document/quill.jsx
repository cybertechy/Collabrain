import React from "react";
const ReactQuill = require("react-quill");
import "react-quill/dist/quill.snow.css";
const QuillCursors = require('quill-cursors');

ReactQuill.Quill.register('modules/cursors', QuillCursors);

export default function Quill(props)
{
	// Handle input changes
	const onChange = (content, delta, source, editor) =>
	{
		props.setValue(content);
		if (source != "user" || props.socket.current == null)
			return;

		props.socket.current.emit("send-doc-changes", { doc: props.docID, data: delta });

		// Save changes to database
		props.socket.current.emit("save-doc", { ociID: props.ociID, data: props.quillRef.current.getEditor().getContents() });
	};

	// Handle cursor changes
	const onChangeSelection = (range, source, editor) =>
	{
		if (props.socket.current == null)
			return;

		const data = {
			username: props.user.username,
			range: range,
		};

		props.socket.current.emit("send-doc-cursor-changes", { doc: props.docID, data: data });
	};

	var toolbarOptions = [
		[{ 'font': [] }],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'align': [] }],

		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['image', 'blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
		[{ 'direction': 'rtl' }],                         // text direction

		['clean'],                                        // remove formatting button
	];

	const module = {
		toolbar: toolbarOptions,
		cursors: {
			transformOnTextChange: false,
		}
	};

	return <ReactQuill ref={props.quillRef} modules={module} theme="snow" value={props.value} readOnly={props.isDisabled} onChange={onChange} onChangeSelection={onChangeSelection} />;
}
