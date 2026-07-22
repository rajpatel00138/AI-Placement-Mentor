import { ai } from "./client";
import { INTERVIEW_EVALUATION_PROMPT } from "./prompts";
import { safeParseJson } from "./utils";

import type {
  InterviewEvaluationRequest,
  InterviewEvaluationResponse,
} from "./types";

export async function evaluateInterview(
  request: InterviewEvaluationRequest
): Promise<InterviewEvaluationResponse> {
  const prompt = `
${INTERVIEW_EVALUATION_PROMPT}

Interview Type:
${request.interviewType}

Difficulty:
${request.difficulty}

Company:
${request.company}

Questions and Answers:

${request.questions
  .map(
    (item, index) => `
Question ${index + 1}:
${item.question}

Answer:
${item.answer}
`
  )
  .join("\n")}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim() ?? "";

  return safeParseJson<InterviewEvaluationResponse>(text);
}