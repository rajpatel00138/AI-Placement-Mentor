export type InterviewType =
  | "hr"
  | "technical"
  | "dsa"
  | "dbms"
  | "os"
  | "cn"
  | "system-design";

export type Difficulty =
  | "easy"
  | "medium"
  | "hard";

export interface InterviewQuestionAnswer {
  question: string;
  answer: string;
}

export interface InterviewEvaluationRequest {
  interviewType: InterviewType;
  difficulty: Difficulty;
  company: string;
  questions: InterviewQuestionAnswer[];
}

export interface InterviewEvaluationResponse {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;

  strengths: string[];
  weaknesses: string[];
  recommendations: string[];

  feedback: string;

  hiringRecommendation:
    | "Strong Hire"
    | "Hire"
    | "Borderline"
    | "No Hire";
}