'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AnalysisResult, isJobMatchResult } from '@/types/analysis';
import { ResumeAnalysis } from './ResumeAnalysis';
import { JobMatchAnalysis } from './JobMatchAnalysis';

interface AnalysisResultsProps {
    result: AnalysisResult;
    onAnalyzeAnother: () => void;
}

export function AnalysisResults({ result, onAnalyzeAnother }: AnalysisResultsProps) {
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
                <Button onClick={onAnalyzeAnother} variant="outline" className="flex-1">
                    Analyze Another Resume
                </Button>
                {/* <Button className="flex-1">Get Detailed Recommendations</Button> */}
            </div>
        </div>
    );
}