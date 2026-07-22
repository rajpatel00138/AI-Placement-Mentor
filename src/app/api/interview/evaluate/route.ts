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
      questions,
    } = await req.json();

    const prompt = `
You are an Expert Technical Interview Evaluator.

Evaluate the candidate based on the interview answers.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT wrap inside \`\`\`.

Return exactly this structure:

{
  "overallScore": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "problemSolving": 0,
  "confidence": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Company:
${company}

Questions and Answers:

${questions
  .map(
    (q: any, index: number) => `
Question ${index + 1}
${q.question}

Answer:
${q.answer}
`
  )
  .join("\n")}
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

    const evaluation = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      {
        status: 500,
      }
    );
  }
}