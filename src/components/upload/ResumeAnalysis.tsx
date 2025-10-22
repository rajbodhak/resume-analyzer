'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeAnalysisResult } from '@/types/analysis';
import { ScoreCards } from './sections/ScoreCards';
import { DetailedSection } from './sections/DetailedSection';
import { StrengthsWeaknesses } from './sections/StrengthsWeaknesses';

interface ResumeAnalysisProps {
    result: ResumeAnalysisResult;
}

export function ResumeAnalysis({ result }: ResumeAnalysisProps) {
    return (
        <div className="space-y-6">
            {/* Overall Scores */}
            <ScoreCards
                overallScore={result.overallScore}
                secondaryScore={result.atsScore}
                secondaryScoreLabel="ATS Compatibility"
                summary={result.summary}
            />

            {/* Detailed Analysis */}
            {result.detailedAnalysis && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(result.detailedAnalysis).map(([key, value]) => {
                            if (!value || typeof value !== 'object') return null;

                            // Handle keyword section differently
                            if (key === 'keywords' && 'present' in value) {
                                return null; // Keywords handled separately if needed
                            }

                            // Handle regular detailed sections
                            if ('score' in value && 'issues' in value && 'recommendations' in value) {
                                return (
                                    <DetailedSection
                                        key={key}
                                        title={key.replace(/([A-Z])/g, ' $1').trim()}
                                        data={value}
                                    />
                                );
                            }

                            return null;
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Strengths & Weaknesses */}
            <StrengthsWeaknesses
                strengths={result.strengths}
                weaknesses={result.weaknesses}
            />

            {/* Actionable Steps */}
            {result.actionableSteps && result.actionableSteps.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Action Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {result.actionableSteps.map((step, idx) => (
                                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-medium text-white">{step.category}</span>
                                        <span
                                            className={`text-xs font-semibold uppercase ${step.priority === 'high'
                                                    ? 'text-red-500'
                                                    : step.priority === 'medium'
                                                        ? 'text-yellow-500'
                                                        : 'text-blue-500'
                                                }`}
                                        >
                                            {step.priority}
                                        </span>
                                    </div>
                                    <p className="mb-1 text-sm text-neutral-300">{step.action}</p>
                                    <p className="text-xs italic text-muted-foreground">
                                        Expected Impact: {step.impact}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Industry Benchmark */}
            {result.industryBenchmark && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Industry Benchmark</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Performance Level</span>
                                <span className="text-lg font-semibold capitalize text-white">
                                    {result.industryBenchmark.performanceLevel}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-300">{result.industryBenchmark.comparison}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}