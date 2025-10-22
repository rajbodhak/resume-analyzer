'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Target } from 'lucide-react';

interface ScoreCardsProps {
    overallScore?: number;
    secondaryScore?: number;
    secondaryScoreLabel?: string;
    summary?: string;
    onExport?: () => void;
}

export function ScoreCards({
    overallScore,
    secondaryScore,
    secondaryScoreLabel = 'ATS Compatibility',
    summary,
    onExport,
}: ScoreCardsProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    {onExport && (
                        <Button variant="outline" size="sm" onClick={onExport}>
                            <Download className="mr-2 size-4" />
                            Export Report
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {overallScore !== undefined && (
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <TrendingUp className="size-4" />
                                <span>Overall Score</span>
                            </div>
                            <p className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                                {overallScore}
                                <span className="text-2xl text-muted-foreground">/100</span>
                            </p>
                        </div>
                    )}
                    {secondaryScore !== undefined && (
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Target className="size-4" />
                                <span>{secondaryScoreLabel}</span>
                            </div>
                            <p className={`text-4xl font-bold ${getScoreColor(secondaryScore)}`}>
                                {secondaryScore}
                                <span className="text-2xl text-muted-foreground">/100</span>
                            </p>
                        </div>
                    )}
                </div>

                {summary && (
                    <div className="mt-6 rounded-lg border border-border bg-card p-4">
                        <h3 className="mb-2 font-semibold text-white">Summary</h3>
                        <p className="text-sm text-neutral-300">{summary}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}