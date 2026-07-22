import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL =
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";

export async function POST(req: NextRequest) {
  try {
    const {
      interviewType,
      difficulty,
      company,
      language,
      numberOfQuestions = 5,
    } = await req.json();

    const prompt = `
You are a Senior Software Engineering Interviewer.

Generate exactly ${numberOfQuestions} MULTIPLE CHOICE interview questions.

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Company:
${company}

Language:
${language}

Rules:
- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT wrap inside \`\`\`.
- Generate ONLY MCQ questions.
- Every question must have exactly 4 options.
- Only ONE option must be correct.
- expectedTime must be an integer.
- Questions should be suitable for ${company} interviews.

Return exactly:

[
  {
    "question": "Which data structure follows FIFO?",
    "options": [
      "Stack",
      "Queue",
      "Tree",
      "Graph"
    ],
    "correctAnswer": "Queue",
    "explanation": "Queue follows First In First Out.",
    "expectedTime": 2
  }
]
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(cleaned);
    } catch {
      throw new Error(
        `Gemini returned invalid JSON:\n\n${cleaned}`
      );
    }

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================");

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}