import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAnalysisById } from '@/lib/db-helper';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const result = await getAnalysisById(params.id, session.user.id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: result.error === 'Analysis not found' ? 404 : 500 }
            );
        }

        return NextResponse.json({
            success: true,
            analysis: result.analysis,
        });
    } catch (error) {
        console.error('Error in analysis detail API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analysis' },
            { status: 500 }
        );
    }
}