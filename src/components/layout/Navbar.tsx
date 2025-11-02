'use client';

import { useState } from 'react';
import { Logo } from '../navbar/Logo';
import { UserMenu } from '../navbar/UserMenu';
import { SignOutModal } from '../navbar/SignOutModal';

export interface NavbarProps {
    logo?: React.ReactNode;
    logoHref?: string;
    logoText?: string;
    className?: string;
    isAuthenticated?: boolean;
    userName?: string;
    onSignInClick?: () => void;
    onSignUpClick?: () => void;
    onSignOutClick?: () => void;
    onDashboardClick?: () => void;
    onHistoryClick?: () => void;
    onSettingsClick?: () => void;
    onNewAnalysisClick?: () => void;
}

export default function Navbar({
    logo = <Logo />,
    logoHref = '/',
    logoText = 'Resume Analyzer',
    className = '',
    isAuthenticated = false,
    userName = 'User',
    onSignInClick,
    onSignUpClick,
    onSignOutClick,
    onDashboardClick,
    onHistoryClick,
    onSettingsClick,
    onNewAnalysisClick,
}: NavbarProps) {
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const handleSignOutClick = () => {
        setShowSignOutModal(true);
    };

    const handleSignOutConfirm = () => {
        setShowSignOutModal(false);
        onSignOutClick?.();
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-6 backdrop-blur-md bg-background/80 border-b border-border/40 ${className}`}>
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    {/* Left side - Logo */}
                    <a
                        href={logoHref}
                        className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
                    >
                        <div className="text-2xl">{logo}</div>
                        <span className="font-bold text-xl hidden sm:inline">{logoText}</span>
                    </a>

                    {/* Right side - Navigation */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {/* Desktop Navigation Links */}
                                <nav className="hidden md:flex items-center gap-1">
                                    <button
                                        onClick={onDashboardClick}
                                        className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={onHistoryClick}
                                        className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        History
                                    </button>
                                </nav>

                                {/* New Analysis Button */}
                                <button
                                    onClick={onNewAnalysisClick}
                                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="hidden sm:inline">New Analysis</span>
                                </button>

                                {/* User Menu */}
                                <UserMenu
                                    userName={userName}
                                    onDashboardClick={onDashboardClick}
                                    onHistoryClick={onHistoryClick}
                                    onSettingsClick={onSettingsClick}
                                    onSignOutClick={handleSignOutClick}
                                />
                            </>
                        ) : (
                            <>
                                {/* Sign In Button */}
                                <button
                                    onClick={onSignInClick}
                                    className="text-sm font-medium px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    Sign In
                                </button>

                                {/* Sign Up Button */}
                                <button
                                    onClick={onSignUpClick}
                                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header >

            {/* Sign Out Confirmation Modal */}
            < SignOutModal
                isOpen={showSignOutModal}
                onClose={() => setShowSignOutModal(false)
                }
                onConfirm={handleSignOutConfirm}
            />
        </>
    );
}