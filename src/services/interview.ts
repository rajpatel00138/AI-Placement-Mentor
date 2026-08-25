import { evaluateInterview } from "@/lib/ai/interview";

export async function generateInterviewReport() {
  return evaluateInterview({
    interviewType: "technical",
    difficulty: "medium",
    company: "Google",

    questions: [],
  });
}