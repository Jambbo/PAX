import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Clock, MessageSquare, Heart, Share2, Bookmark, Eye, ArrowUp, Award, Users, Hash } from 'lucide-react';

interface TrendingPost {
    id: number;
    title: string;
    author: string;
    authorAvatar: string;
    content: string;
    category: string;
    categoryColor: string;
    timeAgo: string;
    views: number;
    replies: number;
    likes: number;
    isLiked: boolean;
    isSaved: boolean;
    trend: 'hot' | 'rising' | 'top';
}

interface TrendingTopic {
    id: number;
    name: string;
    posts: number;
    color: string;
}

export const TrendingPage: React.FC = () => {
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

    const [activeFilter, setActiveFilter] = useState<'hot' | 'rising' | 'top'>('hot');
    const [posts, setPosts] = useState<TrendingPost[]>([
        {
            id: 1,
            title: "Amazing new feature announcement - You won't believe what's coming!",
            author: "Sarah Chen",
            authorAvatar: "SC",
            content: "After months of development, we're thrilled to announce our biggest feature yet. This is going to revolutionize how we interact with the community. Stay tuned for the full reveal next week!",
            category: "Announcements",
            categoryColor: "purple",
            timeAgo: "2h ago",
            views: 12450,
            replies: 234,
            likes: 856,
            isLiked: false,
            isSaved: false,
            trend: 'hot'
        },
        {
            id: 2,
            title: "Tips for new members: Getting started guide",
            author: "Mike Rodriguez",
            authorAvatar: "MR",
            content: "Welcome everyone! Here's a comprehensive guide to help you navigate the platform. From setting up your profile to joining communities, I've covered everything you need to know.",
            category: "Support",
            categoryColor: "green",
            timeAgo: "4h ago",
            views: 8920,
            replies: 145,
            likes: 567,
            isLiked: true,
            isSaved: false,
            trend: 'hot'
        },
        {
            id: 3,
            title: "This week's community highlights and achievements",
            author: "Emma Wilson",
            authorAvatar: "EW",
            content: "What an incredible week! We've reached 10,000 active members, launched 5 new communities, and seen amazing engagement across the board. Thank you all for being part of this journey!",
            category: "General",
            categoryColor: "blue",
            timeAgo: "6h ago",
            views: 15670,
            replies: 312,
            likes: 1245,
            isLiked: false,
            isSaved: true,
            trend: 'hot'
        },
        {
            id: 4,
            title: "Live AMA: Product team answering your questions",
            author: "David Kim",
            authorAvatar: "DK",
            content: "Join us for a live AMA session with our product team! Ask anything about our roadmap, features, or how we build products. Starting in 30 minutes!",
            category: "Events",
            categoryColor: "orange",
            timeAgo: "1h ago",
            views: 6780,
            replies: 89,
            likes: 432,
            isLiked: false,
            isSaved: false,
            trend: 'rising'
        },
        {
            id: 5,
            title: "Poll: What features do you want to see next?",
            author: "Alex Turner",
            authorAvatar: "AT",
            content: "We're planning our Q2 roadmap and want YOUR input! Vote for the features you're most excited about. Your feedback directly impacts what we build next.",
            category: "Feedback",
            categoryColor: "pink",
            timeAgo: "3h ago",
            views: 9340,
            replies: 198,
            likes: 678,
            isLiked: true,
            isSaved: false,
            trend: 'rising'
        },
        {
            id: 6,
            title: "Success story: How this community changed my career",
            author: "Jessica Brown",
            authorAvatar: "JB",
            content: "I never imagined that joining this community would lead to landing my dream job. Here's my journey and how the connections I made here helped me grow professionally.",
            category: "Stories",
            categoryColor: "teal",
            timeAgo: "12h ago",
            views: 23450,
            replies: 456,
            likes: 2134,
            isLiked: false,
            isSaved: true,
            trend: 'top'
        }
    ]);

    const trendingTopics: TrendingTopic[] = [
        { id: 1, name: "ProductLaunch", posts: 234, color: "purple" },
        { id: 2, name: "CommunityGrowth", posts: 189, color: "blue" },
        { id: 3, name: "TechTips", posts: 156, color: "green" },
        { id: 4, name: "WeekendVibes", posts: 145, color: "orange" },
        { id: 5, name: "AskMeAnything", posts: 132, color: "pink" }
    ];

    const toggleLike = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const toggleSave = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isSaved: !post.isSaved }
                : post
        ));
    };

    const filteredPosts = posts.filter(post => post.trend === activeFilter);

    const filters = [
        { id: 'hot', label: 'Hot', icon: Flame, color: 'text-orange-500' },
        { id: 'rising', label: 'Rising', icon: TrendingUp, color: 'text-green-500' },
        { id: 'top', label: 'Top', icon: Award, color: 'text-purple-500' }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
                    <TrendingUp className={`text-${accentColor}-500`} size={40} />
                    Trending Now
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">
                    Discover what's hot in the community right now
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Filter Tabs */}
                    <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-2 flex gap-2 mb-6 transition-colors shadow-sm">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as 'hot' | 'rising' | 'top')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                                    activeFilter === filter.id
                                        ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/20`
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <filter.icon size={20} className={activeFilter === filter.id ? 'text-white' : filter.color} />
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Posts */}
                    <div className="space-y-4">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group shadow-sm"
                            >
                                {/* Post Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    {/* Rank Badge */}
                                    <div className={`flex-shrink-0 w-12 h-12 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${accentColor}-500/20`}>
                                        <span className="text-white font-bold text-lg">{index + 1}</span>
                                    </div>

                                    {/* Author Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {/* Avatar (Random Gradient) */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                                                index % 3 === 0 ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                                                    index % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                                                        'bg-gradient-to-br from-green-500 to-emerald-600'
                                            }`}>
                                                {post.authorAvatar}
                                            </div>

                                            <div>
                                                <p className="text-gray-900 dark:text-white font-semibold transition-colors">{post.author}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className={`px-2 py-0.5 bg-${post.categoryColor}-100 dark:bg-${post.categoryColor}-600/20 text-${post.categoryColor}-700 dark:text-${post.categoryColor}-400 rounded text-xs font-medium`}>
                                                        {post.category}
                                                    </span>
                                                    <span>•</span>
                                                    <Clock size={14} />
                                                    <span>{post.timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <h2 className={`text-gray-900 dark:text-white font-bold text-xl mb-2 group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors`}>
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Stats & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-4">
                                    <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Eye size={16} />
                                            <span>{post.views.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare size={16} />
                                            <span>{post.replies}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Heart size={16} className={post.isLiked ? 'fill-red-500 text-red-500' : ''} />
                                            <span>{post.likes}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(post.id);
                                            }}
                                            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                                                post.isLiked
                                                    ? 'bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-600/30'
                                                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                                            <span className="text-sm font-medium">Like</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSave(post.id);
                                            }}
                                            className={`p-2 rounded-lg transition-all ${
                                                post.isSaved
                                                    ? `bg-${accentColor}-100 dark:bg-${accentColor}-600/20 text-${accentColor}-600 dark:text-${accentColor}-400 hover:bg-${accentColor}-200 dark:hover:bg-${accentColor}-600/30`
                                                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Bookmark size={16} className={post.isSaved ? 'fill-current' : ''} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-80 space-y-6">
                    {/* Trending Topics */}
                    <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <Hash className={`text-${accentColor}-500`} size={20} />
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg transition-colors">Trending Topics</h3>
                        </div>
                        <div className="space-y-3">
                            {trendingTopics.map((topic, index) => (
                                <button
                                    key={topic.id}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
                                >
                                    <div className={`w-8 h-8 bg-${accentColor}-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`text-gray-900 dark:text-white font-semibold group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors`}>
                                            #{topic.name}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{topic.posts} posts</p>
                                    </div>
                                    <ArrowUp className="text-green-500" size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Community Stats */}
                    <div className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/10 border border-${accentColor}-200 dark:border-${accentColor}-500/20 rounded-xl p-6 transition-colors`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className={`text-${accentColor}-600 dark:text-${accentColor}-400`} size={20} />
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg transition-colors">Community Stats</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Active Members</span>
                                    <span className="text-gray-900 dark:text-white font-bold">8,234</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2">
                                    <div className={`bg-${accentColor}-600 h-2 rounded-full`} style={{ width: '75%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Posts Today</span>
                                    <span className="text-gray-900 dark:text-white font-bold">1,423</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Engagement Rate</span>
                                    <span className="text-gray-900 dark:text-white font-bold">92%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};