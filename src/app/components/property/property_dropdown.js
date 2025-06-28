"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropertyDropdown({ selected, onChange }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const token = sessionStorage.getItem("auth_token");
            console.log("✅ API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
            console.log("🪪 Token from sessionStorage:", token);
            console.log("📡 Final API URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/header/properties/property-dropdown`);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/header/properties/property-dropdown`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOptions(res.data);
                console.log("✅ Property options:", res.data);
            } catch (err) {
                console.error("🔴 Property fetch error:", err);
            }
        }

        fetchData();



    }, []);

    return (
        <div className="flex items-center gap-2">
            <label className="font-medium text-sm">Properties:</label>
            <select
                className="border px-3 py-1 rounded-md text-sm"
                value={selected}
                onChange={onChange}
            >
                <option value="">Select property</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
