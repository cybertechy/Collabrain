import React, { useState } from "react";
import PropTypes from "prop-types";
const { useRouter } = require("next/navigation");
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit"; // Icon for Rename
import ShareIcon from "@mui/icons-material/Share"; // Icon for Share
import SortIcon from "@mui/icons-material/Sort"; // Icon for Organize
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for Delete
import fb from "../../../app/_firebase/firebase";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const DashboardProjectButton = ({
    title,
    project,
    type,
    color = "#FFFFFF",
    id,
    createdAt,
    updatedAt,
    renamedProject,
    handleProjectDeleted,
    OnClick
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [renameOverlayOpen, setRenameOverlayOpen] = useState(false);
    const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    const open = Boolean(anchorEl);
    const router = useRouter();
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const truncateTitle = (title, maxLength = 14, fixedWidthChar = "\u00A0") => {
        let truncatedTitle = title;
        if (title.length > maxLength) {
            truncatedTitle = title.substring(0, maxLength - 2) + "..";
        } else {
            truncatedTitle += fixedWidthChar.repeat(maxLength * 2 - title.length); // Pad with non-breaking spaces
        }
        return truncatedTitle;
    };
    const map = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16"
        >
            <path
                fillRule="evenodd"
                d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .710-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.710.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
                clipRule="evenodd"
            />
        </svg>
    );

    const doc = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16"
        >
            <path
                fillRule="evenodd"
                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                clipRule="evenodd"
            />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
        </svg>
    );
    const handleContentMapClick = (event) => {
        // Check if the type is "Content Map"
        event.stopPropagation();
        if (type === "Content Map" && project.id) {
            // Navigate to the content map page with the id parameter
            OnClick();
            router.push(`/contentmap?id=${project.id}`);
        }
    };
    async function renameContentMap(contentMapId, newName) {
        let token = await fb.getToken();
        await axios
            .put(
                `${SERVERLOCATION}/api/maps/` + contentMapId,
                {
                    name: newName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Replace <UserToken> with actual token
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log("Content Map renamed successfully:", response.data);
                renamedProject(response.data);
            })
            .catch(function (error) {
                console.error("Error renaming content map:", error);
            });
    }
    async function deleteContentMap(contentMapId) {
        let token = await fb.getToken();
        await axios
            .delete(`${SERVERLOCATION}/api/maps/` + contentMapId, {
                headers: {
                    Authorization: `Bearer ${token}`, // Replace <UserToken> with actual token
                },
            })
            .then(function (response) {
                console.log("Content Map deleted successfully", response);
                handleProjectDeleted(response.data);
            })
            .catch(function (error) {
                console.error("Error deleting content map:", error);
            });
    }
    const dialogStyles = {
        color: "#30475E", // Text color
        borderColor: "#30475E", // Border color
    };

    const buttonStyles = {
        color: "#FFFFFF", // Text color
        backgroundColor: "#30475E", // Button background color
    };
    const handleRename = () => {
        renameContentMap(project.id, newProjectName);
        setRenameOverlayOpen(false);
        // Update other UI elements or state if necessary
    };
    const handleDragStart = (e, projectId, type) => {
        e.dataTransfer.setData("projectId", projectId);
        e.dataTransfer.setData("type", type);
    };

    const handleDelete = () => {
        deleteContentMap(project.id);
        setDeleteOverlayOpen(false);
        // Update other UI elements or state if necessary
    };
    return (
        <Tooltip title={title} enterDelay={1000} leaveDelay={200}>
            <div>
                <div
                    className="flex flex-wrap items-stretch justify-center bg-aliceBlue text-primary rounded-md hover:bg-columbiablue duration-300  pt-2 px-3  border border-unselected" // Added mb-2 for bottom spacing
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, project.id, type)}
                >
                    <div className="flex flex-col items-center justify-between h-full">
                        <div className="flex flex-col gap-2 items-center">
                            {/* Project type text (left-aligned) */}

                            <div onClick={handleContentMapClick}>
                                {type === "Document" ? doc() : map()}
                            </div>


                        </div>
                        <div className="flex flex-col w-full mt-2 ">
                            <div className="text-xs font-medium text-left justify-start flex items-start">
                                <p className="">{type === "Document" ? "Document" : "Content Map"}</p>
                            </div>
                            
                            <div className="flex flex-row justify-between items-center w-full">

                                <span className="text-md font-bold overflow-hidden whitespace-nowrap">
                                    {truncateTitle(title)}
                                </span>
                                <IconButton
                                    color="inherit"
                                    onClick={handleClick}
                                    className="ml-auto" // Pushed to the right side
                                >
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            setRenameOverlayOpen(true);
                                        }}
                                    >
                                        <EditIcon
                                            fontSize="small text-tertiary"
                                            className="mr-2 text-tertiary flex justify-between gap-5"
                                        />
                                        <span className="text-tertiary">
                                            Rename
                                        </span>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <ShareIcon
                                            fontSize="small text-tertiary"
                                            className="mr-2  text-tertiary flex justify-between gap-5"
                                        />
                                        <span className="text-tertiary">Share</span>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <SortIcon
                                            fontSize="small text-tertiary"
                                            className="mr-2  text-tertiary flex justify-between gap-5"
                                        />
                                        <span className="text-tertiary">
                                            Organize
                                        </span>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            setDeleteOverlayOpen(true);
                                        }}
                                    >
                                        <DeleteIcon
                                            fontSize="small text-tertiary"
                                            className="mr-2  text-tertiary flex justify-between gap-5"
                                        />
                                        <span className="text-tertiary">
                                            Delete
                                        </span>
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Rename Overlay */}
                <Dialog
                    open={renameOverlayOpen}
                    onClose={() => setRenameOverlayOpen(false)}
                    sx={dialogStyles}
                >
                    <DialogTitle>Rename Project</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="New Project Name"
                            variant="outlined"
                            fullWidth
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setRenameOverlayOpen(false)}
                            sx={buttonStyles}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRename} sx={buttonStyles}>
                            Rename
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Delete Confirmation Overlay */}
                <Dialog
                    open={deleteOverlayOpen}
                    onClose={() => setDeleteOverlayOpen(false)}
                    sx={dialogStyles}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this Project and its
                        contents?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeleteOverlayOpen(false)}
                            sx={buttonStyles}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} sx={buttonStyles}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Tooltip>
    );
};


DashboardProjectButton.propTypes = {
    title: PropTypes.string,
    project: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    color: PropTypes.string,
    id: PropTypes.string,

    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,


};

export default DashboardProjectButton;
