import { prisma } from './prisma';
import { AnalysisResult, isJobMatchResult, isResumeAnalysisResult } from '@/types/analysis';

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