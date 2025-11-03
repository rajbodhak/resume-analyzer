'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import Navbar from "./Navbar";

interface NavbarWrapperProps {
    initialSession: Session | null;
}

export default function NavbarWrapper({ initialSession }: NavbarWrapperProps) {
    const { data: clientSession } = useSession();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    // Initialize Zustand store with server session on mount
    useEffect(() => {
        if (initialSession?.user && !user) {
            setUser({
                id: initialSession.user.id,
                email: initialSession.user.email ?? '',
                name: initialSession.user.name ?? undefined,
                image: initialSession.user.image ?? undefined,
                subscriptionTier: initialSession.user.subscriptionTier,
                creditsRemaining: initialSession.user.creditsRemaining,
                analysesCount: initialSession.user.analysesCount,
            });
        }
    }, [initialSession, user, setUser]);

    // Use client session if available, otherwise use initial server session
    const currentSession = clientSession ?? initialSession;
    const isAuthenticated = !!currentSession?.user;
    const userName = currentSession?.user?.name || currentSession?.user?.email || 'User';

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
            useAuthStore.getState().setUser(null);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <Navbar
            logoText="Resume Analyzer"
            logoHref="/"
            isAuthenticated={isAuthenticated}
            userName={userName}

            // Non-authenticated actions
            onSignInClick={() => {
                window.location.href = '/auth/signin';
            }}
            onSignUpClick={() => {
                window.location.href = '/auth/signup';
            }}

            // Authenticated actions
            onDashboardClick={() => {
                window.location.href = '/dashboard';
            }}
            onHistoryClick={() => {
                window.location.href = '/dashboard/history';
            }}
            onSettingsClick={() => {
                window.location.href = '/dashboard/settings';
            }}
            onNewAnalysisClick={() => {
                window.location.href = '/upload';
            }}
            onSignOutClick={handleSignOut}
        />
    );
}