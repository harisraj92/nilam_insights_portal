"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

const LoginForm = () => {
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('send');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth';
    const router = useRouter();

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const normalizeContact = (input) => {
        const trimmed = input.trim();
        if (trimmed.includes('@')) return trimmed.toLowerCase();
        return trimmed.replace(/^\+91/, '');  // Remove +91 if present
    };


    const sendOtp = async () => {
        setLoading(true);
        const normalized = normalizeContact(contact);

        try {
            const res = await fetch(`${baseUrl}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: normalized }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch (jsonErr) {
                console.warn("Invalid JSON response", jsonErr);
            }

            if (res.ok && data.success) {
                setStep('verify');
                sessionStorage.setItem('otp_contact', normalized);
                sessionStorage.setItem('otp_sent_at', Date.now().toString());

                setOtp(''); // ✅ Clear old OTP from input box
                setResendCooldown(30);
                toast.success('OTP sent successfully');
            } else {
                toast.error(data?.detail || data?.message || 'Failed to send OTP');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error while sending OTP');
        }
        setLoading(false);
    };



    const verifyOtp = async () => {
        setLoading(true);
        const normalized = normalizeContact(contact);

        try {
            const res = await fetch(`${baseUrl}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: normalized, otp }),
            });

            const data = await res.json();
            console.log("✅ OTP verify response:", data);

            if (res.ok && (data.success || data.access_token)) {
                toast.success(data.message || 'OTP verified! Redirecting...');
                sessionStorage.setItem('auth_token', data.access_token);
                sessionStorage.removeItem('otp_contact');
                sessionStorage.removeItem('otp_sent_at');
                localStorage.setItem('loggedInUser', JSON.stringify(data.user));
                router.push('/customer/dashboard/property_summary');
            } else {
                const errorMessage = data?.message || data?.detail || 'OTP verification failed';
                toast.error(errorMessage);
            }

        } catch (err) {
            console.error(err);
            toast.error('Server error while verifying OTP');
        }

        setLoading(false);
    };




    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-6">
                <div className="text-center">
                    <Link href="/">
                        <img src="/images/logo.webp" alt="Nilam Logo" className="mx-auto h-14" />
                    </Link>
                    <h2 className="text-lg font-semibold mt-2">Sign in to your account via OTP</h2>
                </div>

                {step === 'send' && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Email or Mobile Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        <button
                            onClick={sendOtp}
                            disabled={loading || !contact}
                            className="w-full bg-primary text-white py-2 rounded cursor-pointer hover:bg-secondary"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        <button
                            onClick={verifyOtp}
                            disabled={loading || !otp}
                            className="w-full bg-primary text-white py-2 rounded cursor-pointer hover:bg-secondary"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            onClick={sendOtp}
                            disabled={loading || resendCooldown > 0}
                            className="w-full text-sm mt-2 text-secondary hover:underline"
                        >
                            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                    </>
                )}
            </div>
        </main>
    );
};

export default LoginForm;
