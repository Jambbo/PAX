import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Header } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- 1. ДОДАНО: Ініціалізація теми з основного коду ---
    useEffect(() => {
        const initTheme = () => {
            // Зчитуємо тему (за замовчуванням Dark)
            const savedTheme = localStorage.getItem('site_theme') || 'Dark';
            const root = window.document.documentElement;

            // Спочатку очищаємо клас
            root.classList.remove('dark');

            // Застосовуємо логіку
            if (savedTheme === 'Dark') {
                root.classList.add('dark');
            } else if (savedTheme === 'Auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                }
            }
            // Якщо Light, то клас dark не додаємо
        };

        initTheme();
    }, []);
    // -----------------------------------------------------

    useEffect(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        // --- 2. ДОДАНО: Стилі обгортки з основного коду (адаптивність) ---
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