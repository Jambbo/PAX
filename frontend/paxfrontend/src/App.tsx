import './App.css'
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { Header } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Header />
            <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />

            {/* Main Content Area */}
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