import { NextResponse } from "next/server";
import { parseResume } from "@/lib/parser";

export const runtime = 'nodejs';

export async function POST(req: Request) {

    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                error: "No file uploaded"
            }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const text = await parseResume(buffer, file.type);

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
