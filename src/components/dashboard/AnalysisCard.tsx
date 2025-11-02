'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    Briefcase,
    MoreVertical,
    Eye,
    Trash2,
    Calendar,
    Target,
    FileCheck
} from 'lucide-react';

interface AnalysisCardProps {
    analysis: {
        id: string;
        createdAt: Date | string;
        overallScore: number;
        compatibilityScore: number;
        analysisType: string | null;
        originalFileName: string | null;
        jobDescription: string;
    };
    onViewDetails: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AnalysisCard({ analysis, onViewDetails, onDelete }: AnalysisCardProps) {
    const isJobMatch = analysis.analysisType === 'job-match';
    const hasJobDescription = analysis.jobDescription && analysis.jobDescription.trim().length > 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
        if (score >= 80) return 'default';
        if (score >= 60) return 'secondary';
        return 'destructive';
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Card
            className="hover:border-primary/50 transition-all duration-200 cursor-pointer group"
            onClick={() => onViewDetails(analysis.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isJobMatch
                                ? 'bg-primary/10 text-primary'
                                : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            {isJobMatch ? (
                                <Briefcase className="w-5 h-5" />
                            ) : (
                                <FileText className="w-5 h-5" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground truncate">
                                    {analysis.originalFileName || 'Resume Analysis'}
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="flex-shrink-0 text-xs"
                                >
                                    {isJobMatch ? 'Job Match' : 'Resume Review'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(analysis.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-lg font-bold ${getScoreColor(
                                            isJobMatch ? analysis.compatibilityScore : analysis.overallScore
                                        )}`}>
                                            {isJobMatch ? analysis.compatibilityScore : analysis.overallScore}
                                        </span>
                                        <span className="text-xs text-muted-foreground">/100</span>
                                    </div>
                                </div>

                                {isJobMatch && (
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-muted-foreground" />
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-semibold text-foreground">
                                                {analysis.overallScore}
                                            </span>
                                            <span className="text-xs text-muted-foreground">ATS</span>
                                        </div>
                                    </div>
                                )}

                                {hasJobDescription && !isJobMatch && (
                                    <Badge variant="secondary" className="text-xs">
                                        With JD
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                            variant={getScoreBadgeVariant(
                                isJobMatch ? analysis.compatibilityScore : analysis.overallScore
                            )}
                            className="hidden sm:flex"
                        >
                            {isJobMatch ? analysis.compatibilityScore : analysis.overallScore}
                        </Badge>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(analysis.id);
                            }}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                        </Button>

                        {onDelete && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        onViewDetails(analysis.id);
                                    }}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(analysis.id);
                                        }}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}