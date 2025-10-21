import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/ai';
import { rateLimit } from '@/lib/rate-limit';

// Rate limiter
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
    // Check various headers for IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    return 'anonymous';
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const identifier = getClientIp(request);
        try {
            await limiter.check(10, identifier);
        } catch {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { resumeText, jobDescription } = body;

        // Validation
        if (!resumeText || typeof resumeText !== 'string') {
            return NextResponse.json(
                { error: 'Resume text is required and must be a string' },
                { status: 400 }
            );
        }

        if (resumeText.trim().length < 50) {
            return NextResponse.json(
                { error: 'Resume text is too short. Please provide a complete resume.' },
                { status: 400 }
            );
        }

        if (resumeText.length > 50000) {
            return NextResponse.json(
                { error: 'Resume text is too long. Maximum 50,000 characters allowed.' },
                { status: 400 }
            );
        }

        // Optional job description validation
        if (jobDescription && typeof jobDescription !== 'string') {
            return NextResponse.json(
                { error: 'Job description must be a string' },
                { status: 400 }
            );
        }

        // Call AI analysis
        const result = await analyzeResume(
            resumeText,
            jobDescription || undefined
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Analysis failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            analysis: result.data,
        });

    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred during analysis'
            },
            { status: 500 }
        );
    }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}