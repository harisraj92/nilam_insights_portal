'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import getFilteredNavItems from '../navitems/getFilteredNavItems';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        const role = localStorage.getItem('currentRole') || 'customer';
        getFilteredNavItems(role).then(items => {
            setMenuItems(items);

            // Auto-expand submenu if current pathname matches any child href
            const newExpanded = {};
            items.forEach(item => {
                if (item.submenu?.some(sub => pathname === sub.href)) {
                    newExpanded[item.label] = true;
                }
            });
            setExpandedGroups(newExpanded);
        });
    }, [pathname]);

    const toggleGroup = (label) => {
        setExpandedGroups(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleLinkClick = () => {
        if (onClose) onClose(); // Close sidebar on mobile
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-40 z-40 md:hidden" onClick={onClose} />
            )}
            <aside
                className={`fixed top-[130px] left-0 h-[calc(100vh-64px)]
                     w-64 z-50 transform transition-transform duration-300
                      bg-white md:static md:translate-x-0 md:h-auto md:top-0 overflow-y-auto shadow-lg border-r
                       border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <nav className="p-4 space-y-2 min-h-full">
                    {menuItems.map(({ label, href, iconClass, submenu }) => {
                        const isActive = href && pathname.startsWith(href);
                        const hasChildren = submenu && submenu.length > 0;

                        return (
                            <div key={label} className="group">
                                <div
                                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm cursor-pointer transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-secondary hover:text-white'}`}
                                    onClick={() => hasChildren ? toggleGroup(label) : null}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`${iconClass} text-xl`} />
                                        {href && !hasChildren ? (
                                            <Link href={href} onClick={handleLinkClick}>
                                                <span>{label}</span>
                                            </Link>
                                        ) : (
                                            <span>{label}</span>
                                        )}
                                    </div>
                                    {hasChildren && (
                                        <span className={`transition-transform duration-200 ${expandedGroups[label] ? 'rotate-90' : ''}`}>
                                            <i className="fi fi-bs-angle-right px-2"></i>
                                        </span>
                                    )}
                                </div>

                                {hasChildren && expandedGroups[label] && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {submenu.map((child) => {
                                            const isChildActive = pathname === child.href;
                                            return (
                                                <Link key={child.href} href={child.href} onClick={handleLinkClick}>
                                                    <div className={`flex items-center gap-3 mt-1 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors ${isChildActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
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
