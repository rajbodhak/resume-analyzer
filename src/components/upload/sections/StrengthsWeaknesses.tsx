'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StrengthsWeaknessesProps {
    strengths?: string[];
    weaknesses?: string[];
}

export function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
    if (!strengths?.length && !weaknesses?.length) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {strengths && strengths.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-green-500">Key Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {strengths.map((strength: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                                    <span className="text-neutral-300">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
            {weaknesses && weaknesses.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-orange-500">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {weaknesses.map((weakness: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-orange-500" />
                                    <span className="text-neutral-300">{weakness}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}