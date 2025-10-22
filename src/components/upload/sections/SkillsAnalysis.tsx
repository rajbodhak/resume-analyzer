'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SkillsAnalysisProps {
    data: {
        score: number;
        matched: string[];
        missing: string[];
        transferable?: string[];
    };
}

export function SkillsAnalysis({ data }: SkillsAnalysisProps) {
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
                <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Skills Match Score</span>
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

                <div className="space-y-4">
                    {data.matched && data.matched.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-sm font-semibold text-green-500">Matched Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.matched.map((skill: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.missing && data.missing.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-sm font-semibold text-red-500">Missing Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.missing.map((skill: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-500"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.transferable && data.transferable.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-sm font-semibold text-yellow-500">Transferable Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.transferable.map((skill: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-500"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}