import React, { useState } from 'react';
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

    // ===== СТЕЙТ ДЛЯ МОДАЛКИ СТВОРЕННЯ КОМ'ЮНІТІ =====
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const openCreateModal = () => {
        setServerError(null);
        setIsCreateOpen(true);
    };

    const closeCreateModal = () => {
        if (isSubmitting) return; // не даємо закрити, поки "створюємо"
        setIsCreateOpen(false);
        setServerError(null);
    };

    const handleCreateCommunity = async (data: CreateCommunityFormData) => {
        setIsSubmitting(true);
        setServerError(null);

        try {
            // МНЕ ЧАТИК СКАЗАЛ ТУТ ТЕБЕ НАДО БУДЕТ ЗАПРОС НА БЕКЭНД ДЕЛАТЬ
            console.log("Create community payload (to send to backend later):", data);

            setIsCreateOpen(false);

            // Хз не работает хуйня
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
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <Users className="text-purple-500" size={40} />
                    Communities
                </h1>
                <p className="text-gray-400 text-lg">
                    Join communities and connect with people who share your interests
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Total Communities</p>
                            <p className="text-white text-xl font-bold">{communities.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Check size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Joined</p>
                            <p className="text-white text-xl font-bold">{communities.filter(c => c.isJoined).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Total Members</p>
                            <p className="text-white text-xl font-bold">
                                {(communities.reduce((acc, c) => acc + c.members, 0) / 1000).toFixed(1)}k
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Total Posts</p>
                            <p className="text-white text-xl font-bold">
                                {(communities.reduce((acc, c) => acc + c.posts, 0) / 1000).toFixed(1)}k
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-6">
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
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
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
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 font-medium flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Create Community
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
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
                        className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600 transition-all group"
                    >
                        {/* Banner */}
                        <div className={`h-24 bg-gradient-to-r ${community.banner} relative`}>
                            <div className="absolute top-3 right-3 flex gap-2">
                                {community.isVerified && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                                        <Shield size={14} className="text-white" />
                                    </div>
                                )}
                                {community.isPrivate && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
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
                                    className={`w-20 h-20 bg-gradient-to-r ${community.banner} rounded-xl flex items-center justify-center font-bold text-white text-2xl border-4 border-gray-800`}
                                >
                                    {community.avatar}
                                </div>
                                <button
                                    onClick={() => toggleJoin(community.id)}
                                    className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                                        community.isJoined
                                            ? 'bg-gray-700/50 text-white hover:bg-gray-700'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20'
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
                            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                {community.name}
                                {community.isVerified && (
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                )}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                {community.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>{(community.members / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} />
                                        <span>{(community.posts / 1000).toFixed(1)}k</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-green-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs">{community.onlineMembers} online</span>
                                </div>
                            </div>

                            {/* Category Tag */}
                            <div className="mt-4 pt-4 border-t border-gray-700/50">
                                <span className="inline-block px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium">
                                    {community.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCommunities.length === 0 && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-12 text-center">
                    <Users size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">No communities found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 font-medium">
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
