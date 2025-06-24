"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";


export default function CustomerDashboard() {
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = sessionStorage.getItem('auth_token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/protected-endpoint`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await res.json();
                if (res.ok) {
                    setData(result);  // ✅ Use protected data
                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                router.push('/login');
            }
        };

        fetchProtectedData();
    }, []);

    return (
        <div>

            <h1 className="text-xl font-bold">Welcome to Dashboard</h1>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
