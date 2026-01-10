'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header Skeleton */}
                <div>
                    <div className="h-8 md:h-9 bg-neutral-800/50 rounded animate-pulse w-32 mb-1" />
                    <div className="h-4 md:h-5 bg-neutral-800/50 rounded animate-pulse w-64 md:w-80" />
                </div>

                {/* Account Overview Skeleton */}
                <Card className="border-neutral-800 bg-neutral-900/50">
                    <CardHeader>
                        <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-40 mb-2" />
                        <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-56" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-24" />
                                    <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information Skeleton */}
                <Card className="border-neutral-800 bg-neutral-900/50">
                    <CardHeader>
                        <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-44 mb-2" />
                        <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-72" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Form Fields Skeleton */}
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-24" />
                                <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse" />
                            </div>
                        ))}

                        {/* Save Button Skeleton */}
                        <div className="flex items-center justify-end pt-4 border-t border-neutral-800">
                            <div className="h-10 bg-neutral-800/50 rounded-lg animate-pulse w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}