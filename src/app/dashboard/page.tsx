'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    TrendingUp,
    Calendar,
    ArrowRight,
    FileCheck,
    Sparkles,
} from 'lucide-react';
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import { AnalysisCardSkeleton } from '@/components/dashboard/AnalysisCardSkeleton';
import { EmptyAnalysisState } from '@/components/dashboard/EmptyAnalysisState';

interface DashboardData {
    user: {
        name: string;
        email: string;
        analysesCount: number;
        lastAnalysisAt: string | null;
    };
    recentAnalyses: Array<{
        id: string;
        createdAt: string;
        overallScore: number;
        compatibilityScore: number;
        analysisType: string | null;
        originalFileName: string | null;
        jobDescription: string;
    }>;
}

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAverageScore = () => {
        if (!data?.recentAnalyses.length) return 0;
        const sum = data.recentAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0);
        return Math.round(sum / data.recentAnalyses.length);
    };

    const formatLastAnalysisDate = (date: string | null) => {
        if (!date) return 'Never';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">

                <div className="space-y-8">
                    {/* Header Skeleton */}
                    <div className="space-y-2">
                        <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                        <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                                        <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Analyses Skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
                        <AnalysisCardSkeleton />
                        <AnalysisCardSkeleton />
                        <AnalysisCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {data?.user.name || 'User'}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's an overview of your resume analysis journey
                    </p>
                </div>

                {/* Quick Actions - Prominent CTAs */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Analyze Resume CTA */}
                    <button
                        onClick={() => router.push('/upload')}
                        className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 text-left transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="relative z-10">
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                                <FileCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">
                                Analyze Resume
                            </h3>
                            <p className="mb-4 text-sm text-neutral-400">
                                Get AI-powered insights and improve your resume with instant feedback
                            </p>
                            <div className="flex items-center text-sm font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
                                Start Analysis
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>

                    {/* Generate Cover Letter CTA */}
                    <button
                        onClick={() => router.push('/dashboard/cover-letter')}
                        className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 text-left transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="relative z-10">
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">
                                Generate Cover Letter
                            </h3>
                            <p className="mb-4 text-sm text-neutral-400">
                                Create a tailored, professional cover letter in seconds
                            </p>
                            <div className="flex items-center text-sm font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
                                Create Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Total Analyses */}
                    <Card className="border-neutral-800 bg-neutral-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Total Analyses
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {data?.user.analysesCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average Score */}
                    <Card className="border-neutral-800 bg-neutral-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Average Score
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {calculateAverageScore()}
                                        <span className="text-xl text-muted-foreground">/100</span>
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Last Analysis */}
                    <Card className="border-neutral-800 bg-neutral-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Last Analysis
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatLastAnalysisDate(data?.user.lastAnalysisAt || null)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Analyses */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Recent Analyses</h2>
                        {data?.recentAnalyses && data.recentAnalyses.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/dashboard/history')}
                                className="group"
                            >
                                View All
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
                    </div>

                    {!data?.recentAnalyses || data.recentAnalyses.length === 0 ? (
                        <EmptyAnalysisState
                            onStartAnalysis={() => router.push('/upload')}
                        />
                    ) : (
                        <div className="space-y-4">
                            {data.recentAnalyses.slice(0, 5).map((analysis) => (
                                <AnalysisCard
                                    key={analysis.id}
                                    analysis={analysis}
                                    onViewDetails={(id) => router.push(`/dashboard/analysis/${id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}