import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "./search";
import { User } from "lucide-react";
import {login} from "../../../features/Auth/authService";


interface HeaderProps {
    isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
    // Зчитуємо акцентний колір з пам'яті
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('site_accent_color') || 'purple';
    });

    // Слідкуємо за змінами (на випадок оновлення в іншій вкладці або перезавантаження)
    useEffect(() => {
        const handleStorageChange = () => {
            setAccentColor(localStorage.getItem('site_accent_color') || 'purple');
        };

        window.addEventListener('storage', handleStorageChange);
        // Також додамо слухач на кастомну подію, якщо ви захочете зробити миттєве оновлення без перезагрузки
        window.addEventListener('accent-color-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('accent-color-change', handleStorageChange);
        };
    }, []);

    return (
        <header className="fixed z-50 top-0 w-full h-16 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-lg transition-colors duration-300">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link
                    to="/"
                    className={`text-4xl font-bold text-${accentColor}-600 hover:text-${accentColor}-700 transition-colors ml-16`}
                >
                    PAX
                </Link>

                <div className="block flex-1 ml-48 mr-auto items-center">
                    <Search/>
                </div>

                {/* Navigation */}
                <nav className="flex space-x-6">
                </nav>

                {/* Auth buttons / User Profile */}
                <div className="flex space-x-3 items-center">

                    {/* якщо не залогінений */}
                    {!isAuthenticated && (
                        <>
                            <Link onClick={login}
                                to="/signin"
                                className={`px-4 py-2 border border-${accentColor}-600 text-${accentColor}-600 rounded-lg hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20 transition`}
                            >
                                Sign In
                            </Link>
                            <Link onClick={login}
                                to="/signup"
                                className={`px-4 py-2 bg-${accentColor}-600 text-white rounded-lg hover:opacity-90 transition`}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* якщо заповнено, то показує налаштування */}
                    {isAuthenticated && (
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <div className={`w-8 h-8 bg-${accentColor}-600 rounded-full flex items-center justify-center text-white`}>
                                <User size={20} />
                            </div>
                            <span className="text-sm font-medium">My Profile</span>
                        </Link>
                    )}
                </div>

                {/* Mobile menu icon */}

                <button className="flex items-center text-white hover:text-purple-600 transition">
                <button className={`md:hidden flex items-center text-gray-900 dark:text-white hover:text-${accentColor}-600 transition`}>
                  
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    );
};