import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Mail, Lock, Eye, EyeOff, Camera, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
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

    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            JD
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                            <Camera size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-medium mb-1">Upload new picture</p>
                        <p className="text-gray-400 text-sm mb-3">JPG, GIF or PNG. Max size 2MB</p>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                                Upload Image
                            </button>
                            <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            defaultValue="johndoe"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Display Name</label>
                        <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Bio</label>
                        <textarea
                            rows={4}
                            defaultValue="Software developer | Tech enthusiast | Coffee lover ☕"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Change Password</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors pr-12"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Email Notifications</h3>
                <div className="space-y-4">
                    {[
                        { key: 'email', label: 'Email notifications', desc: 'Receive email updates about your activity' },
                        { key: 'mentions', label: 'Mentions', desc: 'Get notified when someone mentions you' },
                        { key: 'replies', label: 'Replies to your posts', desc: 'Get notified when someone replies to your discussions' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-0">
                            <div className="flex-1">
                                <p className="text-white font-medium">{item.label}</p>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                    notifications[item.key as keyof typeof notifications] ? 'bg-purple-600' : 'bg-gray-700'
                                }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Push Notifications</h3>
                <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                        <p className="text-white font-medium">Browser notifications</p>
                        <p className="text-gray-400 text-sm">Receive push notifications in your browser</p>
                    </div>
                    <button
                        onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications.push ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                    >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                        <div className="flex-1">
                            <p className="text-white font-medium">Profile visibility</p>
                            <p className="text-gray-400 text-sm">Who can see your profile</p>
                        </div>
                        <select className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
                            <option>Everyone</option>
                            <option>Members only</option>
                            <option>Private</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                        <div className="flex-1">
                            <p className="text-white font-medium">Show online status</p>
                            <p className="text-gray-400 text-sm">Let others see when you're online</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-purple-600 transition-colors">
                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className="text-white font-medium">Activity history</p>
                            <p className="text-gray-400 text-sm">Show your recent activity on your profile</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-purple-600 transition-colors">
                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Blocked Users</h3>
                <p className="text-gray-400 text-sm mb-4">You haven't blocked any users yet.</p>
                <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                    Manage Blocked Users
                </button>
            </div>
        </div>
    );

    const [selectedTheme, setTheme] = useState('dark');
    const renderAppearanceTab = () => (
        <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Dark', 'Light', 'Auto'].map((theme) => (
                        <button
                            key={theme}
                            onClick={()=>setTheme(theme)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedTheme === theme
                                    ? 'border-purple-600 bg-purple-600/10'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                            <div className="flex items-center justify-center mb-2">
                                <div className={`w-16 h-16 rounded-lg ${
                                    theme === 'Dark' 
                                        ? 'bg-gray-900' 
                                        : theme === 'Light' 
                                            ? 'bg-gray-100' 
                                            : 'bg-gradient-to-br from-gray-900 to-gray-100'
                                }`} />
                            </div>
                            <p className="text-white font-medium text-center">{theme}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Accent Color</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {['purple', 'blue', 'green', 'red', 'orange', 'pink', 'teal', 'indigo'].map((color) => (
                        <button
                            key={color}
                            className={`w-12 h-12 rounded-lg bg-${color}-600 hover:scale-110 transition-transform ${
                                color === 'purple' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Language & Region</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Language</label>
                        <select className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Timezone</label>
                        <select className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (CET)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Content Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                        <div className="flex-1">
                            <p className="text-white font-medium">Auto-play videos</p>
                            <p className="text-gray-400 text-sm">Videos start playing automatically</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-gray-700">
                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className="text-white font-medium">Show NSFW content</p>
                            <p className="text-gray-400 text-sm">Display content marked as NSFW</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-gray-700">
                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400 text-lg">Manage your account settings and preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
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
                        <button className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 font-medium flex items-center gap-2">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};