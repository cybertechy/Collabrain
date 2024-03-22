const fb = require("_firebase/firebase");
const axios = require("axios");
const cryptoJS = require("crypto-js");
import MessageItem from "@/components/ui/messagesComponents/MessageItem";
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const fetchMessages = async (chatId, userInfo) => {
    const token = await fb.getToken();
    const response = await axios.get(`${SERVERLOCATION}/api/chats/${chatId}/messages`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const fetchedMessages = response.data.map((messageData, i) => {
        let sentAt = new Date(messageData.sentAt._seconds * 1000 + messageData.sentAt._nanoseconds / 1000000);
        let decryptedMessage = "";

        try {
            const bytes = cryptoJS.AES.decrypt(messageData.message, chatId);
            decryptedMessage = bytes.toString(cryptoJS.enc.Utf8);
            if (decryptedMessage === "") throw new Error('Decryption returned empty string');
        } catch (error) {
            console.error("Error decrypting message:", error);
            decryptedMessage = "Unencrypted message or decryption error";
        }

        return <MessageItem
            key={messageData.id}
            sender={messageData.sender}
            senderId = {messageData.senderId}
            timestamp={sentAt.toLocaleDateString() + ", " + sentAt.toLocaleTimeString()}
            message={decryptedMessage}
            messageId = {messageData.id}
            reactions={messageData.reactions || {}}
            attachmentIds = {messageData.attachments || []}
            chatId = {chatId}
            userData={userInfo.data}
        />
    });
    return fetchedMessages;
};

const fetchDirectMessages = async () => {
    try {
        const token = await fb.getToken();
        const response = await axios.get(
            `${SERVERLOCATION}/api/chats/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        return response.data;
    } catch (error) {
        console.error("Error fetching direct messages:", error);
        return [];
    }
};


const updateMessage = async (chatId, messageId, updatedContent) => {
    try {
        const token = await fb.getToken();
        const payload = {};

        // Check if updating message text or reactions
        if (updatedContent.message) {
            payload.message = updatedContent.message;
        } else if (updatedContent.reactions) {
            payload.reactions = updatedContent.reactions;
        }

        // Send the PATCH request
        const response = await axios.patch(`${SERVERLOCATION}/api/chats/${chatId}/messages/${messageId}`, payload, {
            headers: { "Authorization": "Bearer " + token }
        });

        console.log("Message update response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating message:", error);
        return null;
    }
};
const reportMessage = async ({ chatId, teamId, messageId, reason, source, sender, message, image }) => {
    try {
        const token = await fb.getToken();
        let payload = {
            reason: reason,
            sender: sender,
            // Include messageId, message, and image directly in the payload if your backend expects them in the body
            ...(messageId && { messageId: messageId }),
            ...(message && { message: message }),
            ...(image && { image: image }),
            source : source,
            chat: chatId,
            team: teamId,
            policy: "message content violation"
        };

       

        // The endpoint URL now includes query parameters directly
        const response = await axios.post(`${SERVERLOCATION}/api/reports`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" // Ensure to set Content-Type for JSON body
            }
        });

        console.log("Report response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error reporting message:", error);
        return null;
    }
};




module.exports = { fetchMessages, fetchDirectMessages, reportMessage};