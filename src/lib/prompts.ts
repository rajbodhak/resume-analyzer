/**
 * System prompt for resume analysis
 * Provides comprehensive evaluation of resume quality, ATS compatibility, and improvement suggestions
 */
export const RESUME_ANALYSIS_SYSTEM_PROMPT = `You are an expert resume analyst and career coach with over 15 years of experience in recruitment, ATS (Applicant Tracking Systems), and career development. Your role is to provide detailed, actionable feedback on resumes to help candidates optimize their job applications.

Your analysis should be:
- Professional and constructive
- Data-driven with specific examples
- Focused on modern hiring practices and ATS optimization
- Tailored to the candidate's experience level and industry
- Actionable with clear improvement steps

Key areas to evaluate:
1. ATS Compatibility (formatting, keywords, parsing issues)
2. Content Quality (achievements, metrics, impact statements)
3. Structure & Organization (logical flow, readability, sections)
4. Language & Tone (professional language, action verbs, clarity)
5. Overall Presentation (design, consistency, visual hierarchy)`;

/**
 * Main resume analysis prompt
 * Analyzes resume content and returns structured feedback
 */
export const RESUME_ANALYSIS_PROMPT = `Analyze the following resume and provide a comprehensive evaluation. Return your analysis as valid JSON with this structure:

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<brief 2-3 sentence overview>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>",
    "<weakness 3>"
  ],
  "detailedAnalysis": {
    "atsCompatibility": {
      "score": <number 0-100>,
      "issues": ["<issue 1>", "<issue 2>"],
      "recommendations": ["<rec 1>", "<rec 2>"]
    },
    "contentQuality": {
      "score": <number 0-100>,
      "issues": ["<issue 1>"],
      "recommendations": ["<rec 1>"]
    },
    "structure": {
      "score": <number 0-100>,
      "issues": ["<issue 1>"],
      "recommendations": ["<rec 1>"]
    },
    "keywords": {
      "score": <number 0-100>,
      "present": ["<keyword 1>", "<keyword 2>"],
      "missing": ["<keyword 1>", "<keyword 2>"],
      "recommendations": ["<rec 1>"]
    }
  },
  "actionableSteps": [
    {
      "priority": "high",
      "category": "<category>",
      "action": "<action>",
      "impact": "<impact>"
    }
  ],
  "industryBenchmark": {
    "performanceLevel": "<beginner/intermediate/advanced/expert>",
    "comparison": "<brief comparison>"
  }
}

IMPORTANT: Keep all text concise. Limit arrays to 3-5 items maximum. Keep descriptions under 100 characters each.

Resume Content:
{resumeText}

Return ONLY valid JSON. No markdown, no code blocks, just the JSON object.`;

/**
 * Job match analysis prompt
 * Compares resume against a specific job description
 */
export const JOB_MATCH_ANALYSIS_PROMPT = `You are an expert ATS system and recruitment specialist. Analyze how well the provided resume matches the given job description.

Compare the resume against the job requirements and return your analysis in the following JSON structure:

{
  "matchScore": <number 0-100>,
  "verdict": "<strong_match/good_match/moderate_match/weak_match>",
  "summary": "<2-3 sentence overview of the match quality>",
  "keywordMatch": {
    "score": <number 0-100>,
    "matched": ["<matched keyword>", ...],
    "missing": ["<missing critical keyword>", ...],
    "suggestions": ["<how to incorporate missing keywords>", ...]
  },
  "skillsMatch": {
    "score": <number 0-100>,
    "matched": ["<matched skill>", ...],
    "missing": ["<missing required skill>", ...],
    "transferable": ["<skill from resume that could be reframed>", ...]
  },
  "experienceMatch": {
    "score": <number 0-100>,
    "alignment": "<how experience aligns with requirements>",
    "gaps": ["<experience gap>", ...],
    "recommendations": ["<how to address gaps>", ...]
  },
  "recommendedChanges": [
    {
      "section": "<resume section>",
      "priority": "<critical/high/medium/low>",
      "change": "<specific change to make>",
      "reason": "<why this change improves match>"
    },
    ...
  ],
  "atsOptimization": {
    "currentATSFriendliness": <number 0-100>,
    "improvements": ["<ATS improvement>", ...]
  }
}

Job Description:
{jobDescription}

Resume Content:
{resumeText}

Be specific and provide actionable recommendations to improve the match score.`;

/**
 * Cover letter generation prompt - FIXED VERSION
 * Creates a tailored cover letter based on resume and job description
 */
