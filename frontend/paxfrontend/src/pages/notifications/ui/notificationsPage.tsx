import React, { useMemo, useState } from 'react';
import {
    Bell,
    AtSign,
    Heart,
    UserPlus,
    MessageSquare,
    ShieldAlert,
    Check,
    CheckCheck,
    Search,
    Filter,
    Trash2,
    MoreVertical,
    Settings,
    Clock
} from 'lucide-react';

type NotificationType = 'mention' | 'like' | 'follow' | 'reply' | 'system';

interface NotificationItem {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    actor?: {
        name: string;
        avatar: string;
    };
    context?: {
        label: string;
        color: string; // tailwind gradient, same style as other pages
    };
    meta?: {
        postTitle?: string;
        count?: number;
    };
}

const typeMeta: Record<
    NotificationType,
    {
        label: string;
        icon: React.ReactNode;
        pill: { bg: string; text: string; border: string };
        cardBorder: string;
        iconBg: string;
    }
> = {
    mention: {
        label: 'Mentions',
        icon: <AtSign size={18} className="text-white" />,
        pill: { bg: 'bg-blue-600/20', text: 'text-blue-300', border: 'border-blue-500/30' },
        cardBorder: 'border-blue-500/25',
        iconBg: 'from-blue-600 to-blue-700'
    },
    like: {
        label: 'Likes',
        icon: <Heart size={18} className="text-white" />,
        pill: { bg: 'bg-pink-600/20', text: 'text-pink-300', border: 'border-pink-500/30' },
        cardBorder: 'border-pink-500/25',
        iconBg: 'from-pink-600 to-pink-700'
    },
    follow: {
        label: 'Follows',
        icon: <UserPlus size={18} className="text-white" />,
        pill: { bg: 'bg-green-600/20', text: 'text-green-300', border: 'border-green-500/30' },
        cardBorder: 'border-green-500/25',
        iconBg: 'from-green-600 to-green-700'
    },
    reply: {
        label: 'Replies',
        icon: <MessageSquare size={18} className="text-white" />,
        pill: { bg: 'bg-purple-600/20', text: 'text-purple-300', border: 'border-purple-500/30' },
        cardBorder: 'border-purple-500/25',
        iconBg: 'from-purple-600 to-purple-700'
    },
    system: {
        label: 'System',
        icon: <ShieldAlert size={18} className="text-white" />,
        pill: { bg: 'bg-orange-600/20', text: 'text-orange-300', border: 'border-orange-500/30' },
        cardBorder: 'border-orange-500/25',
        iconBg: 'from-orange-600 to-orange-700'
    }
};

