'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { signOut, useSession } from 'next-auth/react';
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const { data: session, status } = useSession();
    const user = useAuthStore((state) => state.user);

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-6 backdrop-blur-md bg-background/80 border-b border-border/40">
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    {/* Logo skeleton */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                        <div className="w-32 h-6 bg-muted rounded animate-pulse hidden sm:block" />
                    </div>

                    {/* Right side skeleton */}
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-9 bg-muted rounded animate-pulse" />
                        <div className="w-24 h-9 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </header>
        );
    }

    const isAuthenticated = status === 'authenticated' && !!session?.user;
    const userName = session?.user?.name || session?.user?.email || user?.name || user?.email || 'User';

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <Navbar
            logoText="Rezumify"
            logoHref="/"
            isAuthenticated={isAuthenticated}
            userName={userName}
            onSignInClick={() => {
                window.location.href = '/auth/signin';
            }}
            onSignUpClick={() => {
                window.location.href = '/auth/signup';
            }}
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
            onCoverLetterClick={() => {
                window.location.href = '/dashboard/cover-letter';
            }}
            onSignOutClick={handleSignOut}
        />
    );
}