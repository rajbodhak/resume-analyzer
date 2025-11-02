'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { signOut } from 'next-auth/react';
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = !!user;

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
            // Clear auth store if needed
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
            userName={user?.name || user?.email || 'User'}

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