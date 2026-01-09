'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { UploadSection } from '@/components/upload/UploadSection';
import { AnalysisResults } from '@/components/upload/AnalysisResults';
import { AlertCircle, LogIn, Clock } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
    const {
        file,
        jobDescription,
        setJobDescription,
        isParsing,
        isAnalyzing,
        analysisResult,
        error,
        handleFileSelect,
        removeFile,
        analyzeResume,
        remainingCredits,
        needsLogin,
        isAuthenticated,
        isMounted,
        resumeText,
    } = useResumeAnalysis();

    const [timeUntilReset, setTimeUntilReset] = useState<string>('');

    // Calculate time until reset for anonymous users
    useEffect(() => {
        if (!isAuthenticated && isMounted) {
            const updateTimer = () => {
                // Get reset time from localStorage if available
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    try {
                        const parsed = JSON.parse(authStorage);
                        // You can add resetAt to your store if needed
                        // For now, we'll just show a generic message
                        setTimeUntilReset('24 hours after first use');
                    } catch (e) {
                        setTimeUntilReset('');
                    }
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 60000); // Update every minute

            return () => clearInterval(interval);
        }
    }, [isAuthenticated, isMounted]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 md:mt-6 md:px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                        Analyze Your Resume
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Upload your resume and get instant AI-powered feedback
                    </p>

                    {/* Credit Counter - Shows for BOTH anonymous and authenticated users */}
                    {isMounted && remainingCredits >= 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 inline-flex flex-col items-center gap-2"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/20">
                                <AlertCircle className="h-4 w-4" />
                                <span>
                                    {isAuthenticated ? (
                                        // Authenticated user - show actual credits
                                        remainingCredits > 0 ? (
                                            `${remainingCredits} ${remainingCredits === 1 ? 'credit' : 'credits'} remaining`
                                        ) : (
                                            'No credits remaining'
                                        )
                                    ) : (
                                        // Anonymous user - show free analyses
                                        remainingCredits > 0 ? (
                                            `${remainingCredits} free ${remainingCredits === 1 ? 'analysis' : 'analyses'} remaining`
                                        ) : (
                                            'No free analyses remaining'
                                        )
                                    )}
                                </span>
                            </div>

                            {/* Reset Timer for Anonymous Users */}
                            {!isAuthenticated && remainingCredits < 3 && timeUntilReset && (
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Resets {timeUntilReset}</span>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Loading state for credits */}
                    {!isMounted && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-2 text-sm text-neutral-500">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-transparent" />
                            <span>Loading credits...</span>
                        </div>
                    )}
                </motion.div>

                {/* Login Prompt (shown when credits exhausted) */}
                {needsLogin && !isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-500 mb-1">
                                    Free Analyses Used
                                </h3>
                                <p className="text-sm text-neutral-300 mb-3">
                                    You've used all 3 free analyses. Sign in to get 50 credits and save your results!
                                </p>
                                <Link
                                    href="/auth/signin"
                                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-400 transition-colors"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Sign In to Get 50 Credits
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* No Credits Warning for Authenticated Users */}
                {isAuthenticated && isMounted && remainingCredits === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-500 mb-1">
                                    No Credits Remaining
                                </h3>
                                <p className="text-sm text-neutral-300">
                                    You've used all your credits. Please contact support to get more credits.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Low Credits Warning for Authenticated Users */}
                {isAuthenticated && isMounted && remainingCredits > 0 && remainingCredits <= 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-neutral-300">
                                    You have {remainingCredits} {remainingCredits === 1 ? 'credit' : 'credits'} remaining. Plan accordingly!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <UploadSection
                        file={file}
                        jobDescription={jobDescription}
                        setJobDescription={setJobDescription}
                        isParsing={isParsing}
                        isAnalyzing={isAnalyzing}
                        error={error}
                        hasResult={!!analysisResult}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={removeFile}
                        onAnalyze={analyzeResume}
                        remainingCredits={remainingCredits}
                        isAuthenticated={isAuthenticated}
                    />
                </motion.div>

                {/* Results Section */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <AnalysisResults
                            result={analysisResult}
                            onAnalyzeAnother={removeFile}
                            resumeText={resumeText}
                        />
                    </motion.div>
                )}

                {/* Bottom CTA for Anonymous Users with Credits */}
                {!isAuthenticated && remainingCredits > 0 && !needsLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-block rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
                            <p className="text-neutral-400 mb-3">
                                Want 50 credits and save your results?
                            </p>
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
                            >
                                <LogIn className="h-4 w-4" />
                                Sign In to Get 50 Credits
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}