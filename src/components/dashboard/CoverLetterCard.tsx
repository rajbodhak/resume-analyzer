'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Mail, Building2, Calendar, Copy, Download, Trash2, Eye, MoreVertical, CheckCircle } from 'lucide-react';

interface CoverLetterCardProps {
    coverLetter: {
        id: string;
        companyName: string;
        positionTitle: string;
        content: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
}

export function CoverLetterCard({ coverLetter, onDelete }: CoverLetterCardProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(coverLetter.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const blob = new Blob([coverLetter.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${coverLetter.companyName}-${coverLetter.positionTitle}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleViewDetails = () => {
        router.push(`/dashboard/cover-letter/${coverLetter.id}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Card className="hover:border-primary/50 transition-all duration-200 group">
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10">
                            <Mail className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm text-foreground truncate">
                                {coverLetter.positionTitle}
                            </h3>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                Cover Letter
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(coverLetter.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate">{coverLetter.companyName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={handleViewDetails}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleViewDetails}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full Letter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleCopy}>
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy to Clipboard
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownload}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(coverLetter.id);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}