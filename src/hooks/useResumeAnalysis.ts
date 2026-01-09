'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnalysisResult } from '../types/analysis';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSession } from 'next-auth/react';

export function useResumeAnalysis() {
    const { data: session, update: updateSession } = useSession();
    const {
        user,
        hasCreditsAvailable,
        getRemainingCredits,
        decrementAnonymousCredit,
        updateCredits,
    } = useAuthStore();

    const isAuthenticated = !!user;

    // FIX: Only get credits on client-side after mount
    const [remainingCredits, setRemainingCredits] = useState(-1);
    const [isMounted, setIsMounted] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [needsLogin, setNeedsLogin] = useState(false);

    // Update credits only on client-side
    useEffect(() => {
        setIsMounted(true);
        if (isAuthenticated && session?.user?.creditsRemaining !== undefined) {
            // Show actual credits for authenticated users
            setRemainingCredits(session.user.creditsRemaining);
        } else {
            // Show anonymous credits
            setRemainingCredits(getRemainingCredits());
        }
    }, [isAuthenticated, session, getRemainingCredits]);

    const validateFile = useCallback((selectedFile: File): boolean => {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or DOCX file');
            return false;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return false;
        }

        return true;
    }, []);

    const handleFileSelect = useCallback((selectedFile: File) => {
        if (!selectedFile) return;

        if (!validateFile(selectedFile)) {
            return;
        }

        setFile(selectedFile);
        setError(null);
        setAnalysisResult(null);
        setResumeText('');
        setNeedsLogin(false);
    }, [validateFile]);

    const removeFile = useCallback(() => {
        setFile(null);
        setError(null);
        setAnalysisResult(null);
        setResumeText('');
        setJobDescription('');
        setNeedsLogin(false);
    }, []);

    const parseResume = useCallback(async (): Promise<string | null> => {
        if (!file) return null;

        setIsParsing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to parse resume');
            }

            setResumeText(data.text);
            return data.text;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to parse resume';
            setError(errorMessage);
            return null;
        } finally {
            setIsParsing(false);
        }
    }, [file]);

    const analyzeResume = useCallback(async () => {
        if (!file) return;

        // CHECK CREDITS BEFORE ANALYSIS (CLIENT-SIDE CHECK)
        if (isAuthenticated) {
            // For authenticated users, check session credits
            if (session?.user?.creditsRemaining !== undefined && session.user.creditsRemaining <= 0) {
                setNeedsLogin(false);
                setError('You have used all your credits. Please contact support to get more.');
                return;
            }
        } else {
            // For anonymous users, check Zustand store
            if (!hasCreditsAvailable()) {
                setNeedsLogin(true);
                setError('You have used all 3 free analyses. Please sign in to get 50 credits.');
                return;
            }
        }

        setIsAnalyzing(true);
        setError(null);
        setNeedsLogin(false);

        try {
            // Parse resume if not already parsed
            let text = resumeText;
            if (!text) {
                text = (await parseResume()) || "";
                if (!text) {
                    throw new Error('Failed to extract text from resume');
                }
            }

            // SEND REQUEST TO BACKEND (backend will handle credit decrement)
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeText: text,
                    jobDescription: jobDescription.trim() || undefined,
                    isAnonymous: !isAuthenticated,
                }),
            });

            const data = await response.json();

            // Handle rate limit or credit errors
            if (response.status === 429) {
                if (data.needsLogin) {
                    setNeedsLogin(true);
                }
                throw new Error(data.error || 'Rate limit exceeded');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            if (!data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            // SUCCESS - Update UI with results
            setAnalysisResult(data.analysis);

            // UPDATE CREDITS FOR AUTHENTICATED USERS
            if (isAuthenticated && data.creditsRemaining !== undefined) {
                // Update Zustand store
                updateCredits(data.creditsRemaining);

                // Update session
                await updateSession({
                    creditsRemaining: data.creditsRemaining,
                    analysesCount: data.analysesCount,
                });

                // Update local state
                setRemainingCredits(data.creditsRemaining);

                // Show warning if credits are low
                if (data.creditsRemaining <= 5 && data.creditsRemaining > 0) {
                    console.log(`Analysis complete! You have ${data.creditsRemaining} credits remaining.`);
                }

                if (data.creditsRemaining <= 0) {
                    setError('You have used all your credits. Please contact support to get more.');
                }
            } else if (!isAuthenticated) {
                // UPDATE ANONYMOUS CREDITS FROM BACKEND RESPONSE
                if (data.anonymousCreditsRemaining !== undefined) {
                    // Sync frontend credits with backend
                    const currentCredits = getRemainingCredits();
                    const backendCredits = data.anonymousCreditsRemaining;

                    // Update store to match backend
                    if (currentCredits !== backendCredits) {
                        // Calculate difference and adjust
                        const difference = currentCredits - backendCredits;
                        for (let i = 0; i < difference; i++) {
                            decrementAnonymousCredit();
                        }
                    }

                    setRemainingCredits(backendCredits);

                    if (backendCredits <= 0) {
                        setNeedsLogin(true);
                        setError('You have used all 3 free analyses. Please sign in to get 50 credits.');
                    } else if (backendCredits === 1) {
                        console.log('You have 1 free analysis remaining. Sign in to get 50 credits!');
                    }
                } else {
                    // Fallback: decrement local credit
                    decrementAnonymousCredit();
                    setRemainingCredits(getRemainingCredits());
                }
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
            setError(errorMessage);
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [
        file,
        jobDescription,
        resumeText,
        parseResume,
        isAuthenticated,
        session,
        hasCreditsAvailable,
        getRemainingCredits,
        decrementAnonymousCredit,
        updateCredits,
        updateSession,
    ]);

    return {
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
    };
}