import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Image, Check, CheckCheck } from 'lucide-react';

interface Message {
    id: number;
    sender: string;
    content: string;
    time: string;
    isSent: boolean;
    isRead: boolean;
}

interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

export const MessagesPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const conversations: Conversation[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'SJ',
            lastMessage: 'Hey! Did you see the new announcement?',
            time: '2m ago',
            unread: 2,
            online: true
        },
        {
            id: 2,
            name: 'Mike Rodriguez',
            avatar: 'MR',
            lastMessage: 'Thanks for your help earlier!',
            time: '1h ago',
            unread: 0,
            online: true
        },
        {
            id: 3,
            name: 'Emily Chen',
            avatar: 'EC',
            lastMessage: 'See you at the meetup tomorrow?',
            time: '3h ago',
            unread: 1,
            online: false
        },
        {
            id: 4,
            name: 'Alex Turner',
            avatar: 'AT',
            lastMessage: 'That\'s a great idea! Let\'s do it.',
            time: '5h ago',
            unread: 0,
            online: false
        },
        {
            id: 5,
            name: 'Community Group',
            avatar: 'CG',
            lastMessage: 'John: Welcome everyone to the group!',
            time: '1d ago',
            unread: 5,
            online: true
        },
        {
            id: 6,
            name: 'David Kim',
            avatar: 'DK',
            lastMessage: 'Perfect! I\'ll send you the details.',
            time: '2d ago',
            unread: 0,
            online: false
        }
    ];

    const messages: Message[] = [
        {
            id: 1,
            sender: 'Sarah Johnson',
            content: 'Hey there! How are you doing?',
            time: '10:30 AM',
            isSent: false,
            isRead: true
        },
        {
            id: 2,
            sender: 'You',
            content: 'Hi Sarah! I\'m doing great, thanks for asking!',
            time: '10:32 AM',
            isSent: true,
            isRead: true
        },
        {
            id: 3,
            sender: 'Sarah Johnson',
            content: 'Did you see the new announcement about the upcoming event?',
            time: '10:33 AM',
            isSent: false,
            isRead: true
        },
        {
            id: 4,
            sender: 'You',
            content: 'Not yet! What\'s it about?',
            time: '10:35 AM',
            isSent: true,
            isRead: true
        },
        {
            id: 5,
            sender: 'Sarah Johnson',
            content: 'They\'re organizing a community meetup next weekend. It sounds really exciting!',
            time: '10:36 AM',
            isSent: false,
            isRead: true
        },
        {
            id: 6,
            sender: 'Sarah Johnson',
            content: 'You should definitely come! It would be great to meet in person.',
            time: '10:36 AM',
            isSent: false,
            isRead: true
        },
        {
            id: 7,
            sender: 'You',
            content: 'That sounds amazing! I\'ll definitely check it out. Thanks for letting me know!',
            time: '10:38 AM',
            isSent: true,
            isRead: false
        }
    ];

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // Handle sending message logic here
            console.log('Sending:', messageInput);
            setMessageInput('');
        }
    };

    const selectedConversation = conversations.find(c => c.id === selectedChat);

    return (
        <div className="h-[calc(100vh-7rem)] flex gap-4">
            {/* Conversations List */}
            <div className="w-80 bg-gray-800/30 border border-gray-700/50 rounded-xl flex flex-col overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-700/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedChat(conv.id)}
                            className={`w-full flex items-center gap-3 p-4 border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors ${
                                selectedChat === conv.id ? 'bg-gray-700/50' : ''
                            }`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                    conv.id === 5 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                        conv.id % 3 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                                            conv.id % 2 === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                                                'bg-gradient-to-br from-orange-500 to-red-600'
                                }`}>
                                    {conv.avatar}
                                </div>
                                {conv.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-800 rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                                    <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="flex-shrink-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{conv.unread}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-xl flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center font-bold text-white">
                                {selectedConversation?.avatar}
                            </div>
                            {selectedConversation?.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">{selectedConversation?.name}</h2>
                            <p className="text-xs text-gray-400">
                                {selectedConversation?.online ? 'Active now' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <Phone size={20} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <Video size={20} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md ${message.isSent ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 ${
                                        message.isSent
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                            : 'bg-gray-700/50 text-white'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 px-2 ${
                                    message.isSent ? 'justify-end' : 'justify-start'
                                }`}>
                                    <span className="text-xs text-gray-500">{message.time}</span>
                                    {message.isSent && (
                                        message.isRead ? (
                                            <CheckCheck size={14} className="text-purple-400" />
                                        ) : (
                                            <Check size={14} className="text-gray-500" />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700/50">
                    <div className="flex items-end gap-3">
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                                <Paperclip size={20} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                                <Image size={20} />
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Type a message..."
                                rows={1}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            />
                            <button className="absolute right-3 bottom-3 text-gray-400 hover:text-white transition-colors">
                                <Smile size={20} />
                            </button>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Send size={20} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};