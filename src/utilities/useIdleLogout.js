'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function useIdleLogout(timeout = 1 * 60 * 1000) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/login') return;

        let timer;

        const logout = () => {
            sessionStorage.removeItem("auth_token");
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("currentRole");

            toast.error("You have been logged out due to inactivity."); // ✅ Toast instead of alert
            router.push("/login");
        };

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(logout, timeout);
        };

        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            clearTimeout(timer);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [timeout, pathname, router]);
}
