import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    RESUME_ANALYSIS_PROMPT,
    JOB_MATCH_ANALYSIS_PROMPT,
    fillPromptTemplate,
    COVER_LETTER_GENERATION_PROMPT,
    RESUME_IMPROVEMENT_PROMPT,
    PROMPT_CONFIG
} from "./prompts";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Enhanced validation for AI-generated analysis
 * Ensures the response is complete and usable before saving to DB
 */
function validateAnalysisResponse(analysisData: any, isJobMatch: boolean): {
    isValid: boolean;
    error?: string;
} {
    if (!analysisData || typeof analysisData !== 'object') {
        return { isValid: false, error: 'Invalid response format' };
    }

    if (isJobMatch) {
        // Job match validation
        if (typeof analysisData.matchScore !== 'number' ||
            analysisData.matchScore < 0 ||
            analysisData.matchScore > 100) {
            return { isValid: false, error: 'Invalid or missing matchScore' };
        }

        if (!analysisData.verdict ||
            !['strong_match', 'good_match', 'moderate_match', 'weak_match'].includes(analysisData.verdict)) {
            return { isValid: false, error: 'Invalid or missing verdict' };
        }

        if (!analysisData.summary || typeof analysisData.summary !== 'string' ||
            analysisData.summary.length < 30) {
            return { isValid: false, error: 'Summary is missing or too short' };
        }

        // Check for essential job match sections
        if (!analysisData.keywordMatch || !analysisData.skillsMatch) {
            return { isValid: false, error: 'Missing keyword or skills match analysis' };
        }

        // Validate keywordMatch structure
        if (!analysisData.keywordMatch.matched || !Array.isArray(analysisData.keywordMatch.matched)) {
            return { isValid: false, error: 'Invalid keywordMatch structure' };
        }

    } else {
        // Resume analysis validation
        if (typeof analysisData.overallScore !== 'number' ||
            analysisData.overallScore < 0 ||
            analysisData.overallScore > 100) {
            return { isValid: false, error: 'Invalid or missing overallScore' };
        }

        if (!analysisData.summary || typeof analysisData.summary !== 'string' ||
            analysisData.summary.length < 30) {
            return { isValid: false, error: 'Summary is missing or too short' };
        }

        // Check for at least one detailed section
        const hasDetailedAnalysis = analysisData.detailedAnalysis &&
            typeof analysisData.detailedAnalysis === 'object';
        const hasStrengthsWeaknesses =
            (Array.isArray(analysisData.strengths) && analysisData.strengths.length > 0) ||
            (Array.isArray(analysisData.weaknesses) && analysisData.weaknesses.length > 0);

        if (!hasDetailedAnalysis && !hasStrengthsWeaknesses) {
            return { isValid: false, error: 'Missing detailed analysis or strengths/weaknesses' };
        }
    }

    return { isValid: true };
}

/**
 * Analyze resume with AI (with enhanced validation)
 */
export async function analyzeResume(resumeText: string, jobDescription?: string) {
    const maxRetries = 2;
    let lastError: Error | null = null;

    // Try up to maxRetries times for flaky free API
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Validate inputs
            if (!resumeText || resumeText.trim().length < 50) {
                throw new Error("Resume text is too short or empty");
            }

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: PROMPT_CONFIG.resumeAnalysis.temperature,
                    maxOutputTokens: PROMPT_CONFIG.resumeAnalysis.maxTokens,
                    responseMimeType: "application/json",
                },
            });

            let userPrompt: string;
            const isJobMatch = !!(jobDescription && jobDescription.trim().length > 20);

            if (isJobMatch) {
                userPrompt = fillPromptTemplate(JOB_MATCH_ANALYSIS_PROMPT, {
                    resumeText,
                    jobDescription,
                });
            } else {
                userPrompt = fillPromptTemplate(RESUME_ANALYSIS_PROMPT, {
                    resumeText,
                });
            }

            // Create chat with system instruction
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: RESUME_ANALYSIS_SYSTEM_PROMPT + "\n\nIMPORTANT: Keep all responses concise. Return ONLY valid JSON with no truncation." }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I will provide detailed, professional resume analysis with actionable feedback in valid JSON format." }],
                    },
                ],
            });

            // Send analysis request with timeout
            const result = await Promise.race([
                chat.sendMessage(userPrompt),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('AI request timeout')), 30000)
                )
            ]) as any;

            const response = result.response;
            const text = response.text();

            // Parse JSON response
            let analysisData;
            try {
                analysisData = JSON.parse(text);
            } catch (parseError) {
                console.error(`❌ Failed to parse AI response (attempt ${attempt}):`);
                console.error('FULL RESPONSE:', text);
                throw new Error("AI returned invalid JSON format");
            }

            // Enhanced validation
            const validation = validateAnalysisResponse(analysisData, isJobMatch);
            if (!validation.isValid) {
                console.warn(`⚠️ Validation failed (attempt ${attempt}): ${validation.error}`);
                console.warn('Received data:', JSON.stringify(analysisData, null, 2).substring(0, 300));

                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                    continue;
                }

                throw new Error(`Analysis incomplete: ${validation.error}`);
            }

            // Success!
            return {
                success: true,
                data: analysisData,
                analysisType: isJobMatch ? 'job-match' : 'resume-analysis',
            };

        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            console.error(`❌ Error in analyzeResume (attempt ${attempt}/${maxRetries}):`, lastError.message);

            // If this is the last attempt, break
            if (attempt >= maxRetries) {
                break;
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    // All retries failed
    return {
        success: false,
        error: lastError?.message || "Failed to generate analysis after multiple attempts",
    };
}

/**
 * Generate cover letter based on resume and job description
 */
export async function generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    companyName: string,
    positionTitle: string,
    candidateName: string
) {
    try {
        if (!resumeText || !jobDescription || !companyName || !positionTitle) {
            throw new Error("Missing required information for cover letter generation");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });

        const prompt = fillPromptTemplate(
            COVER_LETTER_GENERATION_PROMPT,
            {
                jobDescription,
                resumeSummary: resumeText.substring(0, 1000),
                companyName,
                positionTitle,
                candidateName,
            }
        );

        const result = await model.generateContent(prompt);
        const coverLetter = result.response.text();

        // Validate cover letter is not too short
        if (coverLetter.length < 100) {
            throw new Error("Generated cover letter is too short");
        }

        return {
            success: true,
            data: { coverLetter },
        };

    } catch (error) {
        console.error("Error in generateCoverLetter:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate cover letter",
        };
    }
}

/**
 * Get improvement suggestions for specific resume section
 */
export async function getImprovementSuggestions(
    sectionType: string,
    originalContent: string,
    resumeContext: string,
    targetRole: string
) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
            },
        });

        const prompt = fillPromptTemplate(
            RESUME_IMPROVEMENT_PROMPT,
            {
                sectionType,
                originalContent,
                resumeContext,
                targetRole,
            }
        );

        const result = await model.generateContent(prompt);
        const suggestions = JSON.parse(result.response.text());

        return {
            success: true,
            data: suggestions,
        };

    } catch (error) {
        console.error("Error in getImprovementSuggestions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get suggestions",
        };
    }
}

/**
 * Test function to verify API key and connection
 */
export async function testGeminiConnection() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Say 'Connection successful' if you can read this.");
        return {
            success: true,
            message: result.response.text(),
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Connection failed",
        };
    }
}