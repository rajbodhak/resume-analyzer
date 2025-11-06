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
import { Search, Filter, FileText } from 'lucide-react';
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import { AnalysisCardSkeleton } from '@/components/dashboard/AnalysisCardSkeleton';
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

export default function HistoryPage() {
    const router = useRouter();
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('recent');

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

            if (result.success) {
                setAnalyses(result.analyses);
            }
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...analyses];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((analysis) =>
                analysis.originalFileName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(
                (analysis) => analysis.analysisType === filterType
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'score-high':
                    return b.overallScore - a.overallScore;
                case 'score-low':
                    return a.overallScore - b.overallScore;
                default:
                    return 0;
            }
        });

        setFilteredAnalyses(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this analysis?')) return;

        try {
            const response = await fetch(`/api/analysis/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAnalyses((prev) => prev.filter((a) => a.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete analysis:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-6">
                    <div className="h-8 bg-muted rounded animate-pulse w-1/4" />
                    <div className="h-10 bg-muted rounded animate-pulse w-full" />
                    <AnalysisCardSkeleton />
                    <AnalysisCardSkeleton />
                    <AnalysisCardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage all your resume analyses
                        </p>
                    </div>
                    <Button onClick={() => router.push('/upload')}>
                        <FileText className="w-4 h-4 mr-2" />
                        New Analysis
                    </Button>
                </div>

                {/* Filters & Search */}
                {analyses.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Type Filter */}
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="job-match">Job Match</SelectItem>
                                <SelectItem value="resume-analysis">Resume Review</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
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
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredAnalyses.length} of {analyses.length} analyses
                    </p>
                )}

                {/* Analyses List */}
                {analyses.length === 0 ? (
                    <EmptyAnalysisState
                        onStartAnalysis={() => router.push('/upload')}
                    />
                ) : filteredAnalyses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No analyses match your filters</p>
                    </div>
                ) : (
                    <div className="space-y-4">
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