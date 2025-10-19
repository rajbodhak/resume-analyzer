import pdf from "pdf-parse";
import mammoth from 'mammoth';

export async function parseResume(file: Buffer, fileType: string): Promise<string> {
    if (!file) throw new Error("No file provided");

    switch (fileType) {
        case "application/pdf": {
            try {
                const data = await pdf(file);
                return data.text;
            } catch (error) {
                console.error("PDF parsing error:", error);
                throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            try {
                const result = await mammoth.extractRawText({ buffer: file });
                return result.value;
            } catch (error) {
                console.error("DOCX parsing error:", error);
                throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        default:
            throw new Error(`Unsupported file type: ${fileType}`);
    }
}