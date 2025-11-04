import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Your cover letter generation logic here
        const body = await req.json();

        // Your implementation...

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cover letter generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}

// Add GET if needed
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'Cover letter API' });
}