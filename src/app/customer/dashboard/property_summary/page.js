'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropertySummary() {
    const [data, setData] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [error, setError] = useState("");

    // ✅ Sync property selection from localStorage
    useEffect(() => {
        const updateSelected = () => {
            const code = localStorage.getItem("selectedPropertyCode") || "";
            setSelectedProperty(code);
        };
        updateSelected();
        const interval = setInterval(updateSelected, 500);
        return () => clearInterval(interval);
    }, []);

    // ✅ Fetch property summary data once
    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");
        const userData = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const userId = userData?.id;

        if (!token || !userId) {
            console.error("❌ Missing token or user info");
            setError("Authentication failed. Please log in again.");
            return;
        }

        axios.get(`${process.env.NEXT_PUBLIC_PROPERTY_API}/api/customer/properties/summary`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error("❌ Property summary API error", err);
                setError("Failed to load property data.");
            });
    }, []);

    const filteredData = selectedProperty
        ? data.filter((item) => item.property_code === selectedProperty)
        : data;

    // ✅ Utility: Fence status badge color
    const getFenceStatusColor = (status) => {
        switch ((status || "").toLowerCase()) {
            case "fenced": return "bg-green-500";
            case "unfenced": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    // ✅ Utility: Risk level text color
    const getRiskLabel = (level) => {
        switch ((level || "").toLowerCase()) {
            case "high": return "text-red-600";
            case "moderate": return "text-yellow-600";
            case "low": return "text-green-600";
            default: return "text-gray-600";
        }
    };

    // ✅ Utility: Last visit string
    const getLastVisitText = (lastVisitedAt) => {
        if (!lastVisitedAt) return "No visit data";
        const daysAgo = Math.floor((Date.now() - new Date(lastVisitedAt)) / (1000 * 60 * 60 * 24));
        return `Last visit ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-6">Customer Property Summary</h1>

            {error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((item) => (
                        <div key={item.property_id} className="bg-white shadow rounded-lg p-4 border">
                            <img
                                src={item.photo_url || "/images/default_image.jpg"}
                                alt={item.property_name}
                                className="w-full h-40 object-cover rounded mb-3"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/default_image.jpg";
                                }}
                            />
                            <h2 className="text-md font-semibold mb-1">{item.property_name}</h2>
                            <p className="text-sm text-gray-600 mb-2">{getLastVisitText(item.last_visited)}</p>

                            {/* Fencing Badge */}
                            <span className={`inline-block text-white text-xs px-2 py-1 rounded-full ${getFenceStatusColor(item.fencing_status)} mb-2`}>
                                {(item.fencing_status || "Unknown").charAt(0).toUpperCase() + (item.fencing_status || "").slice(1)}
                            </span>

                            {/* Risk Level */}
                            <p className="text-sm font-semibold mb-1">
                                Risk Level: <span className={getRiskLabel(item.risk_level)}>{item.risk_level || "N/A"}</span>
                            </p>

                            {/* Remarks */}
                            <p className="text-sm text-gray-700 mb-2">{item.remarks || "No remarks available"}</p>

                            {/* Bottom Meta */}
                            <div className="flex justify-between items-center text-xs mt-4 pt-2 border-t">
                                <span className={item.fencing_status === "fenced" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                    {item.fencing_status === "fenced" ? "✅ Fencing Installed" : "⚠️ Alert raised"}
                                </span>
                                <span className="text-gray-400">Notifications</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
