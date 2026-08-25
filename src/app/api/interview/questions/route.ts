import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL =
  process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

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
    const aptitudeInstructions =
      interviewType === "aptitude"
        ? `
    This is a placement aptitude round. Cover a balanced mix of quantitative aptitude,
    logical reasoning, data interpretation, and verbal ability. Use realistic campus
    placement-test wording. For MCQs, provide four plausible options and exactly one
    unambiguous correct answer. Do calculations carefully before returning the answer.
    `
        : "";
    const prompt = `
    Generate exactly ${numberOfQuestions} ${difficulty} ${interviewType} interview questions.

    Company: ${company}
    Language: ${language}
    Format: ${questionFormat}
    ${aptitudeInstructions}

    Return ONLY a valid JSON array.

    For descriptive:
    {
      "type":"descriptive",
      "question":"",
      "expectedTime":3
    }

    For mcq:
    {
      "type":"mcq",
      "question":"",
      "options":["","","",""],
      "correctAnswer":"",
      "explanation":"",
      "expectedTime":2
    }
    `;
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        // Five MCQs with answers and explanations exceed 500 tokens and the
        // resulting truncated JSON prevents an interview from starting.
        maxOutputTokens: 4096,
      },
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

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Gemini did not return a valid list of interview questions.");
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
