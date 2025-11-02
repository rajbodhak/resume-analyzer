'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ResumeAnalysis } from '@/components/upload/ResumeAnalysis';
import { JobMatchAnalysis } from '@/components/upload/JobMatchAnalysis';
import { isJobMatchResult, AnalysisResult } from '@/types/analysis';

export default function AnalysisDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const analysisId = params.id as string;

    const [analysis, setAnalysis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalysis();
    }, [analysisId]);

    const fetchAnalysis = async () => {
        try {
            const response = await fetch(`/api/analysis/${analysisId}`);
            const result = await response.json();

            if (!result.success) {
                setError(result.error || 'Failed to load analysis');
                return;
            }

            setAnalysis(result.analysis);
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
            setError('Failed to load analysis');
        } finally {
            setIsLoading(false);
        }
    };

    const reconstructAnalysisResult = (): AnalysisResult | null => {
        if (!analysis) return null;

        const isJobMatch = analysis.analysisType === 'job-match';

        if (isJobMatch) {
            return {
                matchScore: analysis.compatibilityScore,
                verdict: getVerdict(analysis.compatibilityScore),
                summary: `Analysis completed on ${new Date(analysis.createdAt).toLocaleDateString()}`,
                keywordMatch: analysis.missingKeywords,
                skillsMatch: analysis.skillsMatch,
                experienceMatch: undefined,
                recommendedChanges: analysis.improvements,
                atsOptimization: {
                    currentATSFriendliness: analysis.overallScore,
                    improvements: [],
                },
            };
        } else {
            return {
                overallScore: analysis.overallScore,
                atsScore: analysis.compatibilityScore,
                summary: `Analysis completed on ${new Date(analysis.createdAt).toLocaleDateString()}`,
                strengths: [],
                weaknesses: [],
                detailedAnalysis: undefined,
                actionableSteps: analysis.improvements,
                industryBenchmark: undefined,
            };
        }
    };

    const getVerdict = (score: number): 'strong_match' | 'good_match' | 'moderate_match' | 'weak_match' => {
        if (score >= 80) return 'strong_match';
        if (score >= 60) return 'good_match';
        if (score >= 40) return 'moderate_match';
        return 'weak_match';
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl md:mt-10">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl md:mt-10">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Analysis Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error || 'This analysis does not exist'}</p>
                    <Button onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const analysisResult = reconstructAnalysisResult();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl md:mt-10">
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
                        <h1 className="text-3xl font-bold tracking-tight">
                            {analysis.originalFileName || 'Resume Analysis'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Analyzed on {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Analysis Content */}
                {analysisResult && (
                    isJobMatchResult(analysisResult) ? (
                        <JobMatchAnalysis result={analysisResult} />
                    ) : (
                        <ResumeAnalysis result={analysisResult} />
                    )
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => router.push('/upload')}
                        variant="outline"
                        className="flex-1"
                    >
                        Analyze Another Resume
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/history')}
                        className="flex-1"
                    >
                        View All Analyses
                    </Button>
                </div>
            </div>
        </div>
    );
}