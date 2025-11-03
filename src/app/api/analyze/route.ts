import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { analyzeResume } from '@/lib/ai';
import { analysisRateLimit } from '@/lib/rate-limit';
import { validateAnalysisResult, saveAnalysisToDatabase } from '@/lib/db-helper';
import { prisma } from '@/lib/prisma';

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

        //CHECK CREDITS FOR AUTHENTICATED USERS
        if (isAuthenticated && session.user?.id) {
            const userId = session.user.id;

            // Fetch current user credits from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { creditsRemaining: true }
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // Check if user has credits remaining
            if (user.creditsRemaining <= 0) {
                return NextResponse.json(
                    {
                        error: 'No credits remaining. Please upgrade your plan or contact support.',
                        creditsRemaining: 0,
                    },
                    { status: 403 }
                );
            }

            console.log(`User has ${user.creditsRemaining} credits remaining`);

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
            const userId = session.user.id;

            // DECREMENT CREDITS AND SAVE ANALYSIS IN A TRANSACTION
            try {
                const result = await prisma.$transaction(async (tx) => {
                    // 1. Decrement user credits
                    const updatedUser = await tx.user.update({
                        where: { id: userId },
                        data: {
                            creditsRemaining: { decrement: 1 },
                            analysesCount: { increment: 1 },
                            lastAnalysisAt: new Date(),
                        },
                        select: {
                            creditsRemaining: true,
                            analysesCount: true,
                        }
                    });

                    // 2. Save analysis
                    const analysis = await tx.analysis.create({
                        data: {
                            userId,
                            resumeText,
                            jobDescription: jobDescription || '',
                            originalFileName: undefined,
                            overallScore: analysisData.overallScore,
                            compatibilityScore: analysisData.compatibilityScore ?? null,
                            missingKeywords: analysisData.missingKeywords ?? [], // Default to empty array
                            foundKeywords: analysisData.foundKeywords ?? [], // Default to empty array
                            skillsMatch: analysisData.skillsMatch ?? {}, // Default to empty object
                            improvements: analysisData.improvements ?? [], // Default to empty array
                            analysisType: jobDescription ? 'job-match' : 'resume-analysis',
                        }
                    });

                    return {
                        analysisId: analysis.id,
                        creditsRemaining: updatedUser.creditsRemaining,
                        analysesCount: updatedUser.analysesCount,
                    };
                });

                console.log(`Analysis saved. Credits remaining: ${result.creditsRemaining}`);

                return NextResponse.json({
                    success: true,
                    analysis: analysisData,
                    analysisId: result.analysisId,
                    saved: true,
                    creditsRemaining: result.creditsRemaining,
                    analysesCount: result.analysesCount,
                });

            } catch (dbError) {
                console.error('❌ Database transaction failed:', dbError);
                return NextResponse.json({
                    success: false,
                    error: 'Failed to save analysis and update credits. Please try again.',
                }, { status: 500 });
            }
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