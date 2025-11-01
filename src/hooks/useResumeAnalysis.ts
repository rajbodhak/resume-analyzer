'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnalysisResult } from '../types/analysis';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useResumeAnalysis() {
    const {
        user,
        hasCreditsAvailable,
        getRemainingCredits,
        decrementAnonymousCredit,
        incrementAnonymousCredit,
        incrementAnalysisCount
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
        setRemainingCredits(getRemainingCredits());
    }, [getRemainingCredits]);

    // Update credits when they change
    useEffect(() => {
        if (isMounted) {
            setRemainingCredits(getRemainingCredits());
        }
    }, [user, isMounted, getRemainingCredits]);

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

        // CHECK CREDITS BEFORE ANALYSIS using Zustand store
        if (!hasCreditsAvailable()) {
            setNeedsLogin(true);
            setError('You have used all 3 free analyses. Please sign in to continue.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setNeedsLogin(false);

        // Track if we decremented credit (for rollback on failure)
        let creditDecremented = false;

        try {
            // Parse resume if not already parsed
            let text = resumeText;
            if (!text) {
                text = (await parseResume()) || "";
                if (!text) {
                    throw new Error('Failed to extract text from resume');
                }
            }

            //  DECREMENT CREDIT BEFORE API CALL (for anonymous users only)
            if (!isAuthenticated) {
                creditDecremented = decrementAnonymousCredit();
                if (!creditDecremented) {
                    setNeedsLogin(true);
                    setError('No credits remaining. Please sign in to continue.');
                    return;
                }
                // Update local state immediately
                setRemainingCredits(getRemainingCredits());
            }

            // SEND isAnonymous FLAG TO BACKEND
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            setAnalysisResult(data.analysis);

            // Increment analysis count for logged-in users
            if (isAuthenticated) {
                incrementAnalysisCount();
            }

            // Update credits and show login prompt if needed
            const newCredits = getRemainingCredits();
            setRemainingCredits(newCredits);

            if (!isAuthenticated && newCredits <= 0) {
                setNeedsLogin(true);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
            setError(errorMessage);
            console.error('Analysis error:', err);

            if (!isAuthenticated && creditDecremented) {
                incrementAnonymousCredit();
                setRemainingCredits(getRemainingCredits());
                console.log('Credit restored due to analysis failure');
            }
        } finally {
            setIsAnalyzing(false);
        }
    }, [
        file,
        jobDescription,
        resumeText,
        parseResume,
        isAuthenticated,
        hasCreditsAvailable,
        getRemainingCredits,
        decrementAnonymousCredit,
        incrementAnonymousCredit,
        incrementAnalysisCount
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
    };
}