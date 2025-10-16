export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface ParseResumeResponse {
    success: boolean;
    text?: string;
    error?: string;
}

export interface AnalyzeResponse {
    success: boolean;
    data?: {
        id: string;
        overallScore: number;
        compatibilityScore: number;
        missingKeywords: string[];
        foundKeywords: string[];
        skillsMatch: any;
        improvements: any[];
    };
    error?: string;
}

export interface CoverLetterResponse {
    success: boolean;
    coverLetter?: string;
    error?: string;
}

export interface RateLimitResponse {
    success: boolean;
    remaining: number;
    resetIn?: number;
    error?: string;
}