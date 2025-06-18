'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import getFilteredNavItems from '../navitems/getFilteredNavItems';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});

    // Load initial menu items
    useEffect(() => {
        setMenuItems(getFilteredNavItems());
    }, []);

    // Restore expandedGroups from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('expandedGroups');
        if (saved) setExpandedGroups(JSON.parse(saved));
    }, []);

    // Save expandedGroups to localStorage on change
    useEffect(() => {
        localStorage.setItem('expandedGroups', JSON.stringify(expandedGroups));
    }, [expandedGroups]);

    // Handle external reloadSidebarNav event
    useEffect(() => {
        const reload = () => setMenuItems(getFilteredNavItems());
        window.addEventListener("reloadSidebarNav", reload);
        return () => window.removeEventListener("reloadSidebarNav", reload);
    }, []);

    const toggleGroup = (label) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const handleLinkClick = () => {
        if (onClose) onClose(); // Close drawer on mobile
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-[180px] left-0 h-[calc(100vh-80px)] w-64 border-r border-gray-200 bg-white z-50 transform transition-transform md:static md:h-auto md:top-0 md:translate-x-0 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <nav className="p-4 space-y-2 min-h-full">
                    {menuItems.map(({ label, href, iconClass, children }) => {
                        const isActive = href && pathname.startsWith(href);
                        const hasChildren = children && children.length > 0;

                        return (
                            <div key={`${label}-${href || 'group'}`} className="group">
                                {/* Top-level item */}
                                <div
                                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm cursor-pointer transition-colors
            ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-secondary hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`${iconClass} text-xl`} />
                                        {href ? (
                                            <Link href={href} onClick={handleLinkClick}>
                                                <span>{label}</span>
                                            </Link>
                                        ) : (
                                            <span>{label}</span>
                                        )}
                                    </div>

                                    {hasChildren && (
                                        <span className="text-xs transition-transform group-hover:rotate-90"><i className="fi fi-bs-angle-right px-2"></i></span>
                                    )}
                                </div>

                                {/* Submenu appears directly below */}
                                {hasChildren && (
                                    <div
                                        className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
      ${children.some(child => pathname.startsWith(child.href)) ? 'max-h-[400px]' : 'max-h-0 group-hover:max-h-[400px]'}`}
                                    >
                                        {children.map((child) => {
                                            const isChildActive = pathname.startsWith(child.href);
                                            return (
                                                <Link key={child.href} href={child.href} onClick={handleLinkClick}>
                                                    <div
                                                        className={`flex items-center gap-3 mt-1 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors
                      ${isChildActive
                                                                ? 'bg-primary text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'}`}
                                                    >
                                                        <i className={`${child.iconClass} text-base`} />
                                                        {child.label}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>


            </aside>
        </>
    );
}
