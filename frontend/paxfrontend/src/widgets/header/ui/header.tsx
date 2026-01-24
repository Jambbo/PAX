import React from "react";
import { Link } from "react-router-dom";
import {Search} from "./search";
import {useAuth} from "../../../features/Auth/useAuth";
import {login, logout} from "../../../features/Auth/authService";

export const Header: React.FC = () => {

    const { authenticated } = useAuth();

    return (
        <header className="fixed z-50 top-0  w-full h-16 bg-gray-950 text-white shadow-lg">
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

                {/* Auth buttons */}
                <div className="hidden md:flex space-x-3">
                    {!authenticated ? (
                        <>
                            <button
                                onClick={login}
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={login}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
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

