import React, { useState } from "react";
const ReactQuill = require("react-quill");
import "react-quill/dist/quill.snow.css";
const QuillCursors = require('quill-cursors');
import ImageCompress from 'quill-image-compress';
import { ImageDrop } from 'quill-image-drop-module';
import _debounce from 'lodash/debounce';

ReactQuill.Quill.register('modules/imageDrop', ImageDrop);
ReactQuill.Quill.register('modules/imageCompress', ImageCompress);
ReactQuill.Quill.register('modules/cursors', QuillCursors);

/**
 * @param props.setValue - The function to set the value of the quill editor
 * @param props.socket - The socket.io client
 * @param props.docID - The document ID
 * @param props.ociID - The OCI ID
 * @param props.quillRef - The reference to the quill editor
 * @param props.value - The value of the quill editor
 * @param props.user - The user object
 * @param props.setShowCommentButton - The function to set whether the comment button is shown
 * @param props.isDisabled - Whether the quill editor is disabled
 * @param props.setIsSaved - The function to set whether the document is saved
 */
export default function Quill(props)
{
	const [pendingChanges, setPendingChanges] = useState(null);

	// Debounce the emit and save changes function
	// Group up changes to reduce the number of requests
	const saveChanges = _debounce(() =>
	{
		if (props.socket.current)
		{
			props.socket.current.emit("save-doc", { ociID: props.ociID, data: props.quillRef.current.getEditor().getContents() });
			props.setIsSaved(true);
			setPendingChanges(null);
			console.log("Saved");
		}
	}, 500); // Adjust the debounce delay as needed

	const delayedSaveChanges = _debounce(saveChanges, 500); // Adjust the debounce delay as needed

	// Handle input changes
	const onChange = (content, delta, source, editor) =>
	{
		props.setValue(content);
		if (source != "user" || props.socket.current == null)
			return;

		props.setIsSaved(false);

		if (pendingChanges !== null)
			clearTimeout(pendingChanges);

		props.socket.current.emit("send-doc-changes", { doc: props.docID, data: delta });
		const timeoutId = setTimeout(() => { delayedSaveChanges(); }, 1000); // Adjust the idle period as needed
		setPendingChanges(timeoutId);
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

		// If length is more than 0, show comment button
		if (range != null && range.length > 0)
			props.setShowCommentButton(true);
		else
			props.setShowCommentButton(false);
	};

	const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];
	var Size = ReactQuill.Quill.import('attributors/style/size');
	Size.whitelist = fontSizeArr;
	ReactQuill.Quill.register(Size, true);
	Size.whitelist = fontSizeArr;

	var toolbarOptions = [
		[{ 'font': [] }],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		[{ 'size': fontSizeArr }],

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
		},
		imageCompress: {
			quality: 0.7, // default
			maxWidth: 1000, // default
			maxHeight: 1000, // default
			imageType: 'image/jpeg', // default
			debug: true, // default
			suppressErrorLogging: false, // default
			insertIntoEditor: undefined, // default
		},
		imageDrop: true,
	};

	return <ReactQuill className=""
		ref={props.quillRef} modules={module} theme="snow" value={props.value}
		readOnly={props.isDisabled}
		onChange={onChange} onChangeSelection={onChangeSelection} />;
}
