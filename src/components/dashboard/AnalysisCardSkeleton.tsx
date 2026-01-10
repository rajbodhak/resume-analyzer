'use client';

import { Card, CardContent } from '@/components/ui/card';

export function AnalysisCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    {/* Icon Skeleton */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800/50 animate-pulse" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Title + Badge */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-40" />
                            <div className="h-4 w-16 bg-neutral-800/50 rounded animate-pulse" />
                        </div>

                        {/* Date & Score */}
                        <div className="flex items-center gap-3">
                            <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-16" />
                            <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-20" />
                        </div>
                    </div>

                    {/* Actions Skeleton */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="h-8 w-16 bg-neutral-800/50 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-neutral-800/50 rounded animate-pulse" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}