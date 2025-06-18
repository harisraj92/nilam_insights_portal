import { NextResponse } from 'next/server';
import { otpStore } from '@/app/lib/otpStore';

// POST /api/verify-otp
export async function POST(req) {
    try {
        const { contact, otp } = await req.json();

        if (!contact || !otp) {
            return NextResponse.json({ success: false, message: 'Missing contact or OTP' }, { status: 400 });
        }

        const isEmail = contact.includes('@');
        const normalizedContact = isEmail
            ? contact.trim().toLowerCase()
            : contact.startsWith('+') ? contact.trim() : `+91${contact.trim()}`;

        console.log("🔐 Verifying OTP for:", normalizedContact);
        console.log("🗝️ Stored keys:", Object.keys(otpStore));
        console.log("🧾 OTP entered:", otp);

        const record = otpStore[normalizedContact];

        if (!record) {
            return NextResponse.json({ success: false, message: 'OTP not found' }, { status: 400 });
        }

        if (record.isUsed) {
            return NextResponse.json({ success: false, message: 'OTP already used' }, { status: 400 });
        }

        if (record.expiresAt < Date.now()) {
            return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
        }

        if (record.otp !== otp) {
            return NextResponse.json({ success: false, message: 'Incorrect OTP' }, { status: 400 });
        }

        // ✅ OTP is valid
        record.isUsed = true;

        // Optional: Set session cookie or return session token here
        return NextResponse.json({ success: true, message: 'OTP verified successfully' });

    } catch (err) {
        console.error('❌ Error verifying OTP:', err);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
