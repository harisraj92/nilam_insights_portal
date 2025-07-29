'use client';
import useIdleLogout from "@/utilities/useIdleLogout";

export default function IdleLogoutWrapper() {
    useIdleLogout(5 * 60 * 1000); // 5 minutes
    return null;
}
