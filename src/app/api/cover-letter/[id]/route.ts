import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteCoverLetter, getCoverLetterById } from '@/lib/db-helper';

export async function GET(
    req: NextRequest,
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

        const result = await getCoverLetterById(params.id, session.user.id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            coverLetter: result.coverLetter,
        });
    } catch (error) {
        console.error('Error fetching cover letter:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cover letter' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
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

        const result = await deleteCoverLetter(params.id, session.user.id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Cover letter deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        return NextResponse.json(
            { error: 'Failed to delete cover letter' },
            { status: 500 }
        );
    }
}