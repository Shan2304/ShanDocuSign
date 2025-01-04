import { NextResponse } from 'next/server';
import { createEnvelope } from '../utils/jwtHelper';

export async function POST(request) {
    try {
        const { participants, signingType, file } = await request.json();

        if (!participants || !participants.length) {
            return NextResponse.json(
                { error: 'Participants are required' },
                { status: 400 }
            );
        }

        if (!['regular', 'notary'].includes(signingType)) {
            return NextResponse.json(
                { error: 'Invalid signing type' },
                { status: 400 }
            );
        }

        const base64Content = file.replace(/^data:application\/pdf;base64,/, '');
        const result = await createEnvelope({ participants, signingType, base64Content });

        return NextResponse.json({
            message: 'Envelope created successfully',
            result,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Callback received', code });
}
