'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExperienceAnalysisProps {
    data: {
        score: number;
        alignment: string;
        gaps: string[];
        recommendations: string[];
    };
}

export function ExperienceAnalysis({ data }: ExperienceAnalysisProps) {
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
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Experience Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience Match Score</span>
                    <span className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                        {data.score}/100
                    </span>
                </div>
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                        className={`h-full transition-all ${getScoreBgColor(data.score)}`}
                        style={{ width: `${data.score}%` }}
                    />
                </div>

                {data.alignment && (
                    <div className="mb-4 rounded-lg border border-border bg-card p-3">
                        <p className="text-sm text-neutral-300">{data.alignment}</p>
                    </div>
                )}

                {data.gaps && data.gaps.length > 0 && (
                    <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-orange-500">Experience Gaps</h4>
                        <ul className="space-y-1">
                            {data.gaps.map((gap: string, idx: number) => (
                                <li key={idx} className="text-sm text-neutral-300">
                                    • {gap}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {data.recommendations && data.recommendations.length > 0 && (
                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-blue-400">Recommendations</h4>
                        <ul className="space-y-1">
                            {data.recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="text-sm text-green-400">
                                    ✓ {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}