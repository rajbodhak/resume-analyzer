import { Card, CardContent } from '@/components/ui/card';

export function AnalysisCardSkeleton() {
    return (
        <Card className="border-neutral-800 bg-neutral-900/50">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800/50 animate-pulse" />

                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-neutral-800/50 rounded animate-pulse w-1/2" />
                            <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-1/4" />
                            <div className="flex gap-4">
                                <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-16" />
                                <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-16" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="h-8 w-16 bg-neutral-800/50 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-neutral-800/50 rounded animate-pulse" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}