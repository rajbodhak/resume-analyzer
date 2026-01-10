'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import DashboardPageSkeleton from '@/components/dashboard/DashboardPageSkeleton';
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

const StatCard = ({ icon: Icon, label, value, suffix = '' }: any) => (
    <div className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 md:p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs md:text-sm text-neutral-400 mb-1">{label}</p>
                <p className="text-2xl md:text-3xl font-bold text-white">
                    {value}
                    {suffix && <span className="text-lg md:text-xl text-neutral-400">{suffix}</span>}
                </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
);

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
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                        Welcome back, {data?.user.name || 'User'}!
                    </h1>
                    <p className="text-sm md:text-base text-neutral-400 mt-1">
                        Here's an overview of your resume analysis journey
                    </p>
                </div>

                {/* Quick Actions - Prominent CTAs */}
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                    {/* Analyze Resume CTA */}
                    <button
                        onClick={() => router.push('/upload')}
                        className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 text-left transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <FileCheck className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-white mb-0.5">
                                    Analyze Resume
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Get AI-powered insights instantly
                                </p>
                            </div>
                            <ArrowRight className="flex-shrink-0 h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>

                    {/* Generate Cover Letter CTA */}
                    <button
                        onClick={() => router.push('/dashboard/cover-letter')}
                        className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 text-left transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-white mb-0.5">
                                    Generate Cover Letter
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Create tailored letters in seconds
                                </p>
                            </div>
                            <ArrowRight className="flex-shrink-0 h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
                    <StatCard
                        icon={FileText}
                        label="Total Analyses"
                        value={data?.user.analysesCount || 0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Average Score"
                        value={calculateAverageScore()}
                        suffix="/100"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Last Analysis"
                        value={formatLastAnalysisDate(data?.user.lastAnalysisAt || null)}
                    />
                </div>

                {/* Recent Analyses */}
                <div>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-white">Recent Analyses</h2>
                        {data?.recentAnalyses && data.recentAnalyses.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/dashboard/history')}
                                className="group text-neutral-400 hover:text-white"
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
                        <div className="space-y-3 md:space-y-4">
                            {data.recentAnalyses.slice(0, 3).map((analysis) => (
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