import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResume(file: Buffer, fileType: string): Promise<string> {
    if (!file) throw new Error("No file provided");

    switch (fileType) {
        case "application/pdf": {
            const parser = new PDFParse({ data: file });
            const textResult = await parser.getText();
            if (typeof (parser as any).destroy === 'function') {
                await (parser as any).destroy();
            }
            return textResult.text;
        }

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            const result = await mammoth.extractRawText({ buffer: file });
            return result.value;
        }

        default:
            throw new Error(`Unsupported file type: ${fileType}`);
    }
}