import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateCoverLetter } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            resumeText,
            jobDescription,
            companyName,
            positionTitle,
            candidateName
        } = body;

        // Validate required fields
        if (!resumeText || !jobDescription || !companyName || !positionTitle) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate cover letter using AI
        const result = await generateCoverLetter(
            resumeText,
            jobDescription,
            companyName,
            positionTitle,
            candidateName || session.user.name || 'Candidate'
        );

        if (!result.success || !result.data) {
            return NextResponse.json(
                { error: result.error || 'Failed to generate cover letter' },
                { status: 500 }
            );
        }

        // Optional: Save to database for history
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (user) {
            await prisma.coverLetter.create({
                data: {
                    userId: user.id,
                    companyName,
                    positionTitle,
                    content: result.data.coverLetter, // Now TypeScript knows this exists
                    jobDescription,
                }
            });
        }

        return NextResponse.json({
            success: true,
            coverLetter: result.data.coverLetter,
            companyName,
            positionTitle,
        });

    } catch (error) {
        console.error('Cover letter generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user's cover letter history
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                coverLetters: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        return NextResponse.json({
            success: true,
            coverLetters: user?.coverLetters || []
        });

    } catch (error) {
        console.error('Error fetching cover letters:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cover letters' },
            { status: 500 }
        );
    }
}