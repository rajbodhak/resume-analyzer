import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { analyzeResume } from '@/lib/ai';
import { analysisRateLimit, anonymousAnalysisLimit } from '@/lib/rate-limit';
import { validateAnalysisResult } from '@/lib/db-helper';
import { prisma } from '@/lib/prisma';
import { isJobMatchResult, isResumeAnalysisResult } from '@/types/analysis';

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

        // CHECK CREDITS AND RATE LIMITS
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

        } else {
            // ANONYMOUS USERS - CHECK IP-BASED LIMIT
            const clientIp = getClientIp(request);
            console.log('Anonymous analysis from IP:', clientIp);

            const anonymousCheck = anonymousAnalysisLimit.checkAnonymousUser(clientIp);

            if (!anonymousCheck.allowed) {
                return NextResponse.json(
                    {
                        error: anonymousCheck.message || 'Free analysis limit reached. Please sign in to continue.',
                        remaining: 0,
                        resetAt: anonymousCheck.resetAt,
                        needsLogin: true,
                    },
                    { status: 429 }
                );
            }

            console.log(`Anonymous user has ${anonymousCheck.remaining} analyses remaining`);
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

            // Extract data based on analysis type using type guards
            let overallScore: number;
            let compatibilityScore: number;
            let missingKeywords: string[];
            let foundKeywords: string[];
            let skillsMatch: any;
            let improvements: any[];
            let analysisType: 'job-match' | 'resume-analysis';

            if (isJobMatchResult(analysisData)) {
                // Job Match Analysis
                analysisType = 'job-match';
                overallScore = Math.round(analysisData.matchScore);
                compatibilityScore = Math.round(analysisData.matchScore);
                missingKeywords = analysisData.keywordMatch?.missing || [];
                foundKeywords = analysisData.keywordMatch?.matched || [];
                skillsMatch = analysisData.skillsMatch || {};
                improvements = analysisData.recommendedChanges || [];
            } else if (isResumeAnalysisResult(analysisData)) {
                // Resume Analysis
                analysisType = 'resume-analysis';
                overallScore = Math.round(analysisData.overallScore);
                compatibilityScore = Math.round(analysisData.atsScore || analysisData.overallScore);
                missingKeywords = analysisData.detailedAnalysis?.keywords?.missing || [];
                foundKeywords = analysisData.detailedAnalysis?.keywords?.present || [];
                skillsMatch = {};
                improvements = analysisData.actionableSteps || [];
            } else {
                // Fallback for unknown type
                analysisType = jobDescription ? 'job-match' : 'resume-analysis';
                overallScore = 0;
                compatibilityScore = 0;
                missingKeywords = [];
                foundKeywords = [];
                skillsMatch = {};
                improvements = [];
            }

            // DECREMENT CREDITS AND SAVE ANALYSIS IN A TRANSACTION
            try {
                const transactionResult = await prisma.$transaction(async (tx) => {
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

                    // 2. Save analysis with properly extracted data
                    const analysis = await tx.analysis.create({
                        data: {
                            userId,
                            resumeText: resumeText.substring(0, 10000), // Limit text length
                            jobDescription: jobDescription?.substring(0, 5000) || '',
                            originalFileName: body.originalFileName || null,
                            overallScore,
                            compatibilityScore,
                            missingKeywords,
                            foundKeywords,
                            skillsMatch,
                            improvements,
                            analysisType,
                        }
                    });

                    return {
                        analysisId: analysis.id,
                        creditsRemaining: updatedUser.creditsRemaining,
                        analysesCount: updatedUser.analysesCount,
                    };
                });

                return NextResponse.json({
                    success: true,
                    analysis: analysisData,
                    analysisId: transactionResult.analysisId,
                    saved: true,
                    creditsRemaining: transactionResult.creditsRemaining,
                    analysesCount: transactionResult.analysesCount,
                });

            } catch (dbError) {
                console.error('❌ Database transaction failed:', dbError);
                return NextResponse.json({
                    success: false,
                    error: 'Failed to save analysis and update credits. Please try again.',
                }, { status: 500 });
            }
        }

        // For anonymous users - return analysis with remaining credits info
        const clientIp = getClientIp(request);
        const anonymousStatus = anonymousAnalysisLimit.getAnonymousStatus(clientIp);

        return NextResponse.json({
            success: true,
            analysis: analysisData,
            saved: false,
            message: 'Analysis completed. Sign in to save your analysis history.',
            anonymousCreditsRemaining: anonymousStatus.remaining,
            resetAt: anonymousStatus.resetAt,
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