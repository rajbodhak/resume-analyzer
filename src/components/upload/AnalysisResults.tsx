'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AnalysisResult, isJobMatchResult } from '@/types/analysis';
import { ResumeAnalysis } from './ResumeAnalysis';
import { JobMatchAnalysis } from './JobMatchAnalysis';
import GenerateCoverLetterButton from './GenerateCoverLetterButton';

interface AnalysisResultsProps {
    result: AnalysisResult;
    onAnalyzeAnother: () => void;
    resumeText?: string;
}

export function AnalysisResults({ result, onAnalyzeAnother, resumeText }: AnalysisResultsProps) {
    return (
        <div className="space-y-6">
            {/* Render appropriate analysis component */}
            {isJobMatchResult(result) ? (
                <JobMatchAnalysis result={result} />
            ) : (
                <ResumeAnalysis result={result} />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
                {resumeText && (
                    <GenerateCoverLetterButton
                        resumeText={resumeText}
                    />
                )}
                <Button onClick={onAnalyzeAnother} variant="outline" className="flex-1">
                    Analyze Another Resume
                </Button>
                {/* <Button className="flex-1">Get Detailed Recommendations</Button> */}
            </div>
        </div>
    );
}