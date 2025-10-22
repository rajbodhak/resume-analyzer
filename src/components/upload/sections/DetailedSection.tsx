'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailedSection as DetailedSectionType } from '@/types/analysis';

interface DetailedSectionProps {
    title: string;
    data: DetailedSectionType;
}

export function DetailedSection({ title, data }: DetailedSectionProps) {
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
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold capitalize text-white">{title}</h3>
                <span className={`text-sm font-semibold ${getScoreColor(data.score)}`}>
                    {data.score}/100
                </span>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                    className={`h-full transition-all ${getScoreBgColor(data.score)}`}
                    style={{ width: `${data.score}%` }}
                />
            </div>
            {data.issues && data.issues.length > 0 && (
                <div className="mb-2">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Issues:</p>
                    <ul className="space-y-1">
                        {data.issues.map((issue: string, idx: number) => (
                            <li key={idx} className="text-sm text-neutral-300">
                                • {issue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {data.recommendations && data.recommendations.length > 0 && (
                <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Recommendations:</p>
                    <ul className="space-y-1">
                        {data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-400">
                                ✓ {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}