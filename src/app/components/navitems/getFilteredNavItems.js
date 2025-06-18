'use client';

import navItems from "./navItems";

const normalizeLabel = (label) =>
    label?.trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").toLowerCase();

const getFilteredNavItems = () => {
    // Ensure code only runs on client
    if (typeof window === "undefined") return [];

    const currentRole = localStorage.getItem("currentRole");
    const permissionsRaw = localStorage.getItem("pagePermissions");
    const permissions = permissionsRaw ? JSON.parse(permissionsRaw) : {};

    // 🔁 If Admin role is missing or has no access, initialize with all labels
    if (!permissions.Admin || permissions.Admin.length === 0) {
        const allLabels = [];

        const extractLabels = (items) => {
            for (const item of items) {
                if (item.label) allLabels.push(item.label);
                if (item.children) extractLabels(item.children);
            }
        };

        extractLabels(navItems);
        permissions.Admin = [...allLabels];

        localStorage.setItem("pagePermissions", JSON.stringify(permissions));
        localStorage.setItem("navRefreshToken", Date.now().toString());
        window.dispatchEvent(new Event("reloadSidebarNav"));

        console.log("✅ Initialized Admin permission with all pages");
    }

    const allowedRaw = permissions[currentRole] || [];
    const allowedNormalized = new Set(allowedRaw.map(normalizeLabel));

    const filterNav = (items) =>
        items
            .map((item) => {
                const labelNorm = normalizeLabel(item.label);
                const isAllowed = allowedNormalized.has(labelNorm);

                if (item.children) {
                    const children = filterNav(item.children);
                    if (isAllowed || children.length > 0) {
                        return {
                            ...item,
                            children: children.length ? children : undefined,
                        };
                    }
                    return null;
                }

                return isAllowed ? item : null;
            })
            .filter(Boolean);

    return filterNav(navItems);
};

export default getFilteredNavItems;
