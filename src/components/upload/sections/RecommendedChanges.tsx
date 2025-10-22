'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendedChange } from '@/types/analysis';

interface RecommendedChangesProps {
    changes: RecommendedChange[];
}

export function RecommendedChanges({ changes }: RecommendedChangesProps) {
    if (!changes || changes.length === 0) return null;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'text-red-500';
            case 'high':
                return 'text-orange-500';
            case 'medium':
                return 'text-yellow-500';
            default:
                return 'text-blue-500';
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Recommended Changes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {changes.map((change, idx) => (
                        <div key={idx} className="rounded-lg border border-border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium text-white">{change.section}</span>
                                <span
                                    className={`text-xs font-semibold uppercase ${getPriorityColor(change.priority)}`}
                                >
                                    {change.priority}
                                </span>
                            </div>
                            <p className="mb-1 text-sm text-neutral-300">{change.change}</p>
                            <p className="text-xs italic text-muted-foreground">{change.reason}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}