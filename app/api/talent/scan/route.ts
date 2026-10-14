import { NextRequest, NextResponse } from "next/server";
import { extractProfileFromCvText } from "@/lib/talent/extract";
import { CvFileError, extractTextFromFile, validateCvFile } from "@/lib/talent/cv-text";

export const runtime = "nodejs";

// Reads a CV (file or pasted text) and returns extracted profile fields.
// Nothing is stored here; the file is processed in memory only.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    let cv_text = String(form.get("cv_text") || "").trim().slice(0, 20000);
    let cv_file_name: string | undefined;

    const file = form.get("cv_file");
    if (file && file instanceof File && file.size > 0) {
      validateCvFile(file);
      cv_file_name = file.name;
      const extracted = await extractTextFromFile(file);
      if (extracted && extracted.length > 20) {
        cv_text = cv_text ? `${cv_text}\n\n${extracted}` : extracted;
      }
    }

    if (!cv_text || cv_text.length < 20) {
      return NextResponse.json(
        { error: "Could not read enough CV text. Upload a PDF/DOCX/TXT or paste CV text." },
        { status: 400 }
      );
    }

    const result = extractProfileFromCvText(cv_text);
    return NextResponse.json({ ...result, cv_file_name, scanned_chars: cv_text.length });
  } catch (err) {
    if (err instanceof CvFileError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("talent scan error", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
