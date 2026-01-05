'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { signOut, useSession } from 'next-auth/react';
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const { data: session, status } = useSession();
    const user = useAuthStore((state) => state.user);

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
            logoText="Resume Analyzer"
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
            onSignOutClick={handleSignOut}
        />
    );
}