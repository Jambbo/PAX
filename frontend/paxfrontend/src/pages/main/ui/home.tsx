import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    TrendingUp,
    MessageSquare,
    Users,
    Eye,
    Loader2,
    Heart,
    X,
    Image as ImageIcon,
    Send,
    Trash2,
    AlertTriangle,
    Edit3,
    Bookmark
} from 'lucide-react';

// ІМПОРТИ СЕРВІСІВ (Переконайся, що шляхи правильні)
import {fetchAllPosts, createPost, deletePost, likePost, updatePost, unlikePost, Post} from '../postServise';
import {fetchUsersCount, Group, fetchMyGroups} from '../../groups/groupsService';

// ============================================================================
// КОМПОНЕНТ МОДАЛЬНОГО ВІКНА ДЛЯ ПЕРЕГЛЯДУ ФОТОГРАФІЙ (LIGHTBOX)
// ============================================================================
interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({imageUrl, onClose}) => {
    // Закриття вікна по кнопці Escape
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
                <X size={24}/>
            </button>

            <img
                src={imageUrl}
                alt="Full size"
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-zoomIn"
                onClick={(e) => e.stopPropagation()} // Щоб клік по самому фото не закривав його
            />
        </div>
    );
};

// ============================================================================
// ГОЛОВНИЙ КОМПОНЕНТ HOME
// ============================================================================
export const Home: React.FC = () => {
    // --- 1. СТЕЙТИ ТА ЛОГІКА КОЛЬОРІВ ---
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

    // --- 2. СТЕЙТИ ДЛЯ СТАТИСТИКИ (КІЛЬКІСТЬ ЮЗЕРІВ) ---
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

    // --- 3. ГОЛОВНІ СТЕЙТИ ДЛЯ ПОСТІВ ТА UI ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // --- 4. СТЕЙТИ АВТОРИЗАЦІЇ ТА СТВОРЕННЯ ПОСТА ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newPostText, setNewPostText] = useState("");
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- 5. СТЕЙТИ ДЛЯ ВИДАЛЕННЯ ПОСТА ---
    const [postToDeleteId, setPostToDeleteId] = useState<number | null>(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    // --- 6. СТЕЙТИ ДЛЯ РОЗШИРЕННЯ (АКОРДЕОН) ТА РЕДАГУВАННЯ ---
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editPostText, setEditPostText] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // --- 7. СТЕЙТ ДЛЯ ЛАЙКІВ (ЗБЕРЕЖЕННЯ В LOCALSTORAGE) ---
    const [likedPosts, setLikedPosts] = useState<Set<number>>(() => {
        const saved = localStorage.getItem('pax_liked_posts');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        // Оновлюємо localStorage щоразу, коли змінюється набір лайків
        localStorage.setItem('pax_liked_posts', JSON.stringify(Array.from(likedPosts)));
    }, [likedPosts]);

    // --- 8. ЗАВАНТАЖЕННЯ ДАНИХ ПРИ СТАРТІ ---
    useEffect(() => {
        // Перевіряємо, чи юзер авторизований
        const token = localStorage.getItem("access_token");
        if (token && token !== "undefined") {
            setIsLoggedIn(true);
            try {
                // Дістаємо ID поточного юзера з токена
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.sub);
            } catch (e) {
                console.error("Помилка парсингу токена", e);
            }

            // Завантажуємо групи юзера для випадаючого списку при створенні поста
            fetchMyGroups().then(groups => {
                setMyGroups(groups);
                if (groups.length > 0) {
                    setSelectedGroupId(groups[0].id);
                }
            }).catch(console.error);
        } else {
            setIsLoggedIn(false);
            setCurrentUserId(null);
        }

        // Завантажуємо всі пости з бекенду
        const loadPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAllPosts();
                setPosts([...data].reverse()); // Нові пости зверху
            } catch (err: any) {
                console.error("Помилка завантаження постів:", err);
                setError("Не вдалося завантажити останні обговорення.");
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, []);

    // ============================================================================
    // ОБРОБНИКИ ДІЙ (HANDLERS)
    // ============================================================================

    // СТВОРЕННЯ ПОСТА
    const handleCreatePost = async () => {
        if (!newPostText.trim()) return alert("Пост не може бути порожнім!");
        if (!selectedGroupId) return alert("Оберіть спільноту для публікації!");

        setIsSubmitting(true);
        try {
            const createdPost = await createPost({
                text: newPostText,
                groupId: Number(selectedGroupId)
            });

            // Find group name locally
            const group = myGroups.find(g => g.id === Number(selectedGroupId));

            const newPost = {
                ...createdPost,
                groupName: group?.name || "" // ensure it's always defined
            };

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

    // ЛАЙК ТА ЗНЯТТЯ ЛАЙКУ (UNLIKE)
    const handleLike = async (postId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Важливо: зупиняємо клік, щоб пост не згортався/розгортався

        if (!isLoggedIn) return alert("Будь ласка, авторизуйтеся, щоб ставити лайки!");

        const isLiked = likedPosts.has(postId);

        try {
            let updatedPost;
            if (isLiked) {
                // Якщо вже лайкнуто -> забираємо лайк
                updatedPost = await unlikePost(postId);
                setLikedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(postId);
                    return newSet;
                });
            } else {
                // Якщо ще не лайкнуто -> ставимо лайк
                updatedPost = await likePost(postId);
                setLikedPosts(prev => new Set(prev).add(postId));
            }

            // Оновлюємо конкретний пост у загальній стрічці
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        } catch (err) {
            console.error("Помилка роботи з лайком", err);
        }
    };

    // ПОЧАТОК РЕДАГУВАННЯ ПОСТА
    const handleStartEdit = (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPostId(post.id);
        setEditPostText(post.text);
    };

    // ЗБЕРЕЖЕННЯ РЕДАГОВАНОГО ПОСТА
    const handleSaveEdit = async (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!editPostText.trim()) return;

        setIsUpdating(true);
        try {
            const updatedPost = await updatePost(post.id, {
                id: post.id,           // ВАЖЛИВО: Передаємо ID поста всередину тіла
                text: editPostText,
                groupId: post.groupId  // Відправляємо оригінальний groupId без "|| 1"
            });

            setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
            setEditingPostId(null); // Виходимо з режиму редагування
        } catch (err) {
            console.error(err);
            alert("Помилка збереження! Відкрий консоль (F12), щоб побачити точну причину від бекенду.");
        } finally {
            setIsUpdating(false);
        }
    };

    // ВИДАЛЕННЯ ПОСТА (Після підтвердження у модалці)
    const confirmDeletePost = async () => {
        if (postToDeleteId === null) return;
        setIsDeletingPost(true);
        try {
            await deletePost(postToDeleteId);
            setPosts(posts.filter(p => p.id !== postToDeleteId));
            setPostToDeleteId(null);

            // Якщо видалений пост був розгорнутий - згортаємо його
            if (expandedPostId === postToDeleteId) {
                setExpandedPostId(null);
            }
        } catch (err) {
            alert("Помилка при видаленні поста. Можливо, у вас немає прав.");
        } finally {
            setIsDeletingPost(false);
        }
    };

    // ============================================================================
    // ФУНКЦІЯ ДЛЯ РЕНДЕРУ ЗОБРАЖЕНЬ У ПОСТІ
    // ============================================================================
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
                        <div
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="text-white" size={24}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ============================================================================
    // РЕНДЕР ГОЛОВНОЇ СТОРІНКИ
    // ============================================================================
    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* --- ВІТАЛЬНА СЕКЦІЯ --- */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    Welcome to <span className={`text-${accentColor}-600`}>PAX</span> Community
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">
                    Connect, share, and engage with thousands of members worldwide
                </p>
            </div>

            {/* --- КАРТКИ СТАТИСТИКИ --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/10 border border-${accentColor}-200 dark:border-${accentColor}-500/20 rounded-xl p-6 transition-colors`}>
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 bg-${accentColor}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${accentColor}-500/30`}>
                            <MessageSquare size={24} className="text-white"/>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Discussions</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">{posts.length}</p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Users size={24} className="text-white"/>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Members</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">
                                {membersCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-xl p-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                            <TrendingUp size={24} className="text-white"/>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Online Now</p>
                            <p className="text-gray-900 dark:text-white text-2xl font-bold">1,423</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- БЛОК СТВОРЕННЯ ПОСТА (Тільки для авторизованих) --- */}
            {isLoggedIn && (
                <div
                    className={`bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-xl mb-8 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${isCreating ? `ring-2 ring-${accentColor}-500/50` : ''}`}>
                    {!isCreating ? (
                        <div
                            onClick={() => setIsCreating(true)}
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div
                                className={`w-10 h-10 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/30 flex items-center justify-center font-bold text-${accentColor}-600`}>
                                Me
                            </div>
                            <div
                                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 text-sm">
                                Create a new post...
                            </div>
                            <div className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <ImageIcon size={20}/>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 animate-fadeIn">
                            <div className="flex gap-4">
                                <div
                                    className={`w-10 h-10 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/30 flex items-center justify-center font-bold text-${accentColor}-600 shrink-0`}>
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

                            <div
                                className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
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

                                    <button
                                        className={`p-2 text-gray-400 hover:text-${accentColor}-500 hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20 rounded-lg transition-colors`}
                                        title="Attach Image">
                                        <ImageIcon size={20}/>
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewPostText("");
                                        }}
                                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={isSubmitting || !newPostText.trim() || !selectedGroupId}
                                        className={`px-5 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin"/> :
                                            <Send size={18}/>}
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- СТРІЧКА ПОСТІВ --- */}
            <div
                className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-xl p-6 shadow-sm transition-colors">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className={`text-${accentColor}-500`} size={24}/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Recent
                        Discussions</h2>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className={`animate-spin text-${accentColor}-500`} size={32}/>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>No discussions yet. Be the first to post!</p>
                    </div>
                )}

                {/* --- СПИСОК ПОСТІВ --- */}
                <div className="space-y-6">
                    {!isLoading && !error && posts.map((post) => {
                        const isExpanded = expandedPostId === post.id;
                        const isEditing = editingPostId === post.id;
                        const isLiked = likedPosts.has(post.id); // Перевіряємо чи пост лайкнутий

                        return (
                            <div
                                key={post.id}
                                className={`bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group shadow-sm ${
                                    isExpanded ? `ring-1 ring-${accentColor}-500/50 bg-white dark:bg-gray-800/40` : ''
                                }`}
                                onClick={() => !isEditing && setExpandedPostId(isExpanded ? null : post.id)} // Акордеон (відкрити/закрити)
                            >
                                {/* ЗАГОЛОВОК / ТЕКСТ / ПОЛЕ РЕДАГУВАННЯ */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-full">
                                        <span
                                            className={`inline-block text-xs font-medium bg-${accentColor}-100 dark:bg-${accentColor}-600/20 text-${accentColor}-700 dark:text-${accentColor}-300 px-2.5 py-1 rounded-full mb-2 transition-colors`}>
                                            {post.groupName }
                                        </span>

                                        {isEditing ? (
                                            <div onClick={e => e.stopPropagation()}
                                                 className="mt-2 w-full animate-fadeIn">
                                                <textarea
                                                    value={editPostText}
                                                    onChange={(e) => setEditPostText(e.target.value)}
                                                    className={`w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-${accentColor}-500 outline-none resize-none min-h-[100px]`}
                                                />
                                                <div className="flex justify-end gap-2 mt-3">
                                                    <button
                                                        onClick={() => setEditingPostId(null)}
                                                        className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleSaveEdit(post, e)}
                                                        disabled={isUpdating}
                                                        className={`px-4 py-2 text-sm bg-${accentColor}-600 text-white rounded-lg hover:bg-${accentColor}-700 transition-colors disabled:opacity-50`}
                                                    >
                                                        {isUpdating ? "Saving..." : "Save"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <h3 className={`text-gray-900 dark:text-white font-semibold text-lg transition-colors leading-snug ${isExpanded ? '' : 'line-clamp-2'} group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400`}>
                                                {post.text || "Без тексту"}
                                            </h3>
                                        )}
                                    </div>
                                </div>

                                {/* ГАЛЕРЕЯ ЗОБРАЖЕНЬ ПОСТА */}
                                {renderPostImages(post.images)}

                                {/* НИЖНЯ ПАНЕЛЬ: АВТОР, ЛАЙКИ, ПЕРЕГЛЯДИ */}
                                <div
                                    className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2">
                                        <Link to={`/profile/${post.authorId}`} onClick={(e) => e.stopPropagation()}
                                              className="shrink-0">
                                            <div
                                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 uppercase text-xs border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform">
                                                {post.authorUsername ? post.authorUsername[0] : '?'}
                                            </div>
                                        </Link>
                                        <span>by <Link to={`/profile/${post.authorId}`}
                                                       onClick={(e) => e.stopPropagation()}
                                                       className={`font-medium text-gray-700 dark:text-gray-200 hover:text-${accentColor}-600 transition-colors`}>
                                            {post.authorUsername || `User ID: ${post.authorId}`}
                                        </Link></span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                                            title="Likes">
                                            <Heart size={16} className={isLiked ? "fill-current" : ""}/>
                                            <span className="font-medium">{post.likes || 0}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5" title="Views">
                                            <Eye size={16}/>
                                            <span className="font-medium">{post.views || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* =========================================================
                                    ДОДАТКОВА ПАНЕЛЬ ДІЙ (АКОРДЕОН)
                                    Видно тільки коли пост розгорнуто і не редагується
                                    ========================================================= */}
                                {isExpanded && !isEditing && (
                                    <div
                                        className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/50 animate-fadeIn"
                                        onClick={e => e.stopPropagation()}>
                                        <div className="flex flex-wrap items-center justify-between gap-4">

                                            {/* ЛІВА ЧАСТИНА: Лайк, Комент, Зберегти */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleLike(post.id, e)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                                                        isLiked
                                                            ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
                                                            : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 dark:bg-gray-800/50 dark:hover:bg-red-900/20 dark:text-gray-300 dark:hover:text-red-400'
                                                    }`}
                                                >
                                                    <Heart size={18} className={isLiked ? "fill-current" : ""}/>
                                                    <span
                                                        className="text-sm font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                                                </button>

                                                <button
                                                    onClick={() => alert("Коментарі скоро будуть доступні!")}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-500 dark:bg-gray-800/50 dark:hover:bg-blue-900/20 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <MessageSquare size={18}/>
                                                    <span className="text-sm font-medium">Comment</span>
                                                </button>

                                                <button
                                                    onClick={() => alert("Пост додано у збережені (заглушка)!")}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-500 dark:bg-gray-800/50 dark:hover:bg-green-900/20 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                                                >
                                                    <Bookmark size={18}/>
                                                    <span className="text-sm font-medium hidden sm:block">Save</span>
                                                </button>
                                            </div>

                                            {/* ПРАВА ЧАСТИНА: Редагувати і Видалити (Тільки для автора) */}
                                            {post.authorId === currentUserId && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => handleStartEdit(post, e)}
                                                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
                                                        title="Edit Post"
                                                    >
                                                        <Edit3 size={18}/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPostToDeleteId(post.id);
                                                        }}
                                                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- МОДАЛЬНЕ ВІКНО: ПЕРЕГЛЯД ЗОБРАЖЕНЬ --- */}
            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {/* --- МОДАЛЬНЕ ВІКНО: ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ --- */}
            {postToDeleteId !== null && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setPostToDeleteId(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-zoomIn relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPostToDeleteId(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X size={24}/>
                        </button>

                        <div className="flex flex-col items-center text-center mt-4">
                            <div
                                className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32}/>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete Post?
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                Are you sure you want to delete this post? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setPostToDeleteId(null)}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeletePost}
                                    disabled={isDeletingPost}
                                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/30 flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {isDeletingPost ? <Loader2 size={18} className="animate-spin"/> : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};