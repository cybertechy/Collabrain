const fb = require("_firebase/firebase");
const axios = require("axios");
import MessageItem from "@/app/chat/messageItem";
const fetchMessages = async (chatId, userInfo)=>{
    const token = await fb.getToken();
    const response = await axios.get(`http://localhost:8080/api/chats/${chatId}/messages`, {
    headers: { "Authorization": "Bearer " + token }
    
    
});
const fetchedMessages = response.data.map((messageData, i) => {
    let sentAt = new Date(messageData.sentAt._seconds * 1000 +  messageData.sentAt._nanoseconds / 1000000);
    return <MessageItem
        key={i}
        sender={messageData.sender}
        timestamp={sentAt.toLocaleDateString()+ ", " + sentAt.toLocaleTimeString()}
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
            "http://localhost:8080/api/chats/",
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

module.exports = {fetchMessages, fetchDirectMessages};