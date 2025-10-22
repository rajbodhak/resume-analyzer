'use client';

import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
    file: File | null;
    jobDescription: string;
    setJobDescription: (value: string) => void;
    isParsing: boolean;
    isAnalyzing: boolean;
    error: string | null;
    hasResult: boolean;
    onFileSelect: (file: File) => void;
    onRemoveFile: () => void;
    onAnalyze: () => void;
}

export function UploadSection({
    file,
    jobDescription,
    setJobDescription,
    isParsing,
    isAnalyzing,
    error,
    hasResult,
    onFileSelect,
    onRemoveFile,
    onAnalyze,
}: UploadSectionProps) {
    const [isDragging, setIsDragging] = useState(false);

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
        if (droppedFile) {
            onFileSelect(droppedFile);
        }
    }, [onFileSelect]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    return (
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
                            aria-label="Upload resume file"
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
                            onClick={onRemoveFile}
                            disabled={isParsing || isAnalyzing}
                            aria-label="Remove file"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                )}

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
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {file && !hasResult && (
                    <Button
                        onClick={onAnalyze}
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
    );
}