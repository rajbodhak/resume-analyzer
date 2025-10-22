export interface ResumeAnalysisResult {
    overallScore: number;
    atsScore?: number;
    summary: string;
    strengths?: string[];
    weaknesses?: string[];
    detailedAnalysis?: {
        atsCompatibility?: DetailedSection;
        contentQuality?: DetailedSection;
        structure?: DetailedSection;
        keywords?: KeywordSection;
        [key: string]: DetailedSection | KeywordSection | undefined;
    };
    actionableSteps?: ActionableStep[];
    industryBenchmark?: {
        performanceLevel: string;
        comparison: string;
    };
}

export interface JobMatchResult {
    matchScore: number;
    verdict: 'strong_match' | 'good_match' | 'moderate_match' | 'weak_match';
    summary: string;
    keywordMatch?: {
        score: number;
        matched: string[];
        missing: string[];
        suggestions: string[];
    };
    skillsMatch?: {
        score: number;
        matched: string[];
        missing: string[];
        transferable: string[];
    };
    experienceMatch?: {
        score: number;
        alignment: string;
        gaps: string[];
        recommendations: string[];
    };
    recommendedChanges?: RecommendedChange[];
    atsOptimization?: {
        currentATSFriendliness: number;
        improvements: string[];
    };
}

export interface DetailedSection {
    score: number;
    issues: string[];
    recommendations: string[];
}

export interface KeywordSection {
    score: number;
    present: string[];
    missing: string[];
    recommendations: string[];
}

export interface ActionableStep {
    priority: 'high' | 'medium' | 'low';
    category: string;
    action: string;
    impact: string;
}

export interface RecommendedChange {
    section: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    change: string;
    reason: string;
}

export type AnalysisResult = ResumeAnalysisResult | JobMatchResult;

export interface AnalysisResponse {
    success: boolean;
    data?: AnalysisResult;
    analysisType?: 'job-match' | 'resume-analysis';
    error?: string;
}

// Type guards
export function isJobMatchResult(result: AnalysisResult): result is JobMatchResult {
    return 'matchScore' in result && 'verdict' in result;
}

export function isResumeAnalysisResult(result: AnalysisResult): result is ResumeAnalysisResult {
    return 'overallScore' in result && !('matchScore' in result);
}