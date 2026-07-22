import { ai } from "./client";
import { safeParseJson } from "./utils";

import type { Difficulty, InterviewType } from "./types";
import type { InterviewQuestion } from "@/context/InterviewContext";

interface GenerateQuestionsRequest {
  interviewType: InterviewType;
  difficulty: Difficulty;
  company: string;
  language: string;
  numberOfQuestions?: number;
}

export async function generateInterviewQuestions(
  request: GenerateQuestionsRequest
): Promise<InterviewQuestion[]> {
  const prompt = `
You are a Senior Software Engineering Interviewer.

Generate exactly ${request.numberOfQuestions ?? 5} interview questions.

Interview Type:
${request.interviewType}

Difficulty:
${request.difficulty}

Company:
${request.company}

Language:
${request.language}

Rules:

- Return ONLY valid JSON.
- Do NOT return markdown.
- Do NOT wrap the response inside \`\`\`json.
- Do NOT add explanations.
- Each question must be unique.
- expectedTime must be an integer in minutes.

Return EXACTLY this format:

[
  {
    "question": "...",
    "expectedTime": 3
  }
]
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim() ?? "";

  const parsed = safeParseJson<
    {
      question: string;
      expectedTime?: number;
    }[]
  >(text);

  return parsed.map((q, index) => ({
    id: index + 1,
    question: q.question,
    difficulty: request.difficulty,
    expectedTime: q.expectedTime ?? 3,
  }));
}