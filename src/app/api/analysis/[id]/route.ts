import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAnalysisById } from '@/lib/db-helper';
import { prisma } from '@/lib/prisma';

// GET - Fetch single analysis
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Await params before using
        const { id } = await params;

        const result = await getAnalysisById(id, session.user.id);

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
        console.error('Error fetching analysis:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analysis' },
            { status: 500 }
        );
    }
}

// DELETE - Delete analysis
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Await params before using
        const { id } = await params;

        // Verify ownership and delete
        const analysis = await prisma.analysis.findFirst({
            where: {
                id: id,
                userId: session.user.id,
            },
        });

        if (!analysis) {
            return NextResponse.json(
                { error: 'Analysis not found' },
                { status: 404 }
            );
        }

        await prisma.analysis.delete({
            where: { id: id },
        });

        // Update user's analysis count
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                analysesCount: { decrement: 1 },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Analysis deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting analysis:', error);
        return NextResponse.json(
            { error: 'Failed to delete analysis' },
            { status: 500 }
        );
    }
}
