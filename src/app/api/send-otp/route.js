import { NextResponse } from 'next/server';
import { otpStore } from '@/app/lib/otpStore';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// POST /api/send-otp
export async function POST(req) {
    try {
        const { contact } = await req.json();

        if (!contact) {
            return NextResponse.json({ success: false, message: 'Missing contact' }, { status: 400 });
        }

        const isEmail = contact.includes('@');
        const normalizedContact = isEmail
            ? contact.trim().toLowerCase()
            : contact.startsWith('+') ? contact.trim() : `+91${contact.trim()}`;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with expiry (5 min)
        otpStore[normalizedContact] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            isUsed: false,
        };

        console.log(`✅ OTP stored for ${normalizedContact}: ${otp}`);
        console.log("🧾 All stored keys:", Object.keys(otpStore));

        if (isEmail) {
            // Optional: send via email or simulate
            console.log(`[Email Simulation] OTP for ${normalizedContact}: ${otp}`);
        } else {
            const result = await client.messages.create({
                body: `Your Nilam login OTP is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: normalizedContact,
            });

            console.log(`📤 Twilio message sent. SID: ${result.sid}`);
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (err) {
        console.error('❌ Error sending OTP:', err);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
