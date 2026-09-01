import mammoth from "mammoth";

/**
 * Extracts text from PDF bytes using pdfjs-dist legacy build with fallback.
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to support various runtime environments
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ");
      fullText += pageText + "\n";
    }

    if (fullText.trim().length > 20) {
      return fullText.trim();
    }
  } catch (pdfErr) {
    console.warn("pdfjs-dist extraction warning, using fallback buffer parser:", pdfErr);
  }

  // Fallback: simple text extraction from stream / buffer for plain text PDFs
  const raw = buffer.toString("utf-8");
  const extracted = raw
    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return extracted.slice(0, 10000);
}

/**
 * Extracts text from DOCX bytes using mammoth.
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (docxErr) {
    console.warn("DOCX extraction error:", docxErr);
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
  }
}

/**
 * Universal resume text parser for PDF, DOCX, and TXT files.
 */
export async function extractResumeText(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".docx")) {
    return await extractTextFromDocx(fileBuffer);
  }

  if (lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
    return fileBuffer.toString("utf-8").trim();
  }

  // Default to PDF parsing
  return await extractTextFromPdf(fileBuffer);
}
