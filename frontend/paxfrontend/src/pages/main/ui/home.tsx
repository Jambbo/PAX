import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Users, Eye } from 'lucide-react';

export const Home: React.FC = () => {
    // --- ЛОГІКА КОЛЬОРІВ ---
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('site_accent_color') || 'purple';
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setAccentColor(localStorage.getItem('site_accent_color') || 'purple');
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('accent-color-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('accent-color-change', handleStorageChange);
        };
    }, []);
    // -----------------------

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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    Welcome to <span className={`text-${accentColor}-600`}>PAX</span> Community
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">
                    Connect, share, and engage with thousands of members worldwide
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Purple Card - Discussions */}
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Discussions</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">12,459</p>
                        </div>
                    </div>
                </div>

                {/* Blue Card - Members */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Members</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">8,234</p>
                        </div>
                    </div>
                </div>

                {/* Green Card - Online */}
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Online Now</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">1,423</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-xl p-6 shadow-sm transition-colors">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className={`text-${accentColor}-500`} size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Trending Discussions</h2>
                </div>

                <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className={`text-gray-900 dark:text-white font-semibold group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors flex-1`}>
                                    {topic.title}
                                </h3>
                                <span className={`text-xs font-medium bg-${accentColor}-100 dark:bg-${accentColor}-600/20 text-${accentColor}-700 dark:text-${accentColor}-300 px-2 py-1 rounded transition-colors`}>
                                    {topic.category}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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