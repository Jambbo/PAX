import React, {useState} from "react";
import {
    Menu,
    X,
    Home,
    MessageSquare,
    Users,
    TrendingUp,
    Bookmark,
    Bell,
    Settings,
    LogOut,
    Plus,
    Hash,
    Calendar
} from "lucide-react";
import {Link} from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    toggleMenu: () => void;
    isAuthenticated: boolean; //  Глеб я не нашел твой метод на проверку
}

//
export const Sidebar: React.FC<SidebarProps> = ({isOpen, toggleMenu, isAuthenticated}) => {
    const [activeItem, setActiveItem] = useState("home");

    const menuItems = [
        {id: "home", icon: Home, label: "Home", badge: null},
        {id: "messages", icon: MessageSquare, label: "Messages", badge: "24"},
        {id: "trending", icon: TrendingUp, label: "Trending", badge: 2},
        {id: "groups", icon: Users, label: "Groups", badge: null},
        {id: "bookmarks", icon: Bookmark, label: "Bookmarks", badge: null},
        {id: "notifications", icon: Bell, label: "Notifications", badge: "5"},
    ];

    const quickLinks = [
        {id: "general", icon: Hash, label: "General", color: "text-blue-400"},
        {id: "support", icon: Hash, label: "Support", color: "text-green-400"},
        {id: "announcements", icon: Hash, label: "Announcements", color: "text-purple-400"},
        {id: "events", icon: Calendar, label: "Events", color: "text-orange-400"},
    ];

    return (
        <div
            className={`bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50 text-white fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col shadow-2xl z-40
        ${isOpen ? "w-72" : "w-20"}`}
        >
            {/* тут тогл робим */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                {isOpen && (
                    <span className="font-semibold text-sm text-gray-400 uppercase tracking-wider">
            Navigation
          </span>
                )}
                <button
                    onClick={toggleMenu}
                    className={`w-10 h-10 flex items-center justify-center hover:bg-gray-800/50 rounded-lg transition-all duration-200 ${!isOpen && "mx-auto"}`}
                >
                    {isOpen ? <X size={22}/> : <Menu size={22}/>}
                </button>
            </div>

            {/* Main Navigation */}
            <nav
                className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {menuItems.map((item) => (
                    <Link to={`${item.id}`} key={item.id}>
                        <button
                            onClick={() => setActiveItem(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${activeItem === item.id
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                                : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                            }`}
                        >
                            <item.icon size={20} className="flex-shrink-0"/>
                            {isOpen && (
                                <>
                                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                                    )}
                                </>
                            )}
                            {!isOpen && item.badge && (
                                <span
                                    className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {item.badge}
              </span>
                            )}
                        </button>
                    </Link>
                ))}

                {isOpen && (
                    <>
                        {/* Quick Links Section */}
                        <div className="pt-6">
                            <div className="flex items-center justify-between px-3 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Links
                </span>
                                <button className="text-gray-500 hover:text-purple-400 transition-colors">
                                    <Plus size={16}/>
                                </button>
                            </div>
                            <div className="space-y-1">
                                {quickLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all duration-200 group"
                                    >
                                        <link.icon size={18} className={`flex-shrink-0 ${link.color}`}/>
                                        <span className="text-sm">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-gray-800/50 p-3 space-y-2">
                <Link to="/settings">
                    <button
                        onClick={() => setActiveItem("settings")}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
              ${activeItem === "settings"
                            ? "bg-gray-800 text-white"
                            : "hover:bg-gray-800/50 text-gray-400 hover:text-white"
                        }`}
                    >
                        <Settings size={20} className="flex-shrink-0"/>
                        {isOpen && <span className="text-sm font-medium">Settings</span>}
                    </button>
                </Link>

                {/*  ну и когда мы залогинены, то должна появится кнопка*/}
                {isAuthenticated && (
                    <button
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 shadow-lg shadow-red-500/20">
                        <LogOut size={20} className="flex-shrink-0"/>
                        {isOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                )}
            </div>
        </div>
    );
};