export const NotificationsPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 1,
            type: 'mention',
            title: 'You were mentioned in a discussion',
            message: 'Sarah J. mentioned you: “What do you think about memoization vs. virtualization here?”',
            time: '12 min ago',
            isRead: false,
            actor: { name: 'Sarah J.', avatar: 'SJ' },
            context: { label: 'Tech Enthusiasts', color: 'from-blue-500 to-cyan-600' },
            meta: { postTitle: 'React performance optimization patterns' }
        },
        {
            id: 2,
            type: 'reply',
            title: 'New reply to your comment',
            message: 'Mike R. replied: “Good point — also worth profiling with the React DevTools.”',
            time: '1 hour ago',
            isRead: false,
            actor: { name: 'Mike R.', avatar: 'MR' },
            context: { label: 'Career Growth', color: 'from-green-500 to-emerald-600' },
            meta: { postTitle: 'My journey to full-stack' }
        },
        {
            id: 3,
            type: 'like',
            title: 'Your post is getting traction',
            message: 'Alex K. and 23 others liked your post.',
            time: '3 hours ago',
            isRead: true,
            actor: { name: 'Alex K.', avatar: 'AK' },
            context: { label: 'Tech Enthusiasts', color: 'from-blue-500 to-cyan-600' },
            meta: { count: 24, postTitle: 'Top 10 VS Code extensions' }
        },
        {
            id: 4,
            type: 'follow',
            title: 'New follower',
            message: 'Emily S. started following you.',
            time: 'Yesterday',
            isRead: true,
            actor: { name: 'Emily S.', avatar: 'ES' }
        },
        {
            id: 5,
            type: 'system',
            title: 'Security notice',
            message: 'A new sign-in was detected from a Windows device. If this wasn’t you, secure your account.',
            time: '2 days ago',
            isRead: false
        },
        {
            id: 6,
            type: 'reply',
            title: 'Reply in your saved thread',
            message: 'Admin posted an update to the Dark Mode 2.0 thread.',
            time: '1 week ago',
            isRead: true,
            actor: { name: 'Admin', avatar: 'AD' },
            context: { label: 'Announcements', color: 'from-purple-500 to-pink-600' },
            meta: { postTitle: 'Dark Mode 2.0 - improvements' }
        }
    ]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return notifications.filter(n => {
            const matchesType = activeFilter === 'all' || n.type === activeFilter;
            const matchesUnread = !showUnreadOnly || !n.isRead;

            const haystack = [
                n.title,
                n.message,
                n.actor?.name ?? '',
                n.context?.label ?? '',
                n.meta?.postTitle ?? ''
            ]
                .join(' ')
                .toLowerCase();

            const matchesSearch = q.length === 0 || haystack.includes(q);
            return matchesType && matchesUnread && matchesSearch;
        });
    }, [notifications, activeFilter, showUnreadOnly, searchQuery]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const toggleRead = (id: number) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n)));
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Bell className="text-purple-500" size={40} />
                            Notifications
                        </h1>
                        <p className="text-gray-400 text-lg">Mentions, replies, follows, and platform updates</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600/30 transition-all flex items-center gap-2"
                        >
                            <CheckCheck size={16} />
                            Mark all as read
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-gray-200 hover:bg-gray-800/60 transition-all flex items-center gap-2">
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Bell size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Total</p>
                                <p className="text-white text-xl font-bold">{notifications.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-lg shadow-blue-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                                <AtSign size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Mentions</p>
                                <p className="text-white text-xl font-bold">
                                    {notifications.filter(n => n.type === 'mention').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm border border-pink-500/30 rounded-xl p-4 shadow-lg shadow-pink-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Heart size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Likes</p>
                                <p className="text-white text-xl font-bold">
                                    {notifications.filter(n => n.type === 'like').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                                <Clock size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Unread</p>
                                <p className="text-white text-xl font-bold">{unreadCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 mb-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'mention', 'reply', 'like', 'follow', 'system'] as const).map(key => {
                                const isActive = activeFilter === key;
                                const label = key === 'all' ? 'All' : typeMeta[key].label;
                                const pill =
                                    key === 'all'
                                        ? { bg: 'bg-purple-600/20', text: 'text-purple-200', border: 'border-purple-500/30' }
                                        : typeMeta[key].pill;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveFilter(key)}
                                        className={[
                                            'px-4 py-2 rounded-lg border transition-all text-sm font-medium',
                                            isActive
                                                ? `${pill.bg} ${pill.text} ${pill.border}`
                                                : 'bg-gray-800/30 border-gray-700/40 text-gray-300 hover:bg-gray-800/50'
                                        ].join(' ')}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex-1 flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search notifications..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                />
                            </div>

                            {/* Unread toggle */}
                            <button
                                onClick={() => setShowUnreadOnly(v => !v)}
                                className={[
                                    'px-4 py-2 rounded-lg border transition-all flex items-center gap-2',
                                    showUnreadOnly
                                        ? 'bg-purple-600/20 border-purple-500/30 text-purple-200'
                                        : 'bg-gray-800/30 border-gray-700/50 text-gray-200 hover:bg-gray-800/50'
                                ].join(' ')}
                            >
                                <Filter size={16} />
                                Unread only
                            </button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {filtered.length === 0 ? (
                        <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-10 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gray-800/40 border border-gray-700/50 mx-auto flex items-center justify-center mb-4">
                                <Bell size={24} className="text-gray-300" />
                            </div>
                            <p className="text-white text-lg font-semibold mb-1">No notifications found</p>
                            <p className="text-gray-400">Try changing filters or clearing your search.</p>
                        </div>
                    ) : (
                        filtered.map(n => {
                            const meta = typeMeta[n.type];

                            return (
                                <div
                                    key={n.id}
                                    className={[
                                        'bg-gray-900/70 backdrop-blur-sm border rounded-xl p-4 shadow-lg transition-all',
                                        n.isRead ? 'border-gray-800/60' : meta.cardBorder,
                                        n.isRead ? 'opacity-90' : 'opacity-100'
                                    ].join(' ')}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="relative">
                                            <div
                                                className={[
                                                    'w-11 h-11 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br',
                                                    meta.iconBg
                                                ].join(' ')}
                                            >
                                                {meta.icon}
                                            </div>
                                            {!n.isRead && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 ring-2 ring-gray-900" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-white font-semibold truncate">{n.title}</h3>
                                                        <span
                                                            className={[
                                                                'text-xs px-2 py-1 rounded border',
                                                                meta.pill.bg,
                                                                meta.pill.text,
                                                                meta.pill.border
                                                            ].join(' ')}
                                                        >
                                                            {meta.label}
                                                        </span>

                                                        {n.context && (
                                                            <span
                                                                className="text-xs px-2 py-1 rounded border border-gray-700/50 text-gray-200 bg-gray-800/30 flex items-center gap-2"
                                                                title={n.context.label}
                                                            >
                                                                <span
                                                                    className={[
                                                                        'w-2.5 h-2.5 rounded-full bg-gradient-to-br',
                                                                        n.context.color
                                                                    ].join(' ')}
                                                                />
                                                                {n.context.label}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-300 mt-1 leading-relaxed">
                                                        {n.actor ? (
                                                            <>
                                                                <span className="text-white font-medium">{n.actor.name}</span>{' '}
                                                                {n.message.replace(`${n.actor.name} `, '')}
                                                            </>
                                                        ) : (
                                                            n.message
                                                        )}
                                                    </p>

                                                    {n.meta?.postTitle && (
                                                        <div className="mt-2 text-sm text-gray-400">
                                                            <span className="text-gray-500">Context:</span>{' '}
                                                            <span className="text-gray-300">{n.meta.postTitle}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right meta */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs text-gray-400">{n.time}</span>
                                                    <button className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/50 text-gray-200 hover:bg-gray-800/50 transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleRead(n.id)}
                                                    className={[
                                                        'px-3 py-2 rounded-lg border transition-all text-sm flex items-center gap-2',
                                                        n.isRead
                                                            ? 'bg-gray-800/30 border-gray-700/50 text-gray-200 hover:bg-gray-800/50'
                                                            : 'bg-purple-600/20 border-purple-500/30 text-purple-200 hover:bg-purple-600/30'
                                                    ].join(' ')}
                                                >
                                                    <Check size={16} />
                                                    {n.isRead ? 'Mark unread' : 'Mark read'}
                                                </button>

                                                <button
                                                    onClick={() => removeNotification(n.id)}
                                                    className="px-3 py-2 rounded-lg bg-red-600/15 border border-red-500/25 text-red-200 hover:bg-red-600/25 transition-all text-sm flex items-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Actor avatar */}
                                        {n.actor && (
                                            <div className="hidden md:flex items-center justify-center w-11 h-11 rounded-xl bg-gray-800/30 border border-gray-700/50 text-white font-semibold">
                                                {n.actor.avatar}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};