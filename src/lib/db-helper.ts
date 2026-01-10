import { prisma } from './prisma';
import { AnalysisResult, isJobMatchResult, isResumeAnalysisResult } from '@/types/analysis';

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

interface SaveAnalysisParams {
    userId: string;
    resumeText: string;
    jobDescription?: string;
    analysisResult: AnalysisResult;
    originalFileName?: string;
}

interface SaveAnalysisResponse {
    success: boolean;
    analysisId?: string;
    error?: string;
}

// Validates that the AI-generated analysis is complete and usable
export function validateAnalysisResult(analysis: AnalysisResult): {
    isValid: boolean;
    reason?: string;
} {
    if (!analysis) {
        return { isValid: false, reason: 'Analysis result is null or undefined' };
    }

    // Validate Job Match Analysis
    if (isJobMatchResult(analysis)) {
        if (typeof analysis.matchScore !== 'number' || analysis.matchScore < 0 || analysis.matchScore > 100) {
            return { isValid: false, reason: 'Invalid match score' };
        }

        if (!analysis.verdict || !['strong_match', 'good_match', 'moderate_match', 'weak_match'].includes(analysis.verdict)) {
            return { isValid: false, reason: 'Invalid or missing verdict' };
        }

        if (!analysis.summary || analysis.summary.length < 20) {
            return { isValid: false, reason: 'Summary is too short or missing' };
        }

        // Check for essential sections
        if (!analysis.keywordMatch && !analysis.skillsMatch) {
            return { isValid: false, reason: 'Missing keyword or skills match data' };
        }

        return { isValid: true };
    }

    // Validate Resume Analysis
    if (isResumeAnalysisResult(analysis)) {
        if (typeof analysis.overallScore !== 'number' || analysis.overallScore < 0 || analysis.overallScore > 100) {
            return { isValid: false, reason: 'Invalid overall score' };
        }

        if (!analysis.summary || analysis.summary.length < 20) {
            return { isValid: false, reason: 'Summary is too short or missing' };
        }

        // Optional: check for detailed analysis
        if (!analysis.detailedAnalysis && !analysis.strengths && !analysis.weaknesses) {
            return { isValid: false, reason: 'Missing detailed analysis sections' };
        }

        return { isValid: true };
    }

    return { isValid: false, reason: 'Unknown analysis type' };
}

//--- Saves analysis to database with proper validation and error handling
export async function saveAnalysisToDatabase(params: SaveAnalysisParams): Promise<SaveAnalysisResponse> {
    const { userId, resumeText, jobDescription, analysisResult, originalFileName } = params;

    try {
        // Validate analysis before saving
        const validation = validateAnalysisResult(analysisResult);
        if (!validation.isValid) {
            console.warn('Analysis validation failed:', validation.reason);
            return {
                success: false,
                error: `Analysis quality check failed: ${validation.reason}`,
            };
        }

        // Determine analysis type
        const analysisType = isJobMatchResult(analysisResult) ? 'job-match' : 'resume-analysis';

        // Extract data based on analysis type
        let overallScore: number;
        let compatibilityScore: number;
        let missingKeywords: string[];
        let foundKeywords: string[];
        let skillsMatch: any;
        let improvements: any[];

        if (isJobMatchResult(analysisResult)) {
            overallScore = Math.round(analysisResult.matchScore);
            compatibilityScore = Math.round(analysisResult.matchScore);
            missingKeywords = analysisResult.keywordMatch?.missing || [];
            foundKeywords = analysisResult.keywordMatch?.matched || [];
            skillsMatch = analysisResult.skillsMatch || {};
            improvements = analysisResult.recommendedChanges || [];
        } else {
            overallScore = Math.round(analysisResult.overallScore);
            compatibilityScore = Math.round(analysisResult.atsScore || analysisResult.overallScore);
            missingKeywords = analysisResult.detailedAnalysis?.keywords?.missing || [];
            foundKeywords = analysisResult.detailedAnalysis?.keywords?.present || [];
            skillsMatch = {};
            improvements = analysisResult.actionableSteps || [];
        }

        // Save to database
        const savedAnalysis = await prisma.analysis.create({
            data: {
                userId,
                resumeText: resumeText.substring(0, 10000), // Limit to 10k chars
                jobDescription: jobDescription?.substring(0, 5000) || '',
                originalFileName: originalFileName || null,
                overallScore,
                compatibilityScore,
                missingKeywords,
                foundKeywords,
                skillsMatch,
                improvements,
                analysisType,
            },
        });

        // Update user's analysis count and last analysis date
        await prisma.user.update({
            where: { id: userId },
            data: {
                analysesCount: { increment: 1 },
                lastAnalysisAt: new Date(),
            },
        });

        return {
            success: true,
            analysisId: savedAnalysis.id,
        };
    } catch (error) {
        console.error('❌ Database save error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save analysis',
        };
    }
}

//--- Retrieves analysis history for a user
export async function getUserAnalysisHistory(userId: string, limit: number = 10) {
    try {
        const analyses = await prisma.analysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                createdAt: true,
                overallScore: true,
                compatibilityScore: true,
                analysisType: true,
                originalFileName: true,
                jobDescription: true,
            },
        });

        return {
            success: true,
            analyses,
        };
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        return {
            success: false,
            error: 'Failed to fetch analysis history',
            analyses: [],
        };
    }
}

//--- Retrieves a single analysis by ID
export async function getAnalysisById(analysisId: string, userId: string) {
    try {
        const analysis = await prisma.analysis.findFirst({
            where: {
                id: analysisId,
                userId,
            },
        });

        if (!analysis) {
            return {
                success: false,
                error: 'Analysis not found',
            };
        }

        return {
            success: true,
            analysis,
        };
    } catch (error) {
        console.error('Error fetching analysis:', error);
        return {
            success: false,
            error: 'Failed to fetch analysis',
        };
    }
}

// ============================================
// COVER LETTER FUNCTIONS
// ============================================

interface SaveCoverLetterParams {
    userId: string;
    companyName: string;
    positionTitle: string;
    content: string;
    jobDescription: string;
}

interface SaveCoverLetterResponse {
    success: boolean;
    coverLetterId?: string;
    error?: string;
}

/**
 * Saves a generated cover letter to the database
 */
export async function saveCoverLetterToDatabase(
    params: SaveCoverLetterParams
): Promise<SaveCoverLetterResponse> {
    const { userId, companyName, positionTitle, content, jobDescription } = params;

    try {
        // Validate inputs
        if (!userId || !companyName || !positionTitle || !content) {
            return {
                success: false,
                error: 'Missing required fields',
            };
        }

        // Limit content length to prevent database issues
        const truncatedJobDesc = jobDescription.substring(0, 5000);
        const truncatedContent = content.substring(0, 20000);

        // Save to database
        const savedCoverLetter = await prisma.coverLetter.create({
            data: {
                userId,
                companyName: companyName.trim(),
                positionTitle: positionTitle.trim(),
                content: truncatedContent,
                jobDescription: truncatedJobDesc,
            },
        });

        console.log(`✅ Cover letter saved: ${savedCoverLetter.id}`);

        return {
            success: true,
            coverLetterId: savedCoverLetter.id,
        };
    } catch (error) {
        console.error('❌ Failed to save cover letter:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save cover letter',
        };
    }
}

/**
 * Retrieves cover letter history for a user
 */
export async function getUserCoverLetters(userId: string, limit: number = 20) {
    try {
        const coverLetters = await prisma.coverLetter.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                companyName: true,
                positionTitle: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            success: true,
            coverLetters,
            total: coverLetters.length,
        };
    } catch (error) {
        console.error('❌ Error fetching cover letters:', error);
        return {
            success: false,
            error: 'Failed to fetch cover letters',
            coverLetters: [],
            total: 0,
        };
    }
}

/**
 * Retrieves a single cover letter by ID
 */
export async function getCoverLetterById(coverLetterId: string, userId: string) {
    try {
        const coverLetter = await prisma.coverLetter.findFirst({
            where: {
                id: coverLetterId,
                userId, // Ensure user owns this cover letter
            },
        });

        if (!coverLetter) {
            return {
                success: false,
                error: 'Cover letter not found',
            };
        }

        return {
            success: true,
            coverLetter,
        };
    } catch (error) {
        console.error('❌ Error fetching cover letter:', error);
        return {
            success: false,
            error: 'Failed to fetch cover letter',
        };
    }
}

/**
 * Deletes a cover letter
 */
export async function deleteCoverLetter(coverLetterId: string, userId: string) {
    try {
        // First verify the cover letter belongs to the user
        const coverLetter = await prisma.coverLetter.findFirst({
            where: {
                id: coverLetterId,
                userId,
            },
        });

        if (!coverLetter) {
            return {
                success: false,
                error: 'Cover letter not found or unauthorized',
            };
        }

        // Delete the cover letter
        await prisma.coverLetter.delete({
            where: { id: coverLetterId },
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error('❌ Error deleting cover letter:', error);
        return {
            success: false,
            error: 'Failed to delete cover letter',
        };
    }
}