'use client';

const getFilteredNavItems = async (role) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await fetch(`${baseUrl}/sidebar/${role}`);
        if (!response.ok) throw new Error('Failed to fetch sidebar items');
        const items = await response.json();

        // Use backend response structure
        return items.map(item => ({
            label: item.label,
            iconClass: item.iconClass || '',
            href: item.href || null,
            submenu: (item.submenu || []).map(sub => ({
                label: sub.label,
                href: sub.href,
                iconClass: sub.iconClass || ''
            }))
        }));

    } catch (error) {
        console.error("Sidebar fetch error:", error);
        return [];
    }
};

export default getFilteredNavItems;
