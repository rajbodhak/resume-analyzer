import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user data
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                analysesCount: true,
                lastAnalysisAt: true,
            },
        });

        // Fetch recent analyses (last 5)
        const recentAnalyses = await prisma.analysis.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
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

        return NextResponse.json({
            user,
            recentAnalyses,
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}