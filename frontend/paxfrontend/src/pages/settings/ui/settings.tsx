import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, Mail, Lock, Eye, EyeOff, Camera, Save, Moon, Sun, Monitor } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);

    // --- ЛОГІКА ТЕМ ---
    const [selectedTheme, setTheme] = useState(() => {
        return localStorage.getItem('site_theme') || 'Dark';
    });

    const [accentColor, setAccentColor] = useState(() => {
        const saved = localStorage.getItem('site_accent_color');
        const validColors = ['purple', 'blue', 'green', 'red', 'orange', 'pink', 'teal', 'indigo'];
        return (saved && validColors.includes(saved)) ? saved : 'purple';
    });

    useEffect(() => {
        localStorage.setItem('site_theme', selectedTheme);
        const root = window.document.documentElement;

        root.classList.remove('dark');

        if (selectedTheme === 'Dark') {
            root.classList.add('dark');
        } else if (selectedTheme === 'Auto') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            }
        }
    }, [selectedTheme]);

    // !!! ОСЬ ТУТ БУЛА ПРОБЛЕМА !!!
    // Ми додали dispatchEvent, щоб Header дізнався про зміну миттєво
    useEffect(() => {
        localStorage.setItem('site_accent_color', accentColor);
        // Створюємо та відправляємо подію, яку слухає Header
        window.dispatchEvent(new Event('accent-color-change'));
    }, [accentColor]);
    // ----------------------------------

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        mentions: true,
        replies: false,
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'preferences', label: 'Preferences', icon: Globe },
    ];

    // --- СТИЛІ ---
    const pageContainerClass = "min-h-screen w-full bg-gray-50 dark:bg-transparent transition-colors duration-300 p-6";
    const cardClass = "bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 transition-colors shadow-sm";
    const inputClass = `w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-${accentColor}-600 transition-colors`;
    const textMain = "text-gray-900 dark:text-white";
    const textSec = "text-gray-500 dark:text-gray-400";

    const toggleBase = `relative w-12 h-6 rounded-full transition-colors`;
    const toggleActive = `bg-${accentColor}-600`;
    const toggleInactive = `bg-gray-200 dark:bg-gray-700`;
    const toggleDot = `absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm`;

    // --- КОМПОНЕНТИ ---

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Profile Picture</h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className={`w-24 h-24 bg-${accentColor}-600 rounded-full flex items-center justify-center text-white text-3xl font-bold`}>
                            JD
                        </div>
                        <button className={`absolute bottom-0 right-0 w-8 h-8 bg-${accentColor}-600 hover:opacity-90 rounded-full flex items-center justify-center transition-colors border-2 border-white dark:border-gray-800`}>
                            <Camera size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className={`font-medium mb-1 ${textMain}`}>Upload new picture</p>
                        <p className={`text-sm mb-3 ${textSec}`}>JPG, GIF or PNG. Max size 2MB</p>
                        <div className="flex gap-3">
                            <button className={`px-4 py-2 bg-${accentColor}-600 hover:opacity-90 text-white rounded-lg transition-colors text-sm font-medium`}>
                                Upload Image
                            </button>
                            <button className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 ${textMain} rounded-lg transition-colors text-sm font-medium`}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Username</label>
                        <input type="text" defaultValue="johndoe" className={inputClass} />
                    </div>
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Display Name</label>
                        <input type="text" defaultValue="John Doe" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={`block text-sm mb-2 ${textSec}`}>Email Address</label>
                        <input type="email" defaultValue="john.doe@example.com" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={`block text-sm mb-2 ${textSec}`}>Bio</label>
                        <textarea rows={4} defaultValue="Software developer | Tech enthusiast | Coffee lover ☕" className={`${inputClass} resize-none`} />
                    </div>
                </div>
            </div>

            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Change Password</h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Current Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} className={`${inputClass} pr-12`} />
                            <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSec} hover:text-gray-700 dark:hover:text-white transition-colors`}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>New Password</label>
                        <input type="password" className={inputClass} />
                    </div>
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Confirm New Password</label>
                        <input type="password" className={inputClass} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Email Notifications</h3>
                <div className="space-y-4">
                    {[
                        { key: 'email', label: 'Email notifications', desc: 'Receive email updates about your activity' },
                        { key: 'mentions', label: 'Mentions', desc: 'Get notified when someone mentions you' },
                        { key: 'replies', label: 'Replies to your posts', desc: 'Get notified when someone replies to your discussions' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                            <div className="flex-1">
                                <p className={`font-medium ${textMain}`}>{item.label}</p>
                                <p className={`text-sm ${textSec}`}>{item.desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                className={`${toggleBase} ${notifications[item.key as keyof typeof notifications] ? toggleActive : toggleInactive}`}
                            >
                                <div className={`${toggleDot} ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Push Notifications</h3>
                <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                        <p className={`font-medium ${textMain}`}>Browser notifications</p>
                        <p className={`text-sm ${textSec}`}>Receive push notifications in your browser</p>
                    </div>
                    <button
                        onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                        className={`${toggleBase} ${notifications.push ? toggleActive : toggleInactive}`}
                    >
                        <div className={`${toggleDot} ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Privacy Settings</h3>
                <div className="space-y-4">
                    {/* Visibility */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="flex-1">
                            <p className={`font-medium ${textMain}`}>Profile visibility</p>
                            <p className={`text-sm ${textSec}`}>Who can see your profile</p>
                        </div>
                        <select className={`bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 ${textMain} focus:outline-none focus:border-${accentColor}-600`}>
                            <option>Everyone</option>
                            <option>Members only</option>
                            <option>Private</option>
                        </select>
                    </div>

                    {/* Online Status */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="flex-1">
                            <p className={`font-medium ${textMain}`}>Show online status</p>
                            <p className={`text-sm ${textSec}`}>Let others see when you're online</p>
                        </div>
                        <button className={`${toggleBase} ${toggleActive}`}>
                            <div className={`${toggleDot} translate-x-6`} />
                        </button>
                    </div>

                    {/* Activity History */}
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className={`font-medium ${textMain}`}>Activity history</p>
                            <p className={`text-sm ${textSec}`}>Show your recent activity on your profile</p>
                        </div>
                        <button className={`${toggleBase} ${toggleActive}`}>
                            <div className={`${toggleDot} translate-x-6`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Blocked Users */}
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Blocked Users</h3>
                <p className={`text-sm mb-4 ${textSec}`}>You haven't blocked any users yet.</p>
                <button className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 ${textMain} rounded-lg transition-colors text-sm font-medium`}>
                    Manage Blocked Users
                </button>
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className="space-y-6">
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: 'Dark', icon: Moon, label: 'Dark' },
                        { id: 'Light', icon: Sun, label: 'Light' },
                        { id: 'Auto', icon: Monitor, label: 'Auto' }
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                                selectedTheme === t.id
                                    ? `border-${accentColor}-600 bg-${accentColor}-600/10 text-${accentColor}-600 dark:text-${accentColor}-400`
                                    : `border-gray-200 dark:border-gray-700 ${textSec} hover:border-gray-300 dark:hover:border-gray-600`
                            }`}
                        >
                            <t.icon size={24} />
                            <p className="font-medium text-center">{t.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Accent Color</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {['purple', 'blue', 'green', 'red', 'orange', 'pink', 'teal', 'indigo'].map((color) => (
                        <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className={`w-12 h-12 rounded-lg bg-${color}-600 hover:scale-110 transition-transform flex items-center justify-center ${
                                accentColor === color ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg' : ''
                            }`}
                        >
                            {accentColor === color && <div className="w-2 h-2 bg-white rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Language & Region</h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Language</label>
                        <select className={inputClass}>
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm mb-2 ${textSec}`}>Timezone</label>
                        <select className={inputClass}>
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (CET)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={cardClass}>
                <h3 className={`font-semibold text-lg mb-4 ${textMain}`}>Content Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/30">
                        <div className="flex-1">
                            <p className={`font-medium ${textMain}`}>Auto-play videos</p>
                            <p className={`text-sm ${textSec}`}>Videos start playing automatically</p>
                        </div>
                        <button className={`${toggleBase} ${toggleInactive}`}>
                            <div className={`${toggleDot} translate-x-0.5`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className={`font-medium ${textMain}`}>Show NSFW content</p>
                            <p className={`text-sm ${textSec}`}>Display content marked as NSFW</p>
                        </div>
                        <button className={`${toggleBase} ${toggleInactive}`}>
                            <div className={`${toggleDot} translate-x-0.5`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={pageContainerClass}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl font-bold mb-2 ${textMain}`}>Settings</h1>
                    <p className={`text-lg ${textSec}`}>Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-2 space-y-1 transition-colors">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        activeTab === tab.id
                                            ? `bg-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/20`
                                            : `${textSec} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50`
                                    }`}
                                >
                                    <tab.icon size={20} />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'profile' && renderProfileTab()}
                        {activeTab === 'notifications' && renderNotificationsTab()}
                        {activeTab === 'privacy' && renderPrivacyTab()}
                        {activeTab === 'appearance' && renderAppearanceTab()}
                        {activeTab === 'preferences' && renderPreferencesTab()}

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button className={`px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-transparent dark:hover:bg-gray-700 dark:text-white ${textMain} rounded-lg transition-colors font-medium`}>
                                Cancel
                            </button>
                            <button className={`px-6 py-3 bg-gradient-to-r from-${accentColor}-600 to-indigo-600 hover:opacity-90 text-white rounded-lg transition-all shadow-lg shadow-${accentColor}-500/20 font-medium flex items-center gap-2`}>
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};