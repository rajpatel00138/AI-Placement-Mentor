import { evaluateInterview } from "@/lib/ai/interviewEvaluator";

export async function generateInterviewReport() {
  return evaluateInterview({
    interviewType: "Technical",
    difficulty: "Medium",
    company: "Google",

    questions: [],
  });
}