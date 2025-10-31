'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = !!user;

    return (
        <Navbar
            logoText="Resume Analyzer"
            logoHref="/"
            signInText="Sign In"
            dashboardText="Dashboard"
            ctaText="Get Started"
            isAuthenticated={isAuthenticated}
            onSignInClick={() => {
                window.location.href = '/auth/signin';
            }}
            onDashboardClick={() => {
                window.location.href = '/dashboard';
            }}
            onCtaClick={() => {
                window.location.href = '/upload';
            }}
        />
    );
}