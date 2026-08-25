import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL =
  process.env.GEMINI_MODEL ??
  "gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      interviewType,
      difficulty,
      company,
    } = await req.json();

    const prompt = `
You are an expert technical interviewer.

The candidate is solving this interview question:

${question}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Company:
${company}

Rules:

- Give ONLY ONE hint.
- Maximum 2 sentences.
- Do NOT reveal the answer.
- Do NOT solve the question.
- Guide the candidate in the right direction.
`;

    const response =
      await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

    return NextResponse.json({
      success: true,
      hint: response.text?.trim(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate hint.",
      },
      {
        status: 500,
      }
    );
  }
}