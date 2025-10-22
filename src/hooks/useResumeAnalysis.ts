'use client';

import { useState, useCallback } from 'react';
import { AnalysisResult } from '../types/analysis';

export function useResumeAnalysis() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

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
    }, [validateFile]);

    const removeFile = useCallback(() => {
        setFile(null);
        setError(null);
        setAnalysisResult(null);
        setResumeText('');
        setJobDescription('');
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

        setIsAnalyzing(true);
        setError(null);

        try {
            // Parse resume if not already parsed
            let text = resumeText;
            if (!text) {
                text = (await parseResume()) || "";
                if (!text) {
                    throw new Error('Failed to extract text from resume');
                }
            }

            // Analyze resume
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeText: text,
                    jobDescription: jobDescription.trim() || undefined,
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

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
            setError(errorMessage);
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    }, [file, jobDescription, resumeText, parseResume]);

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
    };
}