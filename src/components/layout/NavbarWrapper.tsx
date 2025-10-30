'use client';

import Navbar from "./Navbar";

export default function NavbarWrapper() {
    return (
        <Navbar
            logoText="Resume Analyzer"
            logoHref="/"
            signInText="Sign In"
            ctaText="Get Started"
            onSignInClick={() => {
                window.location.href = '/auth/signin';
            }}
            onCtaClick={() => {
                window.location.href = '/upload';
            }}
        />
    );
}

