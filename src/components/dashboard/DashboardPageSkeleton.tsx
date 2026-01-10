'use client';

import { AnalysisCardSkeleton } from '@/components/dashboard/AnalysisCardSkeleton';

export default function DashboardPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header Skeleton */}
                <div>
                    <div className="h-8 md:h-9 bg-neutral-800/50 rounded animate-pulse w-64 md:w-80 mb-1" />
                    <div className="h-4 md:h-5 bg-neutral-800/50 rounded animate-pulse w-56 md:w-72" />
                </div>

                {/* Quick Actions Skeleton */}
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-neutral-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 md:h-24 bg-neutral-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Recent Analyses Section Skeleton */}
                <div>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="h-7 md:h-8 bg-neutral-800/50 rounded animate-pulse w-40 md:w-48" />
                        <div className="h-9 bg-neutral-800/50 rounded animate-pulse w-20" />
                    </div>

                    {/* Analysis Cards Skeleton */}
                    <div className="space-y-3 md:space-y-4">
                        {[1, 2, 3].map((i) => (
                            <AnalysisCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}