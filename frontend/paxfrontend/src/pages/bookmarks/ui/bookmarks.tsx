import React, { useState } from 'react';
import {
    Bookmark,
    Search,
    Filter,
    MessageSquare,
    Eye,
    Heart,
    Share2,
    Trash2,
    Users,
    Hash,
    MoreVertical,
    Calendar,
    TrendingUp
} from 'lucide-react';

interface BookmarkItem {
    id: number;
    type: 'discussion' | 'post' | 'community';
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    community?: string;
    communityColor?: string;
    date: string;
    stats: {
        likes: number;
        replies: number;
        views: number;
    };
    tags: string[];
}

export const BookmarksPage = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'discussion' | 'post' | 'community'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
        {
            id: 1,
            type: 'discussion',
            title: 'What are the best practices for React performance optimization?',
            content: 'I\'ve been working on a large React application and noticed some performance issues. Looking for advice on memoization, code splitting, and other optimization techniques.',
            author: 'Sarah J.',
            authorAvatar: 'SJ',
            community: 'Tech Enthusiasts',
            communityColor: 'from-blue-500 to-cyan-600',
            date: '2 days ago',
            stats: { likes: 234, replies: 89, views: 1240 },
            tags: ['React', 'Performance', 'JavaScript']
        },
        {
            id: 2,
            type: 'post',
            title: 'My journey to becoming a full-stack developer',
            content: 'After 2 years of self-learning, I finally landed my first developer job! Here\'s everything I learned along the way and resources that helped me the most.',
            author: 'Mike R.',
            authorAvatar: 'MR',
            community: 'Career Growth',
            communityColor: 'from-green-500 to-emerald-600',
            date: '5 days ago',
            stats: { likes: 567, replies: 123, views: 3450 },
            tags: ['Career', 'Learning', 'Motivation']
        },
        {
            id: 3,
            type: 'discussion',
            title: 'Dark Mode 2.0 - New features and improvements',
            content: 'We\'re excited to announce Dark Mode 2.0 with customizable themes, better contrast options, and reduced eye strain. Check out the new features!',
            author: 'Admin',
            authorAvatar: 'AD',
            community: 'Announcements',
            communityColor: 'from-purple-500 to-pink-600',
            date: '1 week ago',
            stats: { likes: 892, replies: 234, views: 5670 },
            tags: ['Announcement', 'Features', 'UI/UX']
        },
        {
            id: 4,
            type: 'post',
            title: 'Top 10 VS Code extensions every developer needs',
            content: 'Here\'s my curated list of essential VS Code extensions that have transformed my coding workflow. From productivity to debugging, these are game-changers!',
            author: 'Alex K.',
            authorAvatar: 'AK',
            community: 'Tech Enthusiasts',
            communityColor: 'from-blue-500 to-cyan-600',
            date: '2 weeks ago',
            stats: { likes: 445, replies: 67, views: 2340 },
            tags: ['Tools', 'Productivity', 'VSCode']
        },
        {
            id: 5,
            type: 'discussion',
            title: 'Community meetup recap and photos',
            content: 'What an amazing turnout at yesterday\'s community meetup! Over 150 members joined us. Here are some highlights and photos from the event.',
            author: 'Emily S.',
            authorAvatar: 'ES',
            community: 'Events',
            communityColor: 'from-orange-500 to-red-600',
            date: '3 weeks ago',
            stats: { likes: 678, replies: 145, views: 4120 },
            tags: ['Events', 'Community', 'Networking']
        }
    ]);

    const removeBookmark = (id: number) => {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    };

    const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesFilter = activeFilter === 'all' || bookmark.type === activeFilter;
        const matchesSearch =
            bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
        if (sortBy === 'popular') {
            return b.stats.likes - a.stats.likes;
        }
        return 0; // Keep original order for 'recent' and 'oldest'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Bookmark className="text-purple-500" size={40} />
                        Bookmarks
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your saved discussions, posts, and communities
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Bookmark size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Total Saved</p>
                                <p className="text-white text-xl font-bold">{bookmarks.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-lg shadow-blue-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                                <MessageSquare size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Discussions</p>
                                <p className="text-white text-xl font-bold">
                                    {bookmarks.filter(b => b.type === 'discussion').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg shadow-green-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Posts</p>
                                <p className="text-white text-xl font-bold">
                                    {bookmarks.filter(b => b.type === 'post').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4 shadow-lg shadow-orange-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Communities</p>
                                <p className="text-white text-xl font-bold">
                                    {bookmarks.filter(b => b.type === 'community').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 mb-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'discussion', label: 'Discussions' },
                                { id: 'post', label: 'Posts' },
                                { id: 'community', label: 'Communities' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id as any)}
                                    className={`px-4 py-2 rounded-lg transition-all font-medium ${
                                        activeFilter === filter.id
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search bookmarks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-950/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-gray-950/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Popular</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Bookmarks List */}
                <div className="space-y-4">
                    {sortedBookmarks.map((bookmark) => (
                        <div
                            key={bookmark.id}
                            className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all group shadow-lg hover:shadow-purple-500/10"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-10 h-10 bg-gradient-to-r ${bookmark.communityColor} rounded-lg flex items-center justify-center font-bold text-white text-sm`}>
                                        {bookmark.authorAvatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">{bookmark.author}</span>
                                            <span className="text-gray-500 text-sm">•</span>
                                            <span className="text-gray-400 text-sm">{bookmark.date}</span>
                                        </div>
                                        {bookmark.community && (
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <Hash size={14} />
                                                <span>{bookmark.community}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors cursor-pointer">
                                {bookmark.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {bookmark.content}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {bookmark.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                    {tag}
                                </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Heart size={16} />
                                    <span>{bookmark.stats.likes}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    <span>{bookmark.stats.replies}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} />
                                    <span>{bookmark.stats.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {sortedBookmarks.length === 0 && (
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-12 text-center shadow-lg">
                        <Bookmark size={48} className="text-purple-500/50 mx-auto mb-4" />
                        <h3 className="text-white font-bold text-xl mb-2">No bookmarks found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Start bookmarking discussions and posts you want to save for later"}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-purple-500/30 font-medium"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}