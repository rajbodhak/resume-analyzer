'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { UploadSection } from '@/components/upload/UploadSection';
import { AnalysisResults } from '@/components/upload/AnalysisResults';
import { AlertCircle, LogIn, Clock } from 'lucide-react';
import Link from 'next/link';

const AlertBox = ({ variant, title, message, action }: { variant: string; title?: string; message: string; action?: React.ReactNode }) => {
    const getVariantClasses = () => {
        if (variant === 'warning') return 'border-yellow-500/30 bg-yellow-500/10';
        if (variant === 'error') return 'border-red-500/30 bg-red-500/10';
        return 'border-orange-500/30 bg-orange-500/10';
    };

    const getTextColor = () => {
        if (variant === 'warning') return 'text-yellow-500';
        if (variant === 'error') return 'text-red-500';
        return 'text-orange-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-xl border ${getVariantClasses()} p-4 md:p-5`}
        >
            <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getTextColor()}`} />
                <div className="flex-1">
                    {title && <h3 className={`font-semibold mb-1 ${getTextColor()}`}>{title}</h3>}
                    <p className="text-sm text-neutral-300">{message}</p>
                    {action}
                </div>
            </div>
        </motion.div>
    );
};

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

    useEffect(() => {
        if (!isAuthenticated && isMounted) {
            const updateTimer = () => {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    try {
                        JSON.parse(authStorage);
                        setTimeUntilReset('24 hours after first use');
                    } catch (e) {
                        setTimeUntilReset('');
                    }
                }
            };
            updateTimer();
            const interval = setInterval(updateTimer, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, isMounted]);

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 md:mb-12 text-center"
                >
                    <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                        Analyze Your Resume
                    </h1>
                    <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
                        Upload your resume and get instant AI-powered feedback
                    </p>

                    {/* Credit Counter */}
                    {isMounted && remainingCredits >= 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 md:mt-6 inline-flex flex-col items-center gap-2"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/20">
                                <AlertCircle className="h-4 w-4" />
                                <span>
                                    {isAuthenticated
                                        ? remainingCredits > 0
                                            ? `${remainingCredits} ${remainingCredits === 1 ? 'credit' : 'credits'} remaining`
                                            : 'No credits remaining'
                                        : remainingCredits > 0
                                            ? `${remainingCredits} free ${remainingCredits === 1 ? 'analysis' : 'analyses'} remaining`
                                            : 'No free analyses remaining'
                                    }
                                </span>
                            </div>

                            {!isAuthenticated && remainingCredits < 3 && timeUntilReset && (
                                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Resets {timeUntilReset}</span>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {!isMounted && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-800/50 px-4 py-2 text-sm text-neutral-500">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-transparent" />
                            <span>Loading credits...</span>
                        </div>
                    )}
                </motion.div>

                {/* Alerts */}
                {needsLogin && !isAuthenticated && (
                    <AlertBox
                        variant="warning"
                        title="Free Analyses Used"
                        message="You've used all 3 free analyses. Sign in to get 50 credits and save your results!"
                        action={
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-400 transition-colors mt-3"
                            >
                                <LogIn className="h-4 w-4" />
                                Sign In to Get 50 Credits
                            </Link>
                        }
                    />
                )}

                {isAuthenticated && isMounted && remainingCredits === 0 && (
                    <AlertBox
                        variant="error"
                        title="No Credits Remaining"
                        message="You've used all your credits. Please contact support to get more credits."
                    />
                )}

                {isAuthenticated && isMounted && remainingCredits > 0 && remainingCredits <= 5 && (
                    <AlertBox
                        variant="info"
                        message={`You have ${remainingCredits} ${remainingCredits === 1 ? 'credit' : 'credits'} remaining. Plan accordingly!`}
                    />
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

                {/* Results */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 md:mt-8"
                    >
                        <AnalysisResults
                            result={analysisResult}
                            onAnalyzeAnother={removeFile}
                            resumeText={resumeText}
                        />
                    </motion.div>
                )}

                {/* Bottom CTA */}
                {!isAuthenticated && remainingCredits > 0 && !needsLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 md:mt-12 text-center"
                    >
                        <div className="inline-block rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 md:p-6 backdrop-blur-sm">
                            <p className="text-sm md:text-base text-neutral-400 mb-3">
                                Want 50 credits and save your results?
                            </p>
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20"
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