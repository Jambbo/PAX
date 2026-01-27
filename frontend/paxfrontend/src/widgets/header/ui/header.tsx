import React from "react";
import { Link } from "react-router-dom";
import { Search } from "./search";
import { User } from "lucide-react";


interface HeaderProps {
    isAuthenticated: boolean;
}


export const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
    return (
        <header className="fixed z-50 top-0 w-full h-16 bg-gray-950 text-white shadow-lg">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link
                    to="/"
                    className="text-4xl font-bold text-purple-600 hover:text-purple-700 transition-colors ml-16"
                >
                    PAX
                </Link>

                <div className="md:block hidden flex-1 ml-48 mr-auto items-center">
                    <Search/>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                </nav>

                {/* Auth buttons / User Profile */}
                <div className="hidden md:flex space-x-3 items-center">

                    {/* если не залогинин то не показывает*/}
                    {!isAuthenticated && (
                        <>
                            <Link
                                to="/signin"
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* если заполнино, то показывает настройки */}
                    {isAuthenticated && (
                        <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <span className="text-sm font-medium">My Profile</span>
                        </Link>
                    )}
                </div>

                {/* Mobile menu icon */}
                <button className="md:hidden flex items-center text-white hover:text-purple-600 transition">
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