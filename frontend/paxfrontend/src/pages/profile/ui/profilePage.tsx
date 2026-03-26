import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    User, Mail, MapPin, Calendar, Link as LinkIcon, Edit3, Settings,
    Camera, Heart, MessageSquare, Eye, Bookmark, Users, Award, TrendingUp,
    Globe, Hash, Loader2, Trash2, AlertTriangle, X
} from 'lucide-react';


import { fetchUserById } from '../userService';
import { fetchAllPosts, deletePost, updatePost, likePost, unlikePost, Post } from '../../main/postServise';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}
const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <X size={24} />
            </button>
            <img src={imageUrl} alt="Full size" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-zoomIn" onClick={(e) => e.stopPropagation()} />
        </div>
    );
};
// ============================================================================

export const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // --- ЛОГІКА КОЛЬОРІВ ---
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('site_accent_color') || 'purple');

    useEffect(() => {
        const handleStorageChange = () => setAccentColor(localStorage.getItem('site_accent_color') || 'purple');
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('accent-color-change', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('accent-color-change', handleStorageChange);
        };
    }, []);

    // --- СТЕЙТИ ---
    const [profile, setProfile] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'bookmarks'>('posts');
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserIdState, setCurrentUserIdState] = useState<string | null>(null);

    // Стейт для модалки фото та видалення поста
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    // --- СТЕЙТИ ДЛЯ РОЗШИРЕННЯ ТА РЕДАГУВАННЯ ПОСТА ---
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editPostText, setEditPostText] = useState("");
    const [isUpdatingPost, setIsUpdatingPost] = useState(false);

    // --- СТЕЙТ ДЛЯ ЛАЙКІВ ---
    const [likedPosts, setLikedPosts] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('pax_liked_posts');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        localStorage.setItem('pax_liked_posts', JSON.stringify(Array.from(likedPosts)));
    }, [likedPosts]);

    // ЗАВАНТАЖЕННЯ ДАНИХ
    useEffect(() => {
        const loadProfileAndPosts = async () => {
            setIsLoading(true);
            try {
                let currentUserId = null;
                const token = localStorage.getItem("access_token");

                if (token && token !== "undefined") {
                    setIsLoggedIn(true);
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        currentUserId = payload.sub;
                        setCurrentUserIdState(currentUserId);
                    } catch (e) { console.error("Помилка парсингу токена", e); }
                } else {
                    setIsLoggedIn(false);
                }

                // Визначаємо цільового юзера
                const targetUserId = id || currentUserId;

                if (!targetUserId) {
                    window.location.href = "/login";
                    return;
                }

                setIsOwnProfile(targetUserId === currentUserId);

                // Завантажуємо профіль
                const data = await fetchUserById(targetUserId as string);

                // Завантажуємо всі пости і фільтруємо пости тільки цього юзера
                try {
                    const allPosts = await fetchAllPosts();
                    const filteredPosts = allPosts.filter((p: Post) => p.authorId === (targetUserId as string));
                    setUserPosts(filteredPosts.reverse());
                } catch (postErr) {
                    console.error("Не вдалося завантажити пости юзера:", postErr);
                }

                setProfile({
                    name: data.username,
                    username: `@${data.username.toLowerCase()}`,
                    email: data.email,
                    joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
                    isOnline: data.status === "ONLINE",
                    bio: data.bio || "Hello! I am using PAX.",
                    location: data.location || "",
                    website: data.website || "",
                    avatar: "",
                    bannerGradient: `from-${accentColor}-500 to-indigo-600`,
                    isVerified: true,
                    stats: { posts: 0, followers: 0, following: 0, reputation: 10 },
                    socials: { github: "", twitter: "", website: "" }
                });
            } catch (err) {
                console.error("Помилка завантаження профілю:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileAndPosts();
    }, [id, accentColor]);

    // ============================================================================
    // ОБРОБНИКИ ДІЙ ДЛЯ ПОСТІВ
    // ============================================================================

    // ЛАЙК / АНЛАЙК
    const handleLike = async (postId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoggedIn) return alert("Будь ласка, авторизуйтеся, щоб ставити лайки!");

        const isLiked = likedPosts.has(postId);
        try {
            let updatedPost;
            if (isLiked) {
                updatedPost = await unlikePost(postId);
                setLikedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(postId);
                    return newSet;
                });
            } else {
                updatedPost = await likePost(postId);
                setLikedPosts(prev => new Set(prev).add(postId));
            }
            setUserPosts(userPosts.map(p => p.id === postId ? updatedPost : p));
        } catch (err) {
            console.error("Помилка роботи з лайком", err);
        }
    };

    // ПОЧАТОК РЕДАГУВАННЯ
    const handleStartEdit = (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPostId(post.id);
        setEditPostText(post.text);
    };

    // ЗБЕРЕЖЕННЯ РЕДАГОВАНОГО ПОСТА
    const handleSaveEdit = async (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!editPostText.trim()) return;
        setIsUpdatingPost(true);
        try {
            const updatedPost = await updatePost(post.id, {
                id: post.id,
                text: editPostText,
                groupId: post.groupId || 1
            });
            setUserPosts(userPosts.map(p => p.id === post.id ? updatedPost : p));
            setEditingPostId(null);
        } catch (err) {
            console.error(err);
            alert("Помилка збереження! Відкрий консоль (F12), щоб побачити точну причину від бекенду.");
        } finally {
            setIsUpdatingPost(false);
        }
    };

    // ВИДАЛЕННЯ ПОСТА
    const confirmDeletePost = async () => {
        if (postToDeleteId === null) return;
        setIsDeletingPost(true);
        try {
            await deletePost(postToDeleteId);
            setUserPosts(userPosts.filter(p => p.id !== postToDeleteId));
            setPostToDeleteId(null);
            if (expandedPostId === postToDeleteId) setExpandedPostId(null);
        } catch (err) {
            alert("Помилка при видаленні поста.");
        } finally {
            setIsDeletingPost(false);
        }
    };

    const renderPostImages = (images: string[] | undefined) => {
        if (!images || images.length === 0) return null;
        const count = images.length;
        const gridClass = count === 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3";

        return (
            <div className={`grid ${gridClass} gap-2 mb-4 rounded-xl overflow-hidden`}>
                {images.map((imgUrl, index) => (
                    <div key={index} className="relative aspect-video group overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedImage(imgUrl); }}>
                        <img src={imgUrl} alt={`Post image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Eye className="text-white" size={24} /></div>
                    </div>
                ))}
            </div>
        );
    };

    // РЕНДЕР ЗАВАНТАЖЕННЯ
    if (isLoading || !profile) {
        return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className={`animate-spin text-${accentColor}-600`} size={48} /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-fadeIn">
            {/* Банер та Аватарка */}
            <div className={`h-64 md:h-80 w-full rounded-3xl bg-gradient-to-r ${profile.bannerGradient} relative shadow-xl mb-24`}>
                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
                    <div className="relative group cursor-pointer">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden flex items-center justify-center text-${accentColor}-600 text-5xl font-black`}>
                            {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : profile.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-14 right-4 md:right-8 flex gap-3">
                    {isOwnProfile ? (
                        <>
                            <button onClick={() => setIsEditOpen(true)} className={`px-5 py-2.5 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-${accentColor}-500/30 flex items-center gap-2`}>
                                <Edit3 size={18} /> <span className="hidden sm:block">Edit Profile</span>
                            </button>
                            <Link to="/settings" className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all flex items-center shadow-md">
                                <Settings size={20} />
                            </Link>
                        </>
                    ) : (
                        <button className={`px-5 py-2.5 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2`}>
                            <Users size={18} /> Follow
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-8">
                {/* ЛІВА КОЛОНКА */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{profile.name}</h1>
                            {profile.isVerified && <div className={`w-6 h-6 bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 rounded-full flex items-center justify-center`}><Award size={14} /></div>}
                        </div>
                        <p className="text-gray-500 font-medium mb-4">{profile.username}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className={`px-3 py-1 bg-${accentColor}-50 dark:bg-${accentColor}-900/10 text-${accentColor}-600 border border-${accentColor}-200 dark:border-${accentColor}-800 rounded-full text-xs font-bold uppercase tracking-wider`}>Member</span>
                            {profile.isOnline && (
                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 border border-green-200 dark:border-green-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                                </span>
                            )}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{profile.bio}</p>

                        <div className="space-y-4 text-sm">
                            {profile.location && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><MapPin size={18} className="text-gray-400" /><span>{profile.location}</span></div>}
                            {/* Пошту показуємо ТІЛЬКИ власнику профілю з міркувань приватності */}
                            {isOwnProfile && profile.email && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><Mail size={18} className="text-gray-400" /><span>{profile.email}</span></div>}
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><Calendar size={18} className="text-gray-400" /><span>Joined {profile.joinDate}</span></div>
                            {profile.website && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><LinkIcon size={18} className={`text-${accentColor}-500`} /><a href={profile.website} target="_blank" rel="noopener noreferrer" className={`hover:text-${accentColor}-600 font-medium transition-colors`}>{profile.website.replace(/^https?:\/\//, '')}</a></div>}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className={`text-${accentColor}-500`} /> Community Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center">
                                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Posts</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">{userPosts.length}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center">
                                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Reputation</p>
                                <p className={`text-2xl font-black text-${accentColor}-600`}>{profile.stats.reputation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ПРАВА КОЛОНКА (ВКЛАДКИ) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'posts' ? `border-b-2 border-${accentColor}-600 text-${accentColor}-600` : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            <MessageSquare size={18} /> {isOwnProfile ? 'My Posts' : 'Posts'}
                        </button>
                        <button onClick={() => setActiveTab('replies')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'replies' ? `border-b-2 border-${accentColor}-600 text-${accentColor}-600` : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            <Users size={18} /> Replies
                        </button>
                        <button onClick={() => setActiveTab('bookmarks')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'bookmarks' ? `border-b-2 border-${accentColor}-600 text-${accentColor}-600` : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            <Bookmark size={18} /> Bookmarks
                        </button>
                    </div>

                    <div className="min-h-[300px]">
                        {/* ВКЛАДКА ПОСТІВ */}
                        {activeTab === 'posts' && (
                            <div className="space-y-6">
                                {userPosts.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                                        <MessageSquare size={48} className="text-gray-400 mx-auto mb-4 opacity-50" />
                                        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No posts yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">{isOwnProfile ? "You haven't created any discussions yet." : "This user hasn't posted anything yet."}</p>
                                        {isOwnProfile && <Link to="/" className={`inline-block px-6 py-3 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium`}>Create a Post</Link>}
                                    </div>
                                ) : (
                                    userPosts.map(post => {
                                        const isExpanded = expandedPostId === post.id;
                                        const isEditing = editingPostId === post.id;
                                        const isLiked = likedPosts.has(post.id);

                                        return (
                                            <div
                                                key={post.id}
                                                className={`bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group relative shadow-sm ${
                                                    isExpanded ? `ring-1 ring-${accentColor}-500/50 bg-gray-50 dark:bg-gray-800/60` : ''
                                                }`}
                                                onClick={() => !isEditing && setExpandedPostId(isExpanded ? null : post.id)}
                                            >
                                                <div className="flex items-start justify-between mb-3 pr-8">
                                                    <div className="w-full">
                                                        <span className={`inline-block text-xs font-medium bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-700 dark:text-${accentColor}-400 px-2.5 py-1 rounded-full mb-2`}>
                                                            {post.groupName || `Group ID: ${post.groupId}`}
                                                        </span>

                                                        {isEditing ? (
                                                            <div onClick={e => e.stopPropagation()} className="mt-2 w-full animate-fadeIn">
                                                                <textarea
                                                                    value={editPostText}
                                                                    onChange={(e) => setEditPostText(e.target.value)}
                                                                    className={`w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-${accentColor}-500 outline-none resize-none min-h-[100px]`}
                                                                />
                                                                <div className="flex justify-end gap-2 mt-3">
                                                                    <button onClick={() => setEditingPostId(null)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                                                                    <button onClick={(e) => handleSaveEdit(post, e)} disabled={isUpdatingPost} className={`px-4 py-2 text-sm bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700 transition-colors disabled:opacity-50`}>
                                                                        {isUpdatingPost ? "Saving..." : "Save"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <h3 className={`text-gray-900 dark:text-white font-semibold text-lg group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors leading-snug ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                                {post.text || "Без тексту"}
                                                            </h3>
                                                        )}
                                                    </div>
                                                </div>

                                                {renderPostImages(post.images)}

                                                <div className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 uppercase text-xs border border-gray-300 dark:border-gray-600">
                                                            {post.authorUsername ? post.authorUsername[0] : '?'}
                                                        </div>
                                                        <span>by <span className="font-medium text-gray-700 dark:text-gray-200">{post.authorUsername || `User ID: ${post.authorId}`}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`} title="Likes">
                                                            <Heart size={16} className={isLiked ? "fill-current" : ""} />
                                                            <span className="font-medium">{post.likes || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5" title="Views"><Eye size={16} /><span className="font-medium">{post.views || 0}</span></div>
                                                    </div>
                                                </div>

                                                {/* ПАНЕЛЬ ДІЙ (АКОРДЕОН) */}
                                                {isExpanded && !isEditing && (
                                                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/50 animate-fadeIn" onClick={e => e.stopPropagation()}>
                                                        <div className="flex flex-wrap items-center justify-between gap-4">

                                                            <div className="flex items-center gap-2">
                                                                <button onClick={(e) => handleLike(post.id, e)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${isLiked ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 dark:bg-gray-800/50 dark:hover:bg-red-900/20 dark:text-gray-300 dark:hover:text-red-400'}`}>
                                                                    <Heart size={18} className={isLiked ? "fill-current" : ""} />
                                                                    <span className="text-sm font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                                                                </button>

                                                                <button onClick={() => alert("Коментарі скоро будуть доступні!")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-500 dark:bg-gray-800/50 dark:hover:bg-blue-900/20 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                                                    <MessageSquare size={18} /> <span className="text-sm font-medium">Comment</span>
                                                                </button>

                                                                <button onClick={() => alert("Пост додано у збережені (заглушка)!")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-500 dark:bg-gray-800/50 dark:hover:bg-green-900/20 dark:text-gray-300 dark:hover:text-green-400 transition-colors">
                                                                    <Bookmark size={18} /> <span className="text-sm font-medium hidden sm:block">Save</span>
                                                                </button>
                                                            </div>

                                                            {isOwnProfile && (
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={(e) => handleStartEdit(post, e)} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors" title="Edit Post">
                                                                        <Edit3 size={18} />
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); setPostToDeleteId(post.id); }} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors" title="Delete Post">
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {activeTab === 'replies' && (
                            <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                                <Users size={48} className="text-gray-400 mx-auto mb-4 opacity-50" />
                                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No replies yet</h3>
                                <p className="text-gray-500 dark:text-gray-400">No conversations to show right now.</p>
                            </div>
                        )}

                        {activeTab === 'bookmarks' && (
                            <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center shadow-sm">
                                <Bookmark size={48} className="text-gray-400 mx-auto mb-4 opacity-50" />
                                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">No bookmarks yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">{isOwnProfile ? "Save posts you want to revisit later." : "Bookmarks are private."}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Модалки */}
            {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}

            {postToDeleteId !== null && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setPostToDeleteId(null)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-zoomIn relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setPostToDeleteId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={24} /></button>
                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={32} /></div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Post?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Are you sure you want to delete this post? This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setPostToDeleteId(null)} className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium">Cancel</button>
                                <button onClick={confirmDeletePost} disabled={isDeletingPost} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg flex justify-center items-center gap-2 disabled:opacity-50">
                                    {isDeletingPost ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Profile</h2>
                        <p className="text-gray-500 mb-6">You can update your profile from the Settings page.</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl font-bold dark:text-white transition-colors">Close</button>
                            <Link to="/settings" className={`flex-1 py-3 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-xl font-bold text-center transition-colors`}>Go to Settings</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};