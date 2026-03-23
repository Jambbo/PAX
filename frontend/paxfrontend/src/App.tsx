import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Header } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";
import {useTokenRefresh} from "./features/Auth/useTokenRefresh";

const App: React.FC = () => {
    useTokenRefresh();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initTheme = () => {
            const savedTheme = localStorage.getItem('site_theme') || 'Dark';
            const root = window.document.documentElement;

            root.classList.remove('dark');

            if (savedTheme === 'Dark') {
                root.classList.add('dark');
            } else if (savedTheme === 'Auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                }
            }
        };

        initTheme();
    }, []);

    useEffect(() => {

        const handler = () => {
            const token = localStorage.getItem("access_token");
            setIsAuthenticated(Boolean(token));
        };

        handler();

        window.addEventListener("auth-change", handler);
        window.addEventListener("storage", handler);

        return () => {
            window.removeEventListener("auth-change", handler);
            window.removeEventListener("storage", handler);
        };

    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">

            <Header isAuthenticated={isAuthenticated} />

            <Sidebar
                isOpen={isSidebarOpen}
                toggleMenu={toggleSidebar}
                isAuthenticated={isAuthenticated}
            />

            <main
                className={`transition-all duration-300 pt-16 ${
                    isSidebarOpen ? 'ml-72' : 'ml-20'
                }`}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default App;