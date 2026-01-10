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
    const score = isJobMatch ? analysis.compatibilityScore : analysis.overallScore;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
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
        <Card className="hover:border-primary/50 transition-all duration-200 group">
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isJobMatch ? 'bg-primary/10' : 'bg-blue-500/10'
                            }`}>
                            {isJobMatch ? (
                                <Briefcase className={`w-5 h-5 ${isJobMatch ? 'text-primary' : 'text-blue-500'}`} />
                            ) : (
                                <FileText className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm text-foreground truncate">
                                {analysis.originalFileName || 'Resume Analysis'}
                            </h3>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {isJobMatch ? 'Job Match' : 'Review'}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(analysis.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Score:</span>
                                <span className={`font-semibold ${getScoreColor(score)}`}>
                                    {score}/100
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onViewDetails(analysis.id)}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                        </Button>

                        {onDelete && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onViewDetails(analysis.id)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(analysis.id)}
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