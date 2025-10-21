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


//Analyze resume with AI
export async function analyzeResume(resumeText: string, jobDescription?: string) {
    try {
        // Validate inputs
        if (!resumeText || resumeText.trim().length < 50) {
            throw new Error("Resume text is too short or empty");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: PROMPT_CONFIG.resumeAnalysis.temperature,
                maxOutputTokens: PROMPT_CONFIG.resumeAnalysis.maxTokens,
                responseMimeType: "application/json",
            },
        });

        let userPrompt: string;

        if (jobDescription && jobDescription.trim().length > 20) {
            // Job match analysis
            userPrompt = fillPromptTemplate(JOB_MATCH_ANALYSIS_PROMPT, {
                resumeText,
                jobDescription,
            });
        } else {
            // General resume analysis
            userPrompt = fillPromptTemplate(RESUME_ANALYSIS_PROMPT, {
                resumeText,
            });
        }

        // Create chat with system instruction
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: RESUME_ANALYSIS_SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I will provide detailed, professional resume analysis with actionable feedback." }],
                },
            ],
        });

        // Send analysis request
        const result = await chat.sendMessage(userPrompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON response
        let analysisData;
        try {
            analysisData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            throw new Error("AI returned invalid JSON format");
        }

        // Validate required fields
        if (!analysisData.overallScore || !analysisData.summary) {
            throw new Error("AI response missing required fields");
        }

        return {
            success: true,
            data: analysisData,
        };

    } catch (error) {
        console.error("Error in analyzeResume:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred during analysis",
        };
    }
}

// Generate cover letter based on resume and job description
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
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
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

//Get improvement suggestions for specific resume section
export async function getImprovementSuggestions(
    sectionType: string,
    originalContent: string,
    resumeContext: string,
    targetRole: string
) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 1200,
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

//Test function to verify API key and connection
export async function testGeminiConnection() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
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