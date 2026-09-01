export type InterviewType =
  | "hr"
  | "technical"
  | "dsa"
  | "dbms"
  | "os"
  | "cn"
  | "system-design"
  | "aptitude"
  | "pseudocode"
  | "pseudo-code";

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

  communication: number;
  technicalKnowledge: number;
  problemSolving: number;
  confidence: number;

  strengths: string[];
  weaknesses: string[];

  overalloverallFeedback: string;

  hiringRecommendation: {
    status:
      | "Strong Hire"
      | "Hire"
      | "Lean Hire"
      | "No Hire";

    confidence:
      | "High"
      | "Medium"
      | "Low";

    reason: string;
  };

  recommendedTopics: {
    topic: string;
    priority:
      | "High"
      | "Medium"
      | "Low";
  }[];

  suggestions: string[];
}
