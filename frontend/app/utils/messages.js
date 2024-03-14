const fb = require("_firebase/firebase");
const axios = require("axios");
const cryptoJS = require("crypto-js");
import MessageItem from "@/app/chat/messageItem";

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const fetchMessages = async (chatId, userInfo) => {
    const token = await fb.getToken();
    const response = await axios.get(`${SERVERLOCATION}/api/chats/${chatId}/messages`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const fetchedMessages = response.data.map((messageData, i) => {
        let sentAt = new Date(messageData.sentAt._seconds * 1000 + messageData.sentAt._nanoseconds / 1000000);

        messageData.message = cryptoJS.AES.decrypt(messageData.message, chatId).toString(cryptoJS.enc.Utf8);
        if (messageData.message === "") messageData.message = "Unencrypted message";
        return <MessageItem
            key={i}
            sender={messageData.sender}
            timestamp={sentAt.toLocaleDateString() + " " + sentAt.toLocaleTimeString()}
            message={messageData.message}
            reactions={messageData.reactions || {}}
            userData={userInfo.data}
        />
    });
    return fetchedMessages;
}
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

module.exports = { fetchMessages, fetchDirectMessages };