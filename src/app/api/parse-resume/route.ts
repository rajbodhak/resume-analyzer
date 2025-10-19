import { NextResponse } from "next/server";
import { parseResume } from "@/lib/parser";

export const runtime = 'nodejs';

export async function POST(req: Request) {
    console.log("🚀 API Route Hit!");

    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;
        console.log("📄 File:", file?.name, file?.type, file?.size);

        if (!file) {
            return NextResponse.json({
                success: false,
                error: "No file uploaded"
            }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("✅ Buffer size:", buffer.length);

        const text = await parseResume(buffer, file.type);
        console.log("✅ Text extracted, length:", text.length);
        console.log("📝 First 200 chars:", text.substring(0, 200));

        return NextResponse.json({
            success: true,
            text
        });

    } catch (error) {
        console.error("💥 Error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to parse resume"
        }, { status: 500 });
    }
}
