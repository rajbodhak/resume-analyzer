import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { analyzeResume } from '@/lib/ai';
import { analysisRateLimit } from '@/lib/rate-limit';
import { validateAnalysisResult, saveAnalysisToDatabase } from '@/lib/db-helper';

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIp) return realIp;
    if (cfConnectingIp) return cfConnectingIp;
    return 'anonymous';
}

export async function POST(request: NextRequest) {
    try {
        // Get session to check if user is logged in
        const session = await getServerSession(authOptions);
        const isAuthenticated = !!session?.user;

        // Parse request body
        const body = await request.json();
        const { resumeText, jobDescription, isAnonymous } = body;

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

        if (jobDescription && typeof jobDescription !== 'string') {
            return NextResponse.json(
                { error: 'Job description must be a string' },
                { status: 400 }
            );
        }

        // Rate limiting ONLY for authenticated users
        if (isAuthenticated && session.user?.id) {
            const userId = session.user.id;

            // Apply rate limit: 10 analyses per hour
            const rateLimitResult = analysisRateLimit.checkWithInfo(10, userId);

            if (!rateLimitResult.success) {
                return NextResponse.json(
                    {
                        error: `Rate limit exceeded. You can perform ${rateLimitResult.limit} analyses per hour. Please try again later.`,
                        remaining: rateLimitResult.remaining,
                        reset: rateLimitResult.reset,
                    },
                    { status: 429 }
                );
            }

            console.log(`Rate limit check passed. Remaining: ${rateLimitResult.remaining}`);
        } else {
            // Anonymous users - no rate limiting on backend
            console.log('Anonymous user analysis - no rate limiting applied');
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

        // Validate analysis result before saving
        const analysisData = result.data;
        const validation = validateAnalysisResult(analysisData);

        if (!validation.isValid) {
            console.warn('⚠️ Invalid analysis result:', validation.reason);

            // Return the result but warn that it wasn't saved
            return NextResponse.json({
                success: false,
                error: `Analysis incomplete: ${validation.reason}. Please try again.`,
                analysis: analysisData,
                saved: false,
            }, { status: 422 });
        }

        // Save to database ONLY for authenticated users with valid results
        if (isAuthenticated && session.user?.id) {
            const saveResult = await saveAnalysisToDatabase({
                userId: session.user.id,
                resumeText,
                jobDescription,
                analysisResult: analysisData,
                originalFileName: undefined,
            });

            if (!saveResult.success) {
                console.error('❌ Failed to save analysis:', saveResult.error);
                // Still return the analysis even if save fails
                return NextResponse.json({
                    success: true,
                    analysis: analysisData,
                    saved: false,
                    warning: 'Analysis completed but could not be saved to history',
                });
            }

            console.log(`✅ Analysis saved with ID: ${saveResult.analysisId}`);

            return NextResponse.json({
                success: true,
                analysis: analysisData,
                analysisId: saveResult.analysisId,
                saved: true,
            });
        }

        // For anonymous users - return analysis without saving
        return NextResponse.json({
            success: true,
            analysis: analysisData,
            saved: false,
            message: 'Analysis completed. Sign in to save your analysis history.',
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