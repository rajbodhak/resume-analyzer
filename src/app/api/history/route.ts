import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserAnalysisHistory, getUserCoverLetters } from '@/lib/db-helper';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Please sign in to view your history' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const type = searchParams.get('type') || 'all'; // 'all', 'analysis', 'cover-letter'

        // Fetch both analyses and cover letters
        const [analysisResult, coverLetterResult] = await Promise.all([
            type === 'cover-letter' ? { success: true, analyses: [] } : getUserAnalysisHistory(session.user.id, limit),
            type === 'analysis' ? { success: true, coverLetters: [], total: 0 } : getUserCoverLetters(session.user.id, limit),
        ]);

        if (!analysisResult.success || !coverLetterResult.success) {
            return NextResponse.json(
                { error: 'Failed to fetch history' },
                { status: 500 }
            );
        }

        // Transform analyses to unified format
        const analyses = (analysisResult.analyses || []).map((analysis: any) => ({
            id: analysis.id,
            type: 'analysis',
            createdAt: analysis.createdAt,
            overallScore: analysis.overallScore,
            compatibilityScore: analysis.compatibilityScore,
            analysisType: analysis.analysisType,
            originalFileName: analysis.originalFileName,
            jobDescription: analysis.jobDescription,
        }));

        // Transform cover letters to unified format
        const coverLetters = (coverLetterResult.coverLetters || []).map((letter: any) => ({
            id: letter.id,
            type: 'cover-letter',
            createdAt: letter.createdAt,
            companyName: letter.companyName,
            positionTitle: letter.positionTitle,
            content: letter.content,
        }));

        // Combine and sort by date
        const combined = [...analyses, ...coverLetters].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Apply limit to combined results
        const limited = combined.slice(0, limit);

        return NextResponse.json({
            success: true,
            items: limited,
            analyses: analysisResult.analyses || [],
            coverLetters: coverLetterResult.coverLetters || [],
            total: combined.length,
        });
    } catch (error) {
        console.error('Error in history API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch history' },
            { status: 500 }
        );
    }
}