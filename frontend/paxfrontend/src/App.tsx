import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Header } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <div className="min-h-screen bg-gray-950">
            {}
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