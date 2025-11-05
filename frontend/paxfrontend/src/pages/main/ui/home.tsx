import React from 'react';
import { TrendingUp, MessageSquare, Users, Eye } from 'lucide-react';

export const Home: React.FC = () => {
    const trendingTopics = [
        {
            title: "What's your favorite coding language?",
            author: "Sarah J.",
            replies: 234,
            views: 1240,
            category: "General"
        },
        {
            title: "New feature announcement - Dark Mode 2.0",
            author: "Admin",
            replies: 89,
            views: 3500,
            category: "Announcements"
        },
        {
            title: "Community meetup this weekend!",
            author: "Mike R.",
            replies: 45,
            views: 890,
            category: "Events"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome to <span className="text-purple-500">PAX</span> Community
                </h1>
                <p className="text-gray-400 text-lg">
                    Connect, share, and engage with thousands of members worldwide
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Discussions</p>
                            <p className="text-white text-2xl font-bold">12,459</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Active Members</p>
                            <p className="text-white text-2xl font-bold">8,234</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Online Now</p>
                            <p className="text-white text-2xl font-bold">1,423</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-purple-500" size={24} />
                    <h2 className="text-2xl font-bold text-white">Trending Discussions</h2>
                </div>

                <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/50 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors flex-1">
                                    {topic.title}
                                </h3>
                                <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                    {topic.category}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>by {topic.author}</span>
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    <span>{topic.replies}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye size={14} />
                                    <span>{topic.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};