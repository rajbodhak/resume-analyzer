'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle, Download, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [resumeText, setResumeText] = useState('');

    // Handle file selection
    const handleFileSelect = useCallback((selectedFile: File) => {
        if (!selectedFile) return;

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or DOCX file');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setAnalysisResult(null);
    }, []);

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    }, [handleFileSelect]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        setAnalysisResult(null);
        setResumeText('');
    };

    // Parse resume
    const parseResume = async () => {
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
    };

    // Analyze resume
    const analyzeResume = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // First, parse the resume if not already parsed
            let text = resumeText;
            if (!text) {
                text = await parseResume();
                if (!text) {
                    throw new Error('Failed to extract text from resume');
                }
            }

            // Then analyze
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
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] md:mt-6 px-4 py-12 md:px-6">
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
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Upload Resume</CardTitle>
                            <CardDescription>
                                Supported formats: PDF, DOC, DOCX (Max 10MB)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {!file ? (
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${isDragging
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50 hover:bg-card/80'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileInputChange}
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                    />
                                    <Upload className="mx-auto mb-4 size-12 text-muted-foreground" />
                                    <p className="mb-2 text-lg font-semibold text-white">
                                        Drop your resume here or click to browse
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        PDF, DOC, or DOCX up to 10MB
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="size-8 text-primary" />
                                        <div>
                                            <p className="font-medium text-white">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeFile}
                                        disabled={isParsing || isAnalyzing}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Optional Job Description */}
                            {file && (
                                <div className="space-y-2">
                                    <Label htmlFor="jobDescription" className="text-white">
                                        Job Description (Optional)
                                    </Label>
                                    <Textarea
                                        id="jobDescription"
                                        placeholder="Paste the job description here to get a match score and tailored recommendations..."
                                        value={jobDescription}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                                        className="min-h-[120px] bg-card/50 text-white"
                                        disabled={isParsing || isAnalyzing}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Adding a job description will give you a compatibility score and targeted insights
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
                                    <AlertCircle className="size-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {file && !analysisResult && (
                                <Button
                                    onClick={analyzeResume}
                                    disabled={isParsing || isAnalyzing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isParsing ? (
                                        <>
                                            <Loader2 className="mr-2 size-5 animate-spin" />
                                            Parsing Resume...
                                        </>
                                    ) : isAnalyzing ? (
                                        <>
                                            <Loader2 className="mr-2 size-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 size-5" />
                                            Analyze Resume
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Results Section */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 space-y-6"
                    >
                        {/* Overall Scores */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Analysis Results</CardTitle>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 size-4" />
                                        Export Report
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-border bg-card p-6">
                                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <TrendingUp className="size-4" />
                                            <span>Overall Score</span>
                                        </div>
                                        <p className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore || 0)}`}>
                                            {analysisResult.overallScore || 0}
                                            <span className="text-2xl text-muted-foreground">/100</span>
                                        </p>
                                    </div>
                                    {(analysisResult.atsScore || analysisResult.matchScore) && (
                                        <div className="rounded-lg border border-border bg-card p-6">
                                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Target className="size-4" />
                                                <span>{analysisResult.matchScore ? 'Match Score' : 'ATS Compatibility'}</span>
                                            </div>
                                            <p className={`text-4xl font-bold ${getScoreColor(analysisResult.atsScore || analysisResult.matchScore || 0)}`}>
                                                {analysisResult.atsScore || analysisResult.matchScore || 0}
                                                <span className="text-2xl text-muted-foreground">/100</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                {analysisResult.summary && (
                                    <div className="mt-6 rounded-lg border border-border bg-card p-4">
                                        <h3 className="mb-2 font-semibold text-white">Summary</h3>
                                        <p className="text-sm text-neutral-300">{analysisResult.summary}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Detailed Analysis */}
                        {analysisResult.detailedAnalysis && (
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle>Detailed Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(analysisResult.detailedAnalysis).map(([key, value]: [string, any]) => (
                                        <div key={key} className="rounded-lg border border-border bg-card p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="font-semibold capitalize text-white">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <span className={`text-sm font-semibold ${getScoreColor(value.score)}`}>
                                                    {value.score}/100
                                                </span>
                                            </div>
                                            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                                                <div
                                                    className={`h-full transition-all ${getScoreBgColor(value.score)}`}
                                                    style={{ width: `${value.score}%` }}
                                                />
                                            </div>
                                            {value.issues && value.issues.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">Issues:</p>
                                                    <ul className="space-y-1">
                                                        {value.issues.map((issue: string, idx: number) => (
                                                            <li key={idx} className="text-sm text-neutral-300">• {issue}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {value.recommendations && value.recommendations.length > 0 && (
                                                <div>
                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">Recommendations:</p>
                                                    <ul className="space-y-1">
                                                        {value.recommendations.map((rec: string, idx: number) => (
                                                            <li key={idx} className="text-sm text-green-400">✓ {rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Strengths & Weaknesses */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-green-500">Key Strengths</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {analysisResult.strengths.map((strength: string, index: number) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                                                    <span className="text-neutral-300">{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                            {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-orange-500">Areas for Improvement</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {analysisResult.weaknesses.map((weakness: string, index: number) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-orange-500" />
                                                    <span className="text-neutral-300">{weakness}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button onClick={removeFile} variant="outline" className="flex-1">
                                Analyze Another Resume
                            </Button>
                            <Button className="flex-1">
                                Get Detailed Recommendations
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;