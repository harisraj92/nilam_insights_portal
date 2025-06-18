"use client";
import { useState } from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";

export default function AppShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <Header onToggleSidebar={() => setSidebarOpen(true)} />

            {/* Main layout below header */}
            <div className="flex flex-1 overflow-hidden pt-[73px] mt-[90px] md:mt-0">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Scrollable content only here */}
                <main className="flex-1 overflow-y-auto p-4 md:p-4 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
