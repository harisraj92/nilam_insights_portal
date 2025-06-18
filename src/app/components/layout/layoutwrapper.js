"use client";
import { usePathname } from "next/navigation";
import AppShell from "./appshell";
import { Toaster } from "react-hot-toast";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const standaloneRoutes = ["/login"];
    const isStandalone = standaloneRoutes.some((route) =>
        pathname.startsWith(route)
    );

    return (
        <>
            <Toaster position="top-right" />
            {isStandalone ? children : <AppShell>{children}</AppShell>}
        </>
    );
}
