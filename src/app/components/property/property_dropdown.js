//src\app\components\property\property_dropdown.js

"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropertyDropdown({ selected, onChange }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const token = sessionStorage.getItem("auth_token");
            console.log("🪪 Token from sessionStorage:", token);
            console.log("✅ API BASE URL:", process.env.NEXT_PUBLIC_PROPERTY_API);
            console.log("🪪 Token from sessionStorage:", token);
            console.log("📡 Final API URL:", `${process.env.NEXT_PUBLIC_PROPERTY_API}/header/properties/property-dropdown`);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_PROPERTY_API}/header/properties/property-dropdown`,
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
                onChange={(e) => {
                    const value = e.target.value;
                    localStorage.setItem("selectedPropertyCode", value);
                    onChange(e);
                }}
            >
                <option value="">Select property</option>
                {options.map((opt) => (
                    <option key={opt.property_code} value={opt.property_code}>
                        {opt.name}
                    </option>
                ))}
            </select>

        </div>
    );
}
