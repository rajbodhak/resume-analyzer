'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, FileText, TrendingUp, Calendar, FileCheck } from 'lucide-react';
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import HistoryPageSkeleton from '@/components/dashboard/HistoryPageSkeleton';
import { EmptyAnalysisState } from '@/components/dashboard/EmptyAnalysisState';

interface Analysis {
    id: string;
    createdAt: string;
    overallScore: number;
    compatibilityScore: number;
    analysisType: string | null;
    originalFileName: string | null;
    jobDescription: string;
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

export default function HistoryPage() {
    const router = useRouter();
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchAnalyses();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [analyses, searchQuery, filterType, sortBy]);

    const fetchAnalyses = async () => {
        try {
            const response = await fetch('/api/history?limit=100');
            const result = await response.json();
            if (result.success) setAnalyses(result.analyses);
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...analyses];

        if (searchQuery) {
            filtered = filtered.filter((a) =>
                a.originalFileName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter((a) => a.analysisType === filterType);
        }

        filtered.sort((a, b) => {
            const sortMap: any = {
                recent: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                oldest: new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                'score-high': b.overallScore - a.overallScore,
                'score-low': a.overallScore - b.overallScore,
            };
            return sortMap[sortBy] || 0;
        });

        setFilteredAnalyses(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this analysis?')) return;
        try {
            const response = await fetch(`/api/analysis/${id}`, { method: 'DELETE' });
            if (response.ok) setAnalyses((prev) => prev.filter((a) => a.id !== id));
        } catch (error) {
            console.error('Failed to delete analysis:', error);
        }
    };

    const stats = {
        total: filteredAnalyses.length,
        avgScore: filteredAnalyses.length
            ? Math.round(filteredAnalyses.reduce((acc, a) => acc + a.overallScore, 0) / filteredAnalyses.length)
            : 0,
        lastMonth: filteredAnalyses.filter((a) => {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return new Date(a.createdAt) >= monthAgo;
        }).length,
    };

    if (isLoading) {
        return <HistoryPageSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Analysis History</h1>
                        <p className="text-sm md:text-base text-neutral-400 mt-1">View and manage all your resume analyses</p>
                    </div>
                    <Button
                        onClick={() => router.push('/upload')}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 w-full sm:w-auto"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        New Analysis
                    </Button>
                </div>

                {/* Stats */}
                {analyses.length > 0 && (
                    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
                        <StatCard icon={FileCheck} label="Total Analyses" value={stats.total} />
                        <StatCard icon={TrendingUp} label="Average Score" value={stats.avgScore} suffix="/100" />
                        <StatCard icon={Calendar} label="Last 30 Days" value={stats.lastMonth} />
                    </div>
                )}

                {/* Filters */}
                {analyses.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <Input
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-blue-500/50"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-full sm:w-44 bg-neutral-900/50 border-neutral-800 text-white">
                                <Filter className="w-4 h-4 mr-2 text-neutral-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="job-match">Job Match</SelectItem>
                                <SelectItem value="resume-analysis">Resume Review</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-44 bg-neutral-900/50 border-neutral-800 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800">
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="score-high">Highest Score</SelectItem>
                                <SelectItem value="score-low">Lowest Score</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Results Count */}
                {analyses.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-blue-400" />
                        <p className="text-xs md:text-sm text-neutral-400">
                            Showing <span className="text-white font-semibold">{filteredAnalyses.length}</span> of <span className="text-white font-semibold">{analyses.length}</span>
                        </p>
                    </div>
                )}

                {/* List */}
                {analyses.length === 0 ? (
                    <EmptyAnalysisState onStartAnalysis={() => router.push('/upload')} />
                ) : filteredAnalyses.length === 0 ? (
                    <div className="text-center py-12 md:py-16 rounded-xl border border-neutral-800 bg-neutral-900/30">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-6 h-6 md:w-8 md:h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-400 text-base md:text-lg">No analyses match your filters</p>
                        <p className="text-neutral-500 text-xs md:text-sm mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {filteredAnalyses.map((analysis) => (
                            <AnalysisCard
                                key={analysis.id}
                                analysis={analysis}
                                onViewDetails={(id) => router.push(`/dashboard/analysis/${id}`)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}