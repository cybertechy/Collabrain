import React, { useState, useRef, useEffect } from "react";
import CustomAvatar from "@/components/ui/messagesComponents/avatar";
import Linkify from "react-linkify";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import OptionsIcon from "@mui/icons-material/MoreHoriz";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { getMedia } from "@/app/utils/storage";
import { reportMessage } from "@/app/utils/messages";
import { Download } from "lucide-react";
const commonReactions = [
    { emoji: "👍", label: "thumbs up" },
    { emoji: "👎", label: "thumbs down" },
    { emoji: "😂", label: "laugh" },
    { emoji: "❤️", label: "heart" },
    { emoji: "😮", label: "surprise" },
    { emoji: "🙏", label: "pray" },
    { emoji: "😢", label: "sad" },
];

function MessageItem({
    sender,
    senderId,
    title,
    timestamp,
    message,
    messageId,
    attachmentIds,
    reactions = {},
    onReact,
    onEdit,
    onDelete,
    userInfo,
    chatId,
    source = "user",
    teamId,
}) {
    const [attachments, setAttachments] = useState([]);
    const [loadingAttachments, setLoadingAttachments] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tempEditedMessage, setTempEditedMessage] = useState(message);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [additionalComments, setAdditionalComments] = useState("");

    const handleEditSave = () => {
        if (tempEditedMessage.trim() !== "") {
            setEditedMessage(tempEditedMessage); // Update the local state optimistically
            onEdit(messageId, tempEditedMessage); // Uncomment and implement this call to update the backend
            setEditMode(false); // Exit edit mode
        }
    };
    const onReport = () => {
        setShowReportDialog(true);
    };
    const handleReport = async () => {
        // Assuming you have the necessary information like chatId or teamId
        const isTeamMessage = source === "team";

        const reportDetails = {
            // Use either chatId or teamId based on the source
            chatId: isTeamMessage ? undefined : chatId,
            teamId: isTeamMessage ? chatId : undefined, // If it's a team message, chatId will act as teamId
            messageId: messageId,
            policy: reportReason,
            reason: additionalComments ? `: ${additionalComments}` : "",
            source: source, // or "team", depending on your context
            sender: senderId,
            message: editedMessage,
            image: attachmentIds.length > 0 ? attachmentIds : null,
        };

        await reportMessage(reportDetails);
        setShowReportDialog(false);
        setReportReason("");
        setAdditionalComments("");
    };
    const handleDelete = () => {
        onDelete(messageId);
        setEditedMessage("This message has been deleted.");
        setAttachments([]);
        setShowDeleteConfirm(false);
    };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null); // Ref for the emoji picker
    const CustomLink = ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
        >
            {children}
        </a>
    );
    const [isHovering, setIsHovering] = useState(false);
    const extractUrls = (message) => {
        if (!message) return []; // Ensure message is not undefined or empty
        const urlRegex = /https?:\/\/[^\s]+/g;
        return message.match(urlRegex) || [];
    };

    // Extract URLs from the current message
    const urls = extractUrls(message);
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    useEffect(() => {
        const fetchAttachments = async () => {
            setLoadingAttachments(true);
            const fetchedAttachments = await Promise.all(
                attachmentIds.map(async (id) => {
                    try {
                        const response = await getMedia(id);
                        return response.data; // Assuming the API response structure includes a data object with the file info
                    } catch (error) {
                        console.error("Failed to fetch attachment:", error);
                        return null;
                    }
                })
            );
            setAttachments(fetchedAttachments.filter(Boolean)); // Filter out null responses
            setLoadingAttachments(false);
        };

        if (attachmentIds && attachmentIds.length > 0) {
            fetchAttachments();
        }
    }, [attachmentIds]); // Dependency array to refetch when attachmentIds change

    const renderAttachments = () => {
        if (loadingAttachments) {
            return <CircularProgress size={24} />;
        }

        return attachments.map((attachment, index) => {
            const [mimeInfo, base64Data] = attachment.split(",");
            const mimeType = mimeInfo.split(":")[1].split(";")[0];
            const fileType = mimeType.split("/")[0];
            const fileExtension = mimeType.split("/")[1];

            const fileName = `Attachment-${index + 1}.${
                fileExtension || "file"
            }`;

            const downloadFile = () => {
                const link = document.createElement("a");
                link.href = attachment;
                link.download = fileName;
                document.body.appendChild(link); // Required for FF
                link.click();
                document.body.removeChild(link);
            };

            // Display images and GIFs directly
            if (fileType === "image") {
                return (
                    <div
                        key={index}
                        className="flex flex-col items-center p-2 m-1"
                    >
                        <img
                            src={attachment}
                            alt={fileName}
                            className="max-w-full h-auto rounded"
                        />
                        <p className="text-sm text-center mt-2">{fileName}</p>
                    </div>
                );
            } else {
                // For non-image files, show a download button
                return (
                    <div
                        key={index}
                        className="bg-primary  text-white font-light font-sans attachment-tile flex items-center justify-between p-4 border rounded-lg m-1"
                    >
                        <div className="mr-8">
                            <p className="file-name font-medium">{fileName}</p>
                            <p className="file-type text-sm">{mimeType}</p>
                        </div>
                        <IconButton
                            onClick={downloadFile}
                            size="small"
                            title="Download"
                        >
                            <Download color={"white"} />
                        </IconButton>
                    </div>
                );
            }
        });
    };

    const onLeave = () => {
        setIsHovering(false);
        setMenuVisible(false);
    }; // Reset the menu visibility}

    return (
        <div
            className="relative border-b-2 hover:bg-gray-100"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={onLeave}
        >
            <div className="flex gap-4 p-2">
                <CustomAvatar username={sender} />
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <span className="font-semibold">
                            {sender == userInfo.data.username
                                ? sender
                                : sender == "System"
                                ? "System"
                                : title}
                        </span>
                        <span className="text-xs text-gray-500">
                            {timestamp == "Invalid Date" ? "" : timestamp}
                        </span>
                    </div>
                    <Linkify
                        componentDecorator={(
                            decoratedHref,
                            decoratedText,
                            key
                        ) => (
                            <CustomLink href={decoratedHref} key={key}>
                                {decoratedText}
                            </CustomLink>
                        )}
                    >
                        {editMode ? (
                            <div className="flex flex-row">
                                <textarea
                                    className="w-full border rounded-lg p-2"
                                    value={tempEditedMessage}
                                    onChange={(e) =>
                                        setTempEditedMessage(e.target.value)
                                    }
                                    autoFocus
                                />
                                <button
                                    className="ml-2 bg-primary  text-white font-bold py-2 px-4 rounded"
                                    onClick={handleEditSave}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            // Message view mode
                            <p className="whitespace-pre-wrap break-words max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
                                {editedMessage || message}
                            </p>
                        )}
                        {urls.map((url, index) => (
                            <div key={index} className="iframe-container my-2">
                                <iframe
                                    src={url}
                                    title="URL Preview"
                                    width="300"
                                    height="200"
                                    style={{ border: "none" }}
                                ></iframe>
                            </div>
                        ))}
                    </Linkify>
                    {attachments && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {renderAttachments(attachments)}
                        </div>
                    )}
                    {reactions && !Object.keys(reactions).length == 0 && Object.entries(reactions)
                                .filter(([_, users]) => users.length > 0).length > 0 &&(
                        <div className="mt-2 flex bg-primary w-fit p-1 px-2 rounded-xl">
                            {Object.entries(reactions)
                                .filter(([_, users]) => users.length > 0)
                                .map(([emoji, users], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center mr-2"
                                    >
                                        <span>{emoji}</span>
                                        <span className="ml-2 text-sm text-white font-medium">
                                            {users.length}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
            {isHovering && (
                <div
                    className={`absolute inset-x-0 top-0 flex justify-between items-center p-1 transition-opacity ${
                        isHovering ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        className="absolute -top-10 left-0 flex items-center bg-white rounded-full border-2 shadow-lg p-1"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {commonReactions.map((reaction, index) => {
                            // Check if the current reaction is included in the message's reactions
                         
                            const isReacted =
                                reactions &&
                                reactions[reaction.emoji] &&
                                reactions[reaction.emoji].includes(sender);
                            return (
                                <IconButton
                                    key={index}
                                    size="small"
                                    onClick={() => {
                                        onReact(messageId, reaction.emoji);
                                    }} //{onReact(messageId, reaction.emoji)}}
                                    // Apply a different style if the reaction is already selected
                                    style={{
                                        backgroundColor: isReacted
                                            ? "#f0f0f0"
                                            : "transparent",
                                    }}
                                    title={reaction.label}
                                >
                                    <span
                                        className="text-xl"
                                        style={{
                                            opacity: 1,
                                            color: isReacted ? "black" : "grey",
                                        }}
                                    >
                                        {reaction.emoji}
                                    </span>
                                </IconButton>
                            );
                        })}
                    </div>

                    <div>
                        <div
                            className="absolute -top-10 right-0 flex items-center bg-white rounded-t-full shadow-xl border-2 p-1"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <IconButton
                                size="small"
                                onClick={() => setMenuVisible(!menuVisible)}
                                title="Options"
                            >
                                <OptionsIcon />
                            </IconButton>
                            {menuVisible && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                                    <ul>
                                        {sender == userInfo?.data?.username && (
                                            <div>
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() =>
                                                        setEditMode(true)
                                                    }
                                                >
                                                    Edit Message
                                                </li>
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() =>
                                                        setShowDeleteConfirm(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Delete Message
                                                </li>
                                            </div>
                                        )}
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={onReport}
                                        >
                                            Report Message
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Dialog
                            open={showReportDialog}
                            onClose={() => setShowReportDialog(false)}
                        >
                            <DialogTitle>{"Report Message"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please select a reason for reporting this
                                    message.
                                </DialogContentText>
                                <select
                                    className="w-full mt-2 border-gray-300 rounded-md shadow-sm"
                                    value={reportReason}
                                    onChange={(e) =>
                                        setReportReason(e.target.value)
                                    }
                                    required // Ensures that the select must have a value
                                >
                                    <option value="" disabled>
                                        Select a policy
                                    </option>{" "}
                                    {/* Disabled placeholder option */}
                                    <option value="spam">Spam</option>
                                    <option value="graphic-violence">
                                        Graphic Violence
                                    </option>
                                    <option value="privacy-violation">
                                        Privacy Violation
                                    </option>{" "}
                                    {/* Corrected value */}
                                    <option value="hate-speech">
                                        Hate Speech
                                    </option>
                                </select>

                                <textarea
                                    className="w-full mt-2 border-gray-300 rounded-md shadow-sm"
                                    placeholder="Please provide additional comments"
                                    value={additionalComments}
                                    onChange={(e) =>
                                        setAdditionalComments(e.target.value)
                                    }
                                    required // Makes input required
                                ></textarea>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setShowReportDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleReport()}
                                    color="primary"
                                    disabled={
                                        !reportReason || !additionalComments
                                    } // Button is disabled if either field is empty
                                >
                                    Report
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={showDeleteConfirm}
                            onClose={() => setShowDeleteConfirm(false)}
                        >
                            <DialogTitle>{"Delete Message?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this
                                    message? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    color="primary"
                                    autoFocus
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageItem;
