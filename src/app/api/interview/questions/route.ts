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
      questionFormat = "descriptive",
      numberOfQuestions = 5,
    } = await req.json();
    const prompt = `
You are a Senior Software Engineering Interviewer.

Generate exactly ${numberOfQuestions} interview questions.

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Company:
${company}

Language:
${language}

Question Format:
${questionFormat}

Rules:

- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT wrap inside \`\`\`.
- expectedTime must be an integer.

Question Format Rules:

1. If questionFormat = "descriptive"

Return ONLY descriptive questions.

Each object:

{
  "type":"descriptive",
  "question":"",
  "expectedTime":3
}

2. If questionFormat = "mcq"

Return ONLY MCQs.

Each object:

{
  "type":"mcq",
  "question":"",
  "options":[
    "",
    "",
    "",
    ""
  ],
  "correctAnswer":"",
  "explanation":"",
  "expectedTime":2
}

3. If questionFormat = "mixed"

Generate a balanced mix of descriptive and MCQ questions.

Return ONLY JSON array.
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