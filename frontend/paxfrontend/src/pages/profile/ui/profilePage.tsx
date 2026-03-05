import React, { useState, useEffect, useRef } from 'react';
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Link as LinkIcon,
    Edit3,
    Settings,
    Camera,
    Heart,
    MessageSquare,
    Eye,
    Bookmark,
    Users,
    Award,
    TrendingUp,
    Star,
    Shield,
    ExternalLink,
    Github,
    Twitter,
    Globe,
    Hash,
    MoreHorizontal,
    Share2,
    UserPlus,
    Check,
    Clock,
    Zap,
    X,
    Save,
    Crown,
    Trash2
} from 'lucide-react';

interface UserProfile {
    name: string;
    username: string;
    avatar: string;
    bannerGradient: string;
    bio: string;
    location: string;
    website: string;
    joinDate: string;
    email: string;
    isVerified: boolean;
    isOnline: boolean;
    stats: {
        posts: number;
        followers: number;
        following: number;
        reputation: number;
    };
    socials: {
        github: string;
        twitter: string;
        website: string;
    };
}

interface UserPost {
    id: number;
    title: string;
    content: string;
    community: string;
    communityColor: string;
    date: string;
    stats: {
        likes: number;
        replies: number;
        views: number;
    };
    tags: string[];
    isPinned?: boolean;
}

interface UserBadge {
    id: number;
    name: string;
    icon: string;
    color: string;
    description: string;
}

interface UserCommunity {
    id: number;
    name: string;
    avatar: string;
    banner: string;
    members: number;
    role: 'owner' | 'admin' | 'moderator' | 'member';
}

// ===================== EDIT PROFILE MODAL =====================
interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    onSave: (updated: UserProfile) => void;
    accentColor: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               profile,
                                                               onSave,
                                                               accentColor
                                                           }) => {
    const [form, setForm] = useState<UserProfile>(profile);
    const [activeSection, setActiveSection] = useState<'general' | 'socials'>('general');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) setForm(profile);
    }, [isOpen, profile]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (field: string, value: string) => {
        setForm(prev => ({
            ...prev,
            socials: { ...prev.socials, [field]: value }
        }));
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Edit3 size={22} className={`text-${accentColor}-500`} />
                            Edit Profile
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Update your personal information
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Section Tabs */}
                <div className="px-6 pt-4 flex gap-2">
                    {[
                        { id: 'general', label: 'General' },
                        { id: 'socials', label: 'Social Links' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeSection === tab.id
                                    ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/20`
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {activeSection === 'general' && (
                        <>
                            {/* Avatar Preview */}
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`w-20 h-20 bg-gradient-to-r ${form.bannerGradient} rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-lg`}>
                                    {form.avatar}
                                </div>
                                <div>
                                    <button className={`px-4 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2`}>
                                        <Camera size={16} />
                                        Change Avatar
                                    </button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                        JPG, PNG or GIF. Max 2MB.
                                    </p>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                    placeholder="Your display name"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={e => handleChange('username', e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                        placeholder="username"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Bio
                                </label>
                                <textarea
                                    value={form.bio}
                                    onChange={e => handleChange('bio', e.target.value)}
                                    rows={3}
                                    maxLength={200}
                                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors resize-none`}
                                    placeholder="Tell people about yourself..."
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {form.bio.length}/200
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={e => handleChange('location', e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                    placeholder="City, Country"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={e => handleChange('website', e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </>
                    )}

                    {activeSection === 'socials' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    GitHub
                                </label>
                                <div className="relative">
                                    <Github size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.socials.github}
                                        onChange={e => handleSocialChange('github', e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                        placeholder="GitHub username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Twitter / X
                                </label>
                                <div className="relative">
                                    <Twitter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.socials.twitter}
                                        onChange={e => handleSocialChange('twitter', e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                        placeholder="@handle"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Personal Website
                                </label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.socials.website}
                                        onChange={e => handleSocialChange('website', e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg pl-11 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-${accentColor}-500 transition-colors`}
                                        placeholder="yoursite.com"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-6 py-2.5 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium flex items-center gap-2`}
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================== PROFILE PAGE =====================
export const ProfilePage: React.FC = () => {
    // --- ACCENT COLOR LOGIC ---
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

    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'bookmarks' | 'communities' | 'about'>('posts');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        name: 'Alexander Mitchell',
        username: 'alexmitchell',
        avatar: 'AM',
        bannerGradient: 'from-indigo-500 via-purple-500 to-pink-500',
        bio: 'Full-stack developer & open-source enthusiast. Building products that make a difference. Love sharing knowledge and helping others grow in tech.',
        location: 'San Francisco, CA',
        website: 'https://johnPax.dev',
        joinDate: 'January 2023',
        email: 'alex@example.com',
        isVerified: true,
        isOnline: true,
        stats: {
            posts: 234,
            followers: 12800,
            following: 485,
            reputation: 8750
        },
        socials: {
            github: 'JohnPax',
            twitter: '@jPax',
            website: 'johnpax.dev'
        }
    });

    const [badges] = useState<UserBadge[]>([
        { id: 1, name: 'Early Adopter', icon: '🚀', color: 'from-blue-500 to-cyan-500', description: 'Joined during beta' },
        { id: 2, name: 'Top Contributor', icon: '🏆', color: 'from-yellow-500 to-orange-500', description: 'Top 1% contributor' },
        { id: 3, name: 'Helpful', icon: '💡', color: 'from-green-500 to-emerald-500', description: '500+ helpful answers' },
        { id: 4, name: 'Streak Master', icon: '🔥', color: 'from-red-500 to-pink-500', description: '30-day activity streak' },
        { id: 5, name: 'Community Leader', icon: '👑', color: 'from-purple-500 to-indigo-500', description: 'Leads 3+ communities' },
    ]);

    const [posts, setPosts] = useState<UserPost[]>([
        {
            id: 1,
            title: 'Building a Real-Time Collaboration Tool with WebSockets',
            content: 'I recently built a real-time collaboration tool similar to Google Docs. Here\'s a deep dive into the architecture, challenges, and solutions I discovered along the way.',
            community: 'Tech Enthusiasts',
            communityColor: 'from-blue-500 to-cyan-600',
            date: '2 hours ago',
            stats: { likes: 342, replies: 89, views: 2340 },
            tags: ['WebSockets', 'React', 'Node.js'],
            isPinned: true
        },
        {
            id: 2,
            title: 'My VS Code Setup for Maximum Productivity in 2024',
            content: 'After years of tweaking my development environment, I\'ve found the perfect VS Code setup. Here are my must-have extensions, themes, and keyboard shortcuts.',
            community: 'Tech Enthusiasts',
            communityColor: 'from-blue-500 to-cyan-600',
            date: '1 day ago',
            stats: { likes: 567, replies: 123, views: 4560 },
            tags: ['VSCode', 'Productivity', 'Tools']
        },
        {
            id: 3,
            title: 'Why I Switched from REST to GraphQL (and When You Shouldn\'t)',
            content: 'GraphQL isn\'t always the answer. Here\'s my honest experience switching a production API from REST to GraphQL, including the gotchas nobody talks about.',
            community: 'Career Growth',
            communityColor: 'from-green-500 to-emerald-600',
            date: '3 days ago',
            stats: { likes: 891, replies: 234, views: 7890 },
            tags: ['GraphQL', 'REST', 'API Design']
        },
        {
            id: 4,
            title: 'The Art of Code Reviews: A Guide for Teams',
            content: 'Code reviews can make or break your team culture. Here are the practices that transformed our team\'s code review process from dreaded to delightful.',
            community: 'Startup Founders',
            communityColor: 'from-teal-500 to-cyan-600',
            date: '1 week ago',
            stats: { likes: 445, replies: 67, views: 3210 },
            tags: ['Code Review', 'Team Culture', 'Best Practices']
        }
    ]);

    const [userCommunities] = useState<UserCommunity[]>([
        { id: 1, name: 'Tech Enthusiasts', avatar: 'TE', banner: 'from-blue-500 to-cyan-600', members: 12450, role: 'admin' },
        { id: 2, name: 'Startup Founders', avatar: 'SF', banner: 'from-teal-500 to-cyan-600', members: 6780, role: 'owner' },
        { id: 3, name: 'Creative Studio', avatar: 'CS', banner: 'from-purple-500 to-pink-600', members: 8920, role: 'member' },
        { id: 4, name: 'Gaming Legends', avatar: 'GL', banner: 'from-indigo-500 to-purple-600', members: 23450, role: 'moderator' },
    ]);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'owner':
                return { label: 'Owner', icon: Crown, colorClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' };
            case 'admin':
                return { label: 'Admin', icon: Shield, colorClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
            case 'moderator':
                return { label: 'Mod', icon: Star, colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' };
            default:
                return { label: 'Member', icon: User, colorClass: 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400' };
        }
    };

    const deletePost = (id: number) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const togglePin = (id: number) => {
        setPosts(prev =>
            prev.map(p =>
                p.id === id ? { ...p, isPinned: !p.isPinned } : p
            )
        );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = () => setShowMoreMenu(false);
        if (showMoreMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [showMoreMenu]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto p-6">

                {/* ==================== PROFILE BANNER ==================== */}
                <div className="relative mb-20">
                    {/* Banner */}
                    <div className={`h-48 md:h-64 bg-gradient-to-r ${profile.bannerGradient} rounded-2xl relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)',
                                backgroundSize: '60px 60px'
                            }} />
                        </div>
                        <button className="absolute top-4 right-4 p-2.5 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-lg transition-colors text-white flex items-center gap-2 text-sm font-medium">
                            <Camera size={18} />
                            <span className="hidden sm:inline">Change Banner</span>
                        </button>
                    </div>

                    {/* Avatar + Actions */}
                    <div className="absolute -bottom-16 left-6 right-6 flex items-end justify-between">
                        {/* Avatar */}
                        <div className="relative">
                            <div className={`w-32 h-32 bg-gradient-to-r ${profile.bannerGradient} rounded-2xl flex items-center justify-center font-bold text-white text-4xl border-4 border-white dark:border-gray-900 shadow-xl`}>
                                {profile.avatar}
                            </div>
                            {profile.isOnline && (
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            )}
                            <button className="absolute bottom-0 right-0 p-1.5 bg-gray-900/70 backdrop-blur-sm hover:bg-gray-900/90 rounded-lg transition-colors text-white">
                                <Camera size={14} />
                            </button>
                        </div>

                        {/* Own-Profile Action Buttons */}
                        <div className="flex items-center gap-2 mb-1">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className={`px-5 py-2.5 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium flex items-center gap-2`}
                            >
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                            <a
                                href="/settings"
                                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all font-medium flex items-center gap-2"
                            >
                                <Settings size={18} />
                                <span className="hidden sm:inline">Settings</span>
                            </a>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMoreMenu(!showMoreMenu);
                                    }}
                                    className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                                {showMoreMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors">
                                            <Share2 size={16} /> Share Profile
                                        </button>
                                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors">
                                            <LinkIcon size={16} /> Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== USER INFO ==================== */}
                <div className="mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                                {profile.name}
                            </h1>
                            {profile.isVerified && (
                                <div className={`w-7 h-7 bg-${accentColor}-500 rounded-full flex items-center justify-center`} title="Verified">
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-3 transition-colors">
                            @{profile.username}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-base mb-4 max-w-2xl leading-relaxed transition-colors">
                            {profile.bio}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {profile.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.socials.website && (
                                <div className="flex items-center gap-1.5">
                                    <LinkIcon size={16} />
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-${accentColor}-600 dark:text-${accentColor}-400 hover:underline`}
                                    >
                                        {profile.socials.website}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} />
                                <span>Joined {profile.joinDate}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-3">
                            {profile.socials.github && (
                                <a href={`https://github.com/${profile.socials.github}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Github size={18} />
                                </a>
                            )}
                            {profile.socials.twitter && (
                                <a href={`https://twitter.com/${profile.socials.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {profile.socials.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Globe size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================== STATS BAR ==================== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/10 border border-${accentColor}-200 dark:border-${accentColor}-500/20 rounded-xl p-4 shadow-sm transition-colors`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-md shadow-${accentColor}-500/20`}>
                                <Edit3 size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Posts</p>
                                <p className="text-gray-900 dark:text-white text-xl font-bold">{profile.stats.posts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 shadow-sm transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Followers</p>
                                <p className="text-gray-900 dark:text-white text-xl font-bold">{formatNumber(profile.stats.followers)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 shadow-sm transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20">
                                <UserPlus size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Following</p>
                                <p className="text-gray-900 dark:text-white text-xl font-bold">{profile.stats.following}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 shadow-sm transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Reputation</p>
                                <p className="text-gray-900 dark:text-white text-xl font-bold">{formatNumber(profile.stats.reputation)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== BADGES ==================== */}
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5 mb-6 shadow-sm transition-colors">
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Award size={20} className={`text-${accentColor}-500`} />
                        Badges
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className="group relative flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                                title={badge.description}
                            >
                                <span className="text-xl">{badge.icon}</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                                    {badge.description}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ==================== CONTENT TABS ==================== */}
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 mb-6 shadow-sm transition-colors">
                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            { id: 'posts', label: 'Posts', icon: Edit3 },
                            { id: 'replies', label: 'Replies', icon: MessageSquare },
                            { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
                            { id: 'communities', label: 'Communities', icon: Users },
                            { id: 'about', label: 'About', icon: User }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/20`
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ==================== TAB CONTENT ==================== */}

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {posts.length === 0 && (
                            <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                                <Edit3 size={48} className="text-gray-400 mx-auto mb-4" />
                                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No posts yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Share your first thought with the community!
                                </p>
                                <button className={`px-6 py-3 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium`}>
                                    Create Post
                                </button>
                            </div>
                        )}

                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className={`bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 hover:border-${accentColor}-500/50 transition-all group shadow-sm hover:shadow-md`}
                            >
                                {/* Pinned */}
                                {post.isPinned && (
                                    <div className={`flex items-center gap-1.5 text-${accentColor}-600 dark:text-${accentColor}-400 text-xs font-medium mb-3`}>
                                        <Star size={14} className="fill-current" />
                                        Pinned Post
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 bg-gradient-to-r ${post.communityColor} rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md`}>
                                            {profile.avatar}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-900 dark:text-white font-medium">{profile.name}</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-500">{post.date}</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <Hash size={12} />
                                                {post.community}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Own-post actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => togglePin(post.id)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                post.isPinned
                                                    ? `text-${accentColor}-500 hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20`
                                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                            }`}
                                            title={post.isPinned ? 'Unpin post' : 'Pin post'}
                                        >
                                            <Star size={16} className={post.isPinned ? 'fill-current' : ''} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            title="Edit post"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                            title="Delete post"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className={`text-gray-900 dark:text-white font-bold text-lg mb-2 group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors cursor-pointer`}>
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                    {post.content}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Heart size={16} />
                                        <span>{post.stats.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        <span>{post.stats.replies}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} />
                                        <span>{post.stats.views}</span>
                                    </div>
                                    <div className="ml-auto">
                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Communities Tab */}
                {activeTab === 'communities' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userCommunities.map((community) => {
                            const role = getRoleBadge(community.role);
                            const RoleIcon = role.icon;
                            return (
                                <div
                                    key={community.id}
                                    className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className={`h-16 bg-gradient-to-r ${community.banner}`} />
                                    <div className="p-4">
                                        <div className="flex items-center gap-3 -mt-10 mb-3">
                                            <div className={`w-14 h-14 bg-gradient-to-r ${community.banner} rounded-xl flex items-center justify-center font-bold text-white text-lg border-3 border-white dark:border-gray-800 shadow-md`}>
                                                {community.avatar}
                                            </div>
                                            <div className="mt-6">
                                                <h4 className={`text-gray-900 dark:text-white font-bold group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors`}>
                                                    {community.name}
                                                </h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                                    <Users size={12} />
                                                    {formatNumber(community.members)} members
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${role.colorClass}`}>
                                                <RoleIcon size={12} />
                                                {role.label}
                                            </span>
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                                    <User size={20} className={`text-${accentColor}-500`} />
                                    About
                                </h3>
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                    title="Edit profile"
                                >
                                    <Edit3 size={16} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                {profile.bio}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <MapPin size={18} className="text-gray-400 dark:text-gray-500" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Globe size={18} className="text-gray-400 dark:text-gray-500" />
                                    <a href={profile.website} className={`text-${accentColor}-600 dark:text-${accentColor}-400 hover:underline`}>
                                        {profile.socials.website}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Calendar size={18} className="text-gray-400 dark:text-gray-500" />
                                    <span>Joined {profile.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm transition-colors">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className={`text-${accentColor}-500`} />
                                Activity Overview
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Posts this month', value: '23', icon: Edit3, color: 'text-blue-500' },
                                    { label: 'Replies this month', value: '87', icon: MessageSquare, color: 'text-green-500' },
                                    { label: 'Likes received', value: '1.2k', icon: Heart, color: 'text-red-500' },
                                    { label: 'Active streak', value: '14 days', icon: Zap, color: 'text-orange-500' },
                                    { label: 'Avg. response time', value: '~2h', icon: Clock, color: 'text-purple-500' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <item.icon size={16} className={item.color} />
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">{item.label}</span>
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Replies Tab */}
                {activeTab === 'replies' && (
                    <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                        <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No replies yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Your replies to other posts will show up here
                        </p>
                    </div>
                )}

                {/* Bookmarks Tab */}
                {activeTab === 'bookmarks' && (
                    <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                        <Bookmark size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No bookmarks yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Save posts you want to revisit later
                        </p>
                        <a
                            href="/bookmarks"
                            className={`inline-block px-6 py-3 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium`}
                        >
                            Browse Posts
                        </a>
                    </div>
                )}

                {/* ==================== EDIT PROFILE MODAL ==================== */}
                <EditProfileModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    profile={profile}
                    onSave={setProfile}
                    accentColor={accentColor}
                />
            </div>
        </div>
    );
};