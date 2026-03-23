import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { Send } from "lucide-react";

interface User {
    id: string;
    username: string;
}

interface ChatMessage {
    id?: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt?: string;
}

export const MessagesPage: React.FC = () => {
    
const [users, setUsers] = useState<User[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState("");
const [client, setClient] = useState<Client | null>(null);
const [currentUserId, setCurrentUserId] = useState<string>("");

// userId -> conversationId
const [conversationMap, setConversationMap] =
    useState<Record<string, string>>({});

const getUserIdFromToken = () => {
    const token = localStorage.getItem("access_token")!;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
};

// websocket connect
useEffect(() => {

    const token = localStorage.getItem("access_token")!;
    const userId = getUserIdFromToken();
    setCurrentUserId(userId);

    const stompClient = new Client({
        brokerURL: "ws://localhost:8081/ws",
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000
    });

    stompClient.onConnect = () => {
        stompClient.subscribe("/user/queue/messages", (msg) => {
            const body: ChatMessage = JSON.parse(msg.body);

            setMessages(prev => {
                const exists = prev.find(m => m.id === body.id);
                if (exists) return prev;
                return [...prev, body];
            });

            // detect other participant
            const otherUserId =
                body.senderId === userId
                    ? getRecipientFromConversation(body, userId)
                    : body.senderId;

            if (otherUserId) {
                setConversationMap(prev => ({
                    ...prev,
                    [otherUserId]: body.conversationId
                }));
            }
        });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();

}, []);

// helper to detect other user
const getRecipientFromConversation = (
    message: ChatMessage,
    me: string
) => {
    const match = messages.find(
        m =>
            m.conversationId === message.conversationId &&
            m.senderId !== me
    );
    return match?.senderId;
};

// load users
useEffect(() => {
    fetch("http://localhost:8081/api/v1/users/latest", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setUsers(data);
        });
}, []);

const sendMessage = () => {
    if (!input.trim() || !selectedUser || !client) return;

    client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
            recipientId: selectedUser.id,
            content: input
        })
    });

    setInput("");
};

const activeConversationId =
    selectedUser ? conversationMap[selectedUser.id] : null;

const filteredMessages = messages.filter(
    m => m.conversationId === activeConversationId
);

return (
    <div className="h-[calc(100vh-7rem)] flex max-w-6xl mx-auto border rounded-xl overflow-hidden">

        {/* USERS */}
        <div className="w-72 border-r bg-gray-900 text-white">
            <div className="p-4 font-semibold">Users</div>

            {users.map(user => (
                <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer hover:bg-gray-800 ${
        selectedUser?.id === user.id ? "bg-gray-800" : ""
    }`}
                >
                    {user.username}
                </div>
            ))}
        </div>

        {/* CHAT */}
        <div className="flex-1 flex flex-col bg-gray-800 text-white">

            <div className="p-4 border-b">
                {selectedUser ? selectedUser.username : "Select user"}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredMessages.map((msg, i) => {

                    const isMine = msg.senderId === currentUserId;

                    return (
                        <div
                            key={i}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs ${
        isMine ? "bg-purple-600" : "bg-gray-700"
    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-gray-700 px-3 py-2 rounded"
                    placeholder="Type message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />

                <button
                    onClick={sendMessage}
                    className="bg-purple-600 px-4 rounded flex items-center"
                >
                    <Send size={18}/>
                </button>
            </div>
        </div>
    </div>
);

};
