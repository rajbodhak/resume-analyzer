import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                phoneNumber: true,
                industry: true,
                targetRole: true,
                experienceLevel: true,
                preferredLocation: true,
                subscriptionTier: true,
                creditsRemaining: true,
                analysesCount: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            name,
            phoneNumber,
            industry,
            targetRole,
            experienceLevel,
            preferredLocation,
        } = body;

        // Validate inputs
        if (name && typeof name !== 'string') {
            return NextResponse.json(
                { error: 'Invalid name format' },
                { status: 400 }
            );
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(phoneNumber !== undefined && { phoneNumber: phoneNumber.trim() }),
                ...(industry !== undefined && { industry }),
                ...(targetRole !== undefined && { targetRole: targetRole.trim() }),
                ...(experienceLevel !== undefined && { experienceLevel }),
                ...(preferredLocation !== undefined && { preferredLocation: preferredLocation.trim() }),
                updatedAt: new Date(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                industry: true,
                targetRole: true,
                experienceLevel: true,
                preferredLocation: true,
                subscriptionTier: true,
                creditsRemaining: true,
                analysesCount: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}