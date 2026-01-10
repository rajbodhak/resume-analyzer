'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Building2, Briefcase, Calendar, Copy, Download, CheckCircle } from 'lucide-react';

export default function CoverLetterDetailPage() {
    const router = useRouter();
    const params = useParams();
    const coverLetterId = params.id as string;

    const [coverLetter, setCoverLetter] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchCoverLetter();
    }, [coverLetterId]);

    const fetchCoverLetter = async () => {
        try {
            const response = await fetch(`/api/cover-letter/${coverLetterId}`);
            const result = await response.json();

            if (!result.success) {
                setError(result.error || 'Failed to load cover letter');
                return;
            }

            setCoverLetter(result.coverLetter);
        } catch (error) {
            console.error('Failed to fetch cover letter:', error);
            setError('Failed to load cover letter');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(coverLetter.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error || !coverLetter) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Cover Letter Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error || 'This cover letter does not exist'}</p>
                    <Button onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {coverLetter.positionTitle}
                            </h1>
                            <Badge variant="outline" className="text-sm">
                                Cover Letter
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{coverLetter.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Generated on {new Date(coverLetter.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Letter Content */}
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground">
                            {coverLetter.content}
                        </pre>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleCopy}
                        className="flex-1"
                    >
                        {copied ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copied to Clipboard!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy to Clipboard
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex-1"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download as Text
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/cover-letter')}
                        variant="outline"
                        className="flex-1"
                    >
                        Generate Another
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/history')}
                        className="flex-1"
                    >
                        View History
                    </Button>
                </div>
            </div>
        </div>
    );
}