import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Users, Eye, Loader2, Heart, X, Image as ImageIcon, Send } from 'lucide-react';
import { fetchAllPosts, createPost, Post } from '../postServise';
import { fetchUsersCount } from '../../groups/groupsService';
import { fetchMyGroups} from "../../groups/groupsService";

// --- Компонент Модального вікна для перегляду фото (LightBox) ---
interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    // Закриття по Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose} // Закриття при кліку на фон
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
                <X size={24} />
            </button>

            <img
                src={imageUrl}
                alt="Full size"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-zoomIn"
                onClick={(e) => e.stopPropagation()} // Запобігаємо закриттю при кліку на саме фото
            />
        </div>
    );
};
// ------------------------------------------------------------------

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

    // --- ЛОГІКА КІЛЬКОСТІ ЮЗЕРІВ ---
    const [membersCount, setMembersCount] = useState<number | string>("...");

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const count = await fetchUsersCount();
                setMembersCount(Number(count));
            } catch (err) {
                console.error("Не вдалося завантажити кількість юзерів", err);
                setMembersCount("?");
            }
        };

        loadMembers();
    }, []);

    // --- ЛОГІКА ПОСТІВ ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // --- ЛОГІКА СТВОРЕННЯ ПОСТА ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newPostText, setNewPostText] = useState("");
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Перевіряємо, чи юзер авторизований
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsLoggedIn(true);
            // Завантажуємо групи юзера для випадаючого списку
            fetchMyGroups().then(groups => {
                setMyGroups(groups);
                if (groups.length > 0) {
                    setSelectedGroupId(groups[0].id);
                }
            }).catch(console.error);
        }

        // Завантажуємо всі пости
        const loadPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAllPosts();
                setPosts(data.reverse()); // Новіші зверху
            } catch (err: any) {
                console.error("Помилка завантаження постів:", err);
                setError("Не вдалося завантажити останні обговорення.");
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, []);

    // Обробник відправки нового поста
    const handleCreatePost = async () => {
        if (!newPostText.trim()) return alert("Пост не може бути порожнім!");
        if (!selectedGroupId) return alert("Оберіть спільноту для публікації!");

        setIsSubmitting(true);
        try {
            const newPost = await createPost({
                text: newPostText,
                groupId: Number(selectedGroupId)
            });

            // Додаємо новий пост в самий верх стрічки
            setPosts([newPost, ...posts]);

            // Очищаємо форму і згортаємо її
            setNewPostText("");
            setIsCreating(false);
        } catch (err) {
            console.error(err);
            alert("Помилка при створенні поста. Можливо, сервер відхилив запит.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Функція для рендеру галереї зображень у пості
    const renderPostImages = (images: string[] | undefined) => {
        if (!images || images.length === 0) return null;

        const count = images.length;
        const gridClass = count === 1
            ? "grid-cols-1"
            : count === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3";

        return (
            <div className={`grid ${gridClass} gap-2 mb-4 rounded-xl overflow-hidden`}>
                {images.map((imgUrl, index) => (
                    <div
                        key={index}
                        className="relative aspect-video group overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(imgUrl);
                        }}
                    >
                        <img
                            src={imgUrl}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="text-white" size={24} />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
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
                <div className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/10 border border-${accentColor}-200 dark:border-${accentColor}-500/20 rounded-xl p-6 transition-colors`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${accentColor}-500/30`}>
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Discussions</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">{posts.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Members</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">
                                {membersCount}
                            </p>
                        </div>
                    </div>
                </div>

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

            {/* БЛОК СТВОРЕННЯ ПОСТА (Видимий лише для авторизованих) */}
            {isLoggedIn && (
                <div className={`bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-xl mb-8 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${isCreating ? `ring-2 ring-${accentColor}-500/50` : ''}`}>

                    {!isCreating ? (
                        // Згорнутий стан
                        <div
                            onClick={() => setIsCreating(true)}
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/30 flex items-center justify-center font-bold text-${accentColor}-600`}>
                                Me
                            </div>
                            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 text-sm">
                                Create a new post...
                            </div>
                            <div className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <ImageIcon size={20} />
                            </div>
                        </div>
                    ) : (
                        // Розгорнутий стан
                        <div className="p-4 animate-fadeIn">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/30 flex items-center justify-center font-bold text-${accentColor}-600 shrink-0`}>
                                    Me
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        autoFocus
                                        value={newPostText}
                                        onChange={(e) => setNewPostText(e.target.value)}
                                        placeholder="What's on your mind?"
                                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-gray-900 dark:text-white text-lg resize-none min-h-[100px] p-0"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedGroupId}
                                        onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                                        className={`bg-gray-100 dark:bg-gray-800 border-none outline-none text-sm rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-${accentColor}-500 py-2 px-3`}
                                    >
                                        <option value="" disabled>Select Community</option>
                                        {myGroups.map(group => (
                                            <option key={group.id} value={group.id}>{group.name}</option>
                                        ))}
                                    </select>

                                    <button className={`p-2 text-gray-400 hover:text-${accentColor}-500 hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20 rounded-lg transition-colors`} title="Attach Image">
                                        <ImageIcon size={20} />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setIsCreating(false); setNewPostText(""); }}
                                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={isSubmitting || !newPostText.trim() || !selectedGroupId}
                                        className={`px-5 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Discussions */}
            <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-xl p-6 shadow-sm transition-colors">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className={`text-${accentColor}-500`} size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Recent Discussions</h2>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className={`animate-spin text-${accentColor}-500`} size={32} />
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No discussions yet. Be the first to post!</p>
                    </div>
                )}

                {/* Список постів */}
                <div className="space-y-6">
                    {!isLoading && !error && posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group shadow-sm"
                            onClick={() => console.log("Відкрити пост", post.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className={`inline-block text-xs font-medium bg-${accentColor}-100 dark:bg-${accentColor}-600/20 text-${accentColor}-700 dark:text-${accentColor}-300 px-2.5 py-1 rounded-full mb-2 transition-colors`}>
                                        {post.groupName || `Group ID: ${post.groupId}`}
                                    </span>
                                    <h3 className={`text-gray-900 dark:text-white font-semibold text-lg group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors line-clamp-2 leading-snug`}>
                                        {post.text || "Без тексту"}
                                    </h3>
                                </div>
                            </div>

                            {/* ГАЛЕРЕЯ ЗОБРАЖЕНЬ (КЛІКАБЕЛЬНА) */}
                            {renderPostImages(post.images)}

                            <div className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 uppercase text-xs border border-gray-300 dark:border-gray-600">
                                        {post.authorUsername ? post.authorUsername[0] : '?'}
                                    </div>
                                    <span>by <span className="font-medium text-gray-700 dark:text-gray-200">{post.authorUsername || `User ID: ${post.authorId}`}</span></span>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors" title="Likes">
                                        <Heart size={16} />
                                        <span className="font-medium">{post.likes || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5" title="Views">
                                        <Eye size={16} />
                                        <span className="font-medium">{post.views || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Модальне вікно для перегляду фото (LightBox) */}
            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};