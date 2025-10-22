'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Target } from 'lucide-react';
import { JobMatchResult } from '@/types/analysis';
import { KeywordAnalysis } from './sections/KeywordAnalysis';
import { SkillsAnalysis } from './sections/SkillsAnalysis';
import { ExperienceAnalysis } from './sections/ExperienceAnalysis';
import { RecommendedChanges } from './sections/RecommendedChanges';

interface JobMatchAnalysisProps {
    result: JobMatchResult;
}

export function JobMatchAnalysis({ result }: JobMatchAnalysisProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Match Score & Verdict */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Job Match Analysis</CardTitle>
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
                                <Target className="size-4" />
                                <span>Match Score</span>
                            </div>
                            <p className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
                                {result.matchScore}
                                <span className="text-2xl text-muted-foreground">/100</span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-2 text-sm text-muted-foreground">Match Quality</div>
                            <p className="text-2xl font-bold capitalize text-white">
                                {result.verdict?.replace(/_/g, ' ')}
                            </p>
                        </div>
                    </div>

                    {result.summary && (
                        <div className="mt-6 rounded-lg border border-border bg-card p-4">
                            <h3 className="mb-2 font-semibold text-white">Summary</h3>
                            <p className="text-sm text-neutral-300">{result.summary}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Keyword Match */}
            {result.keywordMatch && <KeywordAnalysis data={result.keywordMatch} />}

            {/* Skills Match */}
            {result.skillsMatch && <SkillsAnalysis data={result.skillsMatch} />}

            {/* Experience Match */}
            {result.experienceMatch && <ExperienceAnalysis data={result.experienceMatch} />}

            {/* Recommended Changes */}
            {result.recommendedChanges && <RecommendedChanges changes={result.recommendedChanges} />}

            {/* ATS Optimization */}
            {result.atsOptimization && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>ATS Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">ATS Friendliness</span>
                            <span
                                className={`text-lg font-semibold ${getScoreColor(
                                    result.atsOptimization.currentATSFriendliness
                                )}`}
                            >
                                {result.atsOptimization.currentATSFriendliness}/100
                            </span>
                        </div>

                        {result.atsOptimization.improvements &&
                            result.atsOptimization.improvements.length > 0 && (
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-blue-400">
                                        Improvement Suggestions
                                    </h4>
                                    <ul className="space-y-1">
                                        {result.atsOptimization.improvements.map((improvement: string, idx: number) => (
                                            <li key={idx} className="text-sm text-neutral-300">
                                                • {improvement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}