export const COVER_LETTER_GENERATION_PROMPT = `You are an expert cover letter writer with extensive experience in helping candidates craft compelling, personalized cover letters that get interviews.

Based on the provided information, create a professional cover letter that:
- Opens with a strong hook that shows genuine interest
- Highlights 2-3 most relevant achievements from the resume
- Demonstrates understanding of the company and role
- Shows personality while maintaining professionalism
- Closes with a clear call to action
- Is concise (250-350 words)
- Uses active voice and strong action verbs
- Avoids clichés and generic statements

IMPORTANT FORMATTING INSTRUCTIONS:
- Start directly with the candidate's name on the first line (no labels like "[Your Name]")
- Use proper letter formatting with actual values, not placeholders
- Write in a natural, professional tone
- Do NOT include any bracketed instructions like [Your Address], [Date], etc.
- Use the actual company name and position title provided

Job Description:
{jobDescription}

Resume Summary:
{resumeSummary}

Company Name: {companyName}
Position: {positionTitle}
Candidate Name: {candidateName}

OUTPUT FORMAT (use actual values, no brackets):

{candidateName}
[Include contact info if available in resume, otherwise skip this line]

[Current Date]

{companyName} Hiring Team

Dear {companyName} Hiring Team,

[Opening paragraph with strong hook showing genuine interest in the role]

[Body paragraph 1: Highlight most relevant achievement from resume that matches job requirements]

[Body paragraph 2: Second achievement or skill demonstration with specific examples]

[Optional body paragraph 3: Additional relevant experience or unique value proposition]

[Closing paragraph with call to action and enthusiasm]

Sincerely,
{candidateName}

Generate the cover letter now. Output ONLY the formatted letter with actual values filled in. No explanations, no additional text.`;

/**
 * Resume improvement suggestions prompt
 * Provides specific rewrite suggestions for resume sections
 */
export const RESUME_IMPROVEMENT_PROMPT = `You are a professional resume writer. The user wants to improve a specific section of their resume.

Original Section Type: {sectionType}
Original Content:
{originalContent}

Context from full resume:
{resumeContext}

Target Industry/Role: {targetRole}

Provide 3 improved versions of this section, each with a different approach:

Return as JSON:
{
  "improvements": [
    {
      "version": 1,
      "approach": "<description of this approach>",
      "content": "<improved text>",
      "rationale": "<why this version is better>",
      "atsScore": <estimated improvement in ATS score>
    },
    {
      "version": 2,
      "approach": "<description of this approach>",
      "content": "<improved text>",
      "rationale": "<why this version is better>",
      "atsScore": <estimated improvement in ATS score>
    },
    {
      "version": 3,
      "approach": "<description of this approach>",
      "content": "<improved text>",
      "rationale": "<why this version is better>",
      "atsScore": <estimated improvement in ATS score>
    }
  ],
  "keyImprovements": ["<major improvement made>", ...],
  "tips": ["<additional tip for this section>", ...]
}

Focus on:
- Strong action verbs
- Quantifiable achievements
- Impact statements (not just responsibilities)
- ATS-friendly keywords
- Concise, powerful language`;

/**
 * Skills gap analysis prompt
 * Identifies missing skills for a target role
 */
export const SKILLS_GAP_ANALYSIS_PROMPT = `You are a career development expert specializing in skill gap analysis and career progression.

Analyze the candidate's current skills against the target role requirements and provide a comprehensive skills gap analysis.

Current Resume:
{resumeText}

Target Role/Industry:
{targetRole}

Return analysis as JSON:
{
  "currentSkillLevel": "<entry/junior/mid/senior/expert>",
  "targetSkillLevel": "<required level for role>",
  "skillsInventory": {
    "technical": ["<current technical skill>", ...],
    "soft": ["<current soft skill>", ...],
    "tools": ["<current tool/platform>", ...]
  },
  "skillGaps": {
    "critical": [
      {
        "skill": "<missing critical skill>",
        "importance": "<why it's critical>",
        "learningPath": "<how to acquire>",
        "timeframe": "<estimated time to learn>"
      },
      ...
    ],
    "recommended": [
      {
        "skill": "<recommended skill>",
        "importance": "<why it's valuable>",
        "learningPath": "<how to acquire>",
        "timeframe": "<estimated time to learn>"
      },
      ...
    ],
    "niceToHave": ["<skill>", ...]
  },
  "learningRoadmap": [
    {
      "phase": 1,
      "duration": "<timeframe>",
      "focus": ["<skill to learn>", ...],
      "resources": ["<suggested resource>", ...]
    },
    ...
  ],
  "transferableSkills": [
    {
      "currentSkill": "<skill from resume>",
      "targetApplication": "<how it applies to target role>",
      "howToFrame": "<how to present it>"
    },
    ...
  ]
}

Provide a realistic, actionable learning path that the candidate can follow.`;

/**
 * Resume keyword optimization prompt
 * Suggests strategic keyword placement
 */
export const KEYWORD_OPTIMIZATION_PROMPT = `You are an ATS optimization specialist. Analyze the resume and suggest strategic keyword improvements.

Resume Content:
{resumeText}

Target Role/Industry:
{targetRole}

Job Description (if available):
{jobDescription}

Return optimization suggestions as JSON:
{
  "currentKeywordDensity": <percentage>,
  "recommendedKeywordDensity": <percentage>,
  "missingCriticalKeywords": [
    {
      "keyword": "<missing keyword>",
      "importance": "<high/medium/low>",
      "suggestedPlacement": "<where to add it>",
      "contextExample": "<example sentence using the keyword naturally>"
    },
    ...
  ],
  "overusedKeywords": [
    {
      "keyword": "<overused keyword>",
      "currentCount": <number>,
      "recommendedCount": <number>,
      "alternatives": ["<alternative keyword>", ...]
    },
    ...
  ],
  "keywordsBySection": {
    "summary": ["<keyword for summary>", ...],
    "experience": ["<keyword for experience>", ...],
    "skills": ["<keyword for skills>", ...]
  },
  "atsOptimizationTips": ["<tip>", ...]
}

Ensure keywords are integrated naturally and contextually, not just listed.`;

/**
 * Interview preparation prompt based on resume
 * Generates likely interview questions
 */
export const INTERVIEW_PREP_PROMPT = `You are an interview coach preparing a candidate for their upcoming interview.

Based on the resume and job description, generate likely interview questions and suggested responses.

Resume Content:
{resumeText}

Job Description:
{jobDescription}

Return as JSON:
{
  "behavioralQuestions": [
    {
      "question": "<behavioral question>",
      "frameworkTip": "<STAR method guidance>",
      "suggestedApproach": "<how to structure answer>",
      "exampleFromResume": "<relevant experience to mention>"
    },
    ...
  ],
  "technicalQuestions": [
    {
      "question": "<technical question>",
      "topic": "<topic area>",
      "suggestedApproach": "<how to answer>",
      "keyPoints": ["<point to cover>", ...]
    },
    ...
  ],
  "situationalQuestions": [
    {
      "question": "<situational question>",
      "purpose": "<what interviewer is assessing>",
      "suggestedApproach": "<how to answer>"
    },
    ...
  ],
  "questionsToAsk": [
    {
      "question": "<question for interviewer>",
      "rationale": "<why this is a good question>",
      "category": "<role/culture/growth/etc>"
    },
    ...
  ],
  "weaknessInResume": [
    {
      "gap": "<potential concern>",
      "likelyQuestion": "<how it might be asked>",
      "suggestedResponse": "<how to address it positively>"
    },
    ...
  ]
}

Focus on helping the candidate tell their story effectively and handle challenging questions.`;

/**
 * Helper function to replace placeholders in prompts
 */
export function fillPromptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let filledPrompt = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    filledPrompt = filledPrompt.replace(new RegExp(placeholder, 'g'), value);
  }

  return filledPrompt;
}

/**
 * Prompt configuration with metadata
 */
export const PROMPT_CONFIG = {
  resumeAnalysis: {
    system: RESUME_ANALYSIS_SYSTEM_PROMPT,
    user: RESUME_ANALYSIS_PROMPT,
    maxTokens: 4096,
    temperature: 0.3,
  },
  jobMatch: {
    system: RESUME_ANALYSIS_SYSTEM_PROMPT,
    user: JOB_MATCH_ANALYSIS_PROMPT,
    maxTokens: 1500,
    temperature: 0.2,
  },
  coverLetter: {
    system: "You are an expert cover letter writer focused on creating compelling, personalized content.",
    user: COVER_LETTER_GENERATION_PROMPT,
    maxTokens: 2048,
    temperature: 0.7,
  },
  improvement: {
    system: "You are a professional resume writer specializing in impactful, ATS-optimized content.",
    user: RESUME_IMPROVEMENT_PROMPT,
    maxTokens: 1200,
    temperature: 0.5,
  },
  skillsGap: {
    system: "You are a career development expert specializing in skill assessment and learning paths.",
    user: SKILLS_GAP_ANALYSIS_PROMPT,
    maxTokens: 1500,
    temperature: 0.3,
  },
  keywordOptimization: {
    system: "You are an ATS optimization specialist focused on keyword strategy.",
    user: KEYWORD_OPTIMIZATION_PROMPT,
    maxTokens: 1000,
    temperature: 0.2,
  },
  interviewPrep: {
    system: "You are an experienced interview coach helping candidates prepare effectively.",
    user: INTERVIEW_PREP_PROMPT,
    maxTokens: 1800,
    temperature: 0.4,
  },
} as const;