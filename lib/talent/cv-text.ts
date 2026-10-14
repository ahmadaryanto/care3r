/**
 * Lightweight CV text extraction for PDF / DOCX / TXT uploads (no heavy parsers).
 * Files are read in memory and never written to disk.
 */

export const MAX_CV_BYTES = 5 * 1024 * 1024;
const ACCEPTED = /\.(pdf|docx?|txt|md|rtf)$/i;

export class CvFileError extends Error {}

export function validateCvFile(file: File) {
  if (file.size > MAX_CV_BYTES) throw new CvFileError("CV file is too large (max 5 MB).");
  if (!ACCEPTED.test(file.name)) throw new CvFileError("Upload a PDF, DOCX, or TXT file.");
}

export async function extractTextFromFile(file: File, maxChars = 20000): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".txt") || name.endsWith(".md") || file.type === "text/plain") {
    return buf.toString("utf8").slice(0, maxChars);
  }

  const raw = buf.toString("latin1");
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const matches = raw.match(/\((?:\\.|[^\\)]){3,}\)/g) || [];
    const fromParens = matches
      .map((m) =>
        m
          .slice(1, -1)
          .replace(/\\n/g, " ")
          .replace(/\\r/g, " ")
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")")
          .replace(/\\\\/g, "\\")
      )
      .filter((t) => /[A-Za-z]{3,}/.test(t) && t.length < 400)
      .join(" ");
    const streamText = (raw.match(/BT[\s\S]*?ET/g) || [])
      .join(" ")
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\s+/g, " ");
    return `${fromParens} ${streamText}`.slice(0, maxChars);
  }

  // DOCX is a zip: pull readable ASCII fragments.
  return raw
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}
