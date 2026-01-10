'use client';

import { Card } from '@/components/ui/card';

export default function CoverLetterPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header Skeleton */}
                <div className="mb-8 text-center space-y-3">
                    <div className="h-10 md:h-12 bg-neutral-800/50 rounded animate-pulse w-2/3 md:w-1/2 mx-auto" />
                    <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-3/4 md:w-1/3 mx-auto" />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section Skeleton */}
                    <Card className="p-6 bg-neutral-900/50 border-neutral-800 backdrop-blur">
                        <div className="space-y-5">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-24" />
                                <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse" />
                            </div>

                            {/* Company Name */}
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-28" />
                                <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse" />
                            </div>

                            {/* Position Title */}
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-24" />
                                <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse" />
                            </div>

                            {/* Resume Upload */}
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-20" />
                                <div className="h-12 bg-neutral-800/50 rounded-lg animate-pulse" />
                                <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-40" />
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-32" />
                                <div className="h-28 bg-neutral-800/50 rounded-lg animate-pulse" />
                            </div>

                            {/* Submit Button */}
                            <div className="h-12 bg-neutral-800/50 rounded-lg animate-pulse" />
                        </div>
                    </Card>

                    {/* Result Section Skeleton */}
                    <Card className="p-6 bg-neutral-900/50 border-neutral-800 backdrop-blur min-h-[600px] flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-neutral-800/50 rounded-full animate-pulse mb-4" />
                            <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-40 mb-2" />
                            <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-64" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}