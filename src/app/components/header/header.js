'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const Header = ({ onToggleSidebar }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
        setUser(storedUser);

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("currentRole");
        toast.success("Logged out successfully");
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between px-4 md:px-8 py-4 gap-4">
                {/* Left: Logo + Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden text-gray-700"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href="/" className="flex items-center">
                        <img src="/images/logo.webp" alt="Nilam Logo" className="h-10 w-auto object-contain" />
                    </Link>
                </div>

                {/* Right: Properties + Profile */}
                <div className="flex flex-wrap gap-4 items-center justify-end w-full md:w-auto" ref={dropdownRef}>
                    {user?.role === 'Customer' && (
                        <>
                            {/* Properties Link */}
                        </>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1"
                        >
                            <img
                                src={user?.profilePicture?.name
                                    ? URL.createObjectURL(user.profilePicture)
                                    : "/images/user.png"}
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-700">{user?.fullname}</span>
                            <i className="fi fi-rr-angle-small-down text-base" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white z-50 border rounded shadow">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-gray-100"
                                >
                                    <i className="fi fi-rr-exit text-base" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
