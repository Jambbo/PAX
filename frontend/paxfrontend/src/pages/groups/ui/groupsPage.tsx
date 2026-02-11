import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    TrendingUp,
    Lock,
    Globe,
    Star,
    MessageSquare,
    Eye,
    UserPlus,
    Check,
    Crown,
    Shield
} from 'lucide-react';
import { categories, Community } from "../index";
import {
    CreateCommunityModal,
    CreateCommunityFormData
} from "../createCommunity";

export const GroupsPage: React.FC = () => {
    // --- COLOR LOGIC ---
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

    const [activeTab, setActiveTab] = useState<'discover' | 'joined' | 'popular'>('discover');
    const [searchQuery, setSearchQuery] = useState('');
    const [communities, setCommunities] = useState<Community[]>([
        {
            id: 1,
            name: "Tech Enthusiasts",
            description: "A community for developers, designers, and tech lovers to share knowledge, projects, and innovations.",
            avatar: "TE",
            banner: "from-blue-500 to-cyan-600",
            members: 12450,
            posts: 8934,
            category: "Technology",
            isPrivate: false,
            isJoined: true,
            isVerified: true,
            onlineMembers: 234
        },
        {
            id: 2,
            name: "Creative Studio",
            description: "Share your art, get feedback, and connect with fellow artists. All forms of creativity welcome!",
            avatar: "CS",
            banner: "from-purple-500 to-pink-600",
            members: 8920,
            posts: 15678,
            category: "Art & Design",
            isPrivate: false,
            isJoined: false,
            isVerified: true,
            onlineMembers: 156
        },
        {
            id: 3,
            name: "Fitness Warriors",
            description: "Get fit, stay motivated, and achieve your health goals together. Share workouts, meal plans, and progress!",
            avatar: "FW",
            banner: "from-green-500 to-emerald-600",
            members: 15670,
            posts: 23456,
            category: "Health & Fitness",
            isPrivate: false,
            isJoined: true,
            isVerified: false,
            onlineMembers: 389
        },
        {
            id: 4,
            name: "Book Club Elite",
            description: "Private community for serious readers. Discuss literature, share recommendations, and join reading challenges.",
            avatar: "BC",
            banner: "from-orange-500 to-red-600",
            members: 3420,
            posts: 5678,
            category: "Literature",
            isPrivate: true,
            isJoined: false,
            isVerified: true,
            onlineMembers: 45
        },
        {
            id: 5,
            name: "Gaming Legends",
            description: "From casual to competitive - all gamers welcome! Share gameplay, strategies, and find teammates.",
            avatar: "GL",
            banner: "from-indigo-500 to-purple-600",
            members: 23450,
            posts: 45678,
            category: "Gaming",
            isPrivate: false,
            isJoined: false,
            isVerified: true,
            onlineMembers: 567
        },
        {
            id: 6,
            name: "Startup Founders",
            description: "Connect with entrepreneurs, share experiences, and get advice on building successful startups.",
            avatar: "SF",
            banner: "from-teal-500 to-cyan-600",
            members: 6780,
            posts: 4532,
            category: "Business",
            isPrivate: false,
            isJoined: true,
            isVerified: false,
            onlineMembers: 89
        },
        {
            id: 7,
            name: "Music Producers",
            description: "Share beats, get feedback on your tracks, and collaborate with producers worldwide.",
            avatar: "MP",
            banner: "from-pink-500 to-rose-600",
            members: 9340,
            posts: 12345,
            category: "Music",
            isPrivate: false,
            isJoined: false,
            isVerified: false,
            onlineMembers: 178
        },
        {
            id: 8,
            name: "VIP Investors",
            description: "Exclusive community for verified investors. Discuss strategies, market trends, and opportunities.",
            avatar: "VI",
            banner: "from-yellow-500 to-orange-600",
            members: 1234,
            posts: 2345,
            category: "Finance",
            isPrivate: true,
            isJoined: false,
            isVerified: true,
            onlineMembers: 23
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // ===== CREATE COMMUNITY MODAL STATE =====
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const openCreateModal = () => {
        setServerError(null);
        setIsCreateOpen(true);
    };

    const closeCreateModal = () => {
        if (isSubmitting) return;
        setIsCreateOpen(false);
        setServerError(null);
    };

    const handleCreateCommunity = async (data: CreateCommunityFormData) => {
        setIsSubmitting(true);
        setServerError(null);

        try {
            console.log("Create community payload (to send to backend later):", data);
            setIsCreateOpen(false);
            // setCommunities(prev => [...prev, { ... }]);
        } catch (err) {
            setServerError("Failed to create community. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    // =================================================

    const toggleJoin = (communityId: number) => {
        setCommunities(communities.map(community =>
            community.id === communityId
                ? {
                    ...community,
                    isJoined: !community.isJoined,
                    members: community.isJoined ? community.members - 1 : community.members + 1
                }
                : community
        ));
    };

    const filteredCommunities = communities.filter(community => {
        const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All Categories" || community.category === selectedCategory;
        const matchesTab =
            activeTab === 'discover'
                ? !community.isJoined
                : activeTab === 'joined'
                    ? community.isJoined
                    : true;
        return matchesSearch && matchesCategory && matchesTab;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
                    <Users className={`text-${accentColor}-500`} size={40} />
                    Communities
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">
                    Join communities and connect with people who share your interests
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/10 border border-${accentColor}-200 dark:border-${accentColor}-500/20 rounded-xl p-4 transition-colors`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-md shadow-${accentColor}-500/20`}>
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Communities</p>
                            <p className="text-gray-900 dark:text-white text-xl font-bold">{communities.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                            <Check size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Joined</p>
                            <p className="text-gray-900 dark:text-white text-xl font-bold">{communities.filter(c => c.isJoined).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Members</p>
                            <p className="text-gray-900 dark:text-white text-xl font-bold">
                                {(communities.reduce((acc, c) => acc + c.members, 0) / 1000).toFixed(1)}k
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Posts</p>
                            <p className="text-gray-900 dark:text-white text-xl font-bold">
                                {(communities.reduce((acc, c) => acc + c.posts, 0) / 1000).toFixed(1)}k
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 mb-6 shadow-sm transition-colors">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Tabs */}
                    <div className="flex gap-2">
                        {[
                            { id: 'discover', label: 'Discover' },
                            { id: 'joined', label: 'My Communities' },
                            { id: 'popular', label: 'Popular' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'discover' | 'joined' | 'popular')}
                                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                                    activeTab === tab.id
                                        ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/20`
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={openCreateModal}
                        className={`px-4 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium flex items-center gap-2 whitespace-nowrap`}
                    >
                        <Plus size={18} />
                        Create Community
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? `bg-${accentColor}-600 text-white shadow-md shadow-${accentColor}-500/20`
                                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                    <div
                        key={community.id}
                        className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all group shadow-sm hover:shadow-md"
                    >
                        {/* Banner */}
                        <div className={`h-24 bg-gradient-to-r ${community.banner} relative`}>
                            <div className="absolute top-3 right-3 flex gap-2">
                                {community.isVerified && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5" title="Verified Community">
                                        <Shield size={14} className="text-white" />
                                    </div>
                                )}
                                {community.isPrivate && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5" title="Private Community">
                                        <Lock size={14} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Avatar */}
                            <div className="flex items-start justify-between mb-3 -mt-12">
                                <div
                                    className={`z-10 w-20 h-20 bg-gradient-to-r ${community.banner} rounded-xl flex items-center justify-center font-bold text-white text-2xl border-4 border-white dark:border-gray-800 shadow-md`}
                                >
                                    {community.avatar}
                                </div>
                                <button
                                    onClick={() => toggleJoin(community.id)}
                                    className={`z-10 px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                                        community.isJoined
                                            ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                            : `bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white shadow-lg shadow-${accentColor}-500/20`
                                    }`}
                                >
                                    {community.isJoined ? (
                                        <>
                                            <Check size={16} />
                                            Joined
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            Join
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Info */}
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1 flex items-center gap-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {community.name}
                                {community.isVerified && (
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                )}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {community.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1" title="Members">
                                        <Users size={14} />
                                        <span>{(community.members / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Posts">
                                        <MessageSquare size={14} />
                                        <span>{(community.posts / 1000).toFixed(1)}k</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-green-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-medium">{community.onlineMembers} online</span>
                                </div>
                            </div>

                            {/* Category Tag */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <span className={`inline-block px-3 py-1 bg-${accentColor}-50 dark:bg-${accentColor}-900/20 text-${accentColor}-700 dark:text-${accentColor}-300 rounded-full text-xs font-medium transition-colors`}>
                                    {community.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCommunities.length === 0 && (
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                    <Users size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No communities found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory("All Categories");
                            setActiveTab('discover');
                        }}
                        className={`px-6 py-3 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium`}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Create Community Modal */}
            <CreateCommunityModal
                isOpen={isCreateOpen}
                onClose={closeCreateModal}
                onSubmit={handleCreateCommunity}
                isSubmitting={isSubmitting}
                serverError={serverError}
            />
        </div>
    );
};