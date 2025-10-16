export interface Analysis {
    id: string;
    createdAt: Date;
    resumeText: string;
    jobDescription: string;
    originalFileName?: string;
    overallScore: number;
    compatibilityScore: number;
    missingKeywords: string[];
    foundKeywords: string[];
    skillsMatch: SkillsMatch;
    improvements: Improvement[];
    atsCompatibility?: ATSCheck[];
    sectionAnalysis?: SectionAnalysis;
    coverLetter?: string;
}

export interface SkillsMatch {
    matched: string[];
    missing: string[];
    additional: string[];
}

export interface Improvement {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'content' | 'formatting' | 'keywords' | 'structure';
}

export interface ATSCheck {
    check: string;
    passed: boolean;
    recommendation?: string;
}

export interface SectionAnalysis {
    [section: string]: {
        score: number;
        feedback: string;
    };
}
