'use client';

import { AnalysisCardSkeleton } from '@/components/dashboard/AnalysisCardSkeleton';

export default function HistoryPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                    <div className="flex-1">
                        <div className="h-8 md:h-9 bg-neutral-800/50 rounded animate-pulse w-48 md:w-56 mb-1" />
                        <div className="h-4 md:h-5 bg-neutral-800/50 rounded animate-pulse w-56 md:w-72" />
                    </div>
                    <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse w-full sm:w-36" />
                </div>

                {/* Stats Skeleton - Updated to 4 columns */}
                <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 md:h-24 bg-neutral-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Filters Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse flex-1" />
                    <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse w-full sm:w-48" />
                    <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse w-full sm:w-44" />
                </div>

                {/* Results Count Skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-neutral-800/50 animate-pulse" />
                    <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-32 md:w-40" />
                </div>

                {/* Compact Analysis Cards Skeleton */}
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <AnalysisCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}