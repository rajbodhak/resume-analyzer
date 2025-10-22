'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { UploadSection } from '@/components/upload/UploadSection';
import { AnalysisResults } from '@/components/upload/AnalysisResults';

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
    } = useResumeAnalysis();

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
                </motion.div>

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
                        <AnalysisResults result={analysisResult} onAnalyzeAnother={removeFile} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}