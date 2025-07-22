'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import getFilteredNavItems from '../navitems/getFilteredNavItems';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('currentRole') || 'customer';

        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        getFilteredNavItems(role).then((items) => {
            setMenuItems(items);

            const newExpanded = {};
            items.forEach(({ label, submenu }) => {
                if (
                    submenu &&
                    submenu.some((sub) => pathname.startsWith(sub.href))
                ) {
                    newExpanded[label] = true;
                }
            });

            setExpandedGroups(newExpanded);
        });

        return () => window.removeEventListener('resize', checkIsMobile);
    }, [pathname]); // <-- this is the fix

    const toggleGroup = (label) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed md:static top-[130px] left-0 z-50 w-64 bg-white border-r border-gray-200
                shadow-lg transform transition-transform duration-300
                h-[calc(100vh-130px)] md:h-auto
                overflow-y-auto md:overflow-visible
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <nav className="p-3 space-y-2">
                    {menuItems.map(({ label, href, iconClass, submenu }) => {
                        const hasChildren = submenu && submenu.length > 0;
                        const isActive =
                            (href && pathname.startsWith(href)) ||
                            (hasChildren && submenu.some(sub => pathname.startsWith(sub.href)));
                        const isExpanded = expandedGroups[label];

                        return (
                            <div key={label} className="group">
                                <div
                                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm cursor-pointer transition-colors relative ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-secondary hover:text-white'
                                        }`}
                                    onClick={() => {
                                        if (isMobile && hasChildren) {
                                            toggleGroup(label);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`${iconClass} text-xl`} />
                                        {!hasChildren ? (
                                            <Link href={href} onClick={handleLinkClick}>
                                                <span>{label}</span>
                                            </Link>
                                        ) : (
                                            <span>{label}</span>
                                        )}
                                    </div>
                                    {hasChildren && (
                                        <i
                                            className={`fi fi-bs-angle-right px-2 transition-transform duration-200 ${(isMobile && isExpanded) || (!isMobile && isActive) ? 'rotate-90' : ''
                                                }`}
                                        />
                                    )}
                                </div>

                                {hasChildren && (
                                    <div
                                        className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
      ${isMobile
                                                ? isExpanded
                                                    ? 'max-h-[500px]'
                                                    : 'max-h-0'
                                                : 'group-hover:max-h-[500px] ' + (isActive ? 'max-h-[500px]' : 'max-h-0')
                                            }`}
                                    >

                                        {submenu.map((child) => {
                                            const isChildActive = pathname.startsWith(child.href);
                                            return (
                                                <Link key={child.href} href={child.href} onClick={handleLinkClick}>
                                                    <div
                                                        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm cursor-pointer transition-colors ${isChildActive
                                                            ? 'bg-primary text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
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
