"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  type InterviewType,
  type Difficulty,
  InterviewEvaluationResponse,
} from "@/lib/ai/types";

export type { InterviewType, Difficulty } from "@/lib/ai/types";

export type QuestionFormat =
  | "descriptive"
  | "mcq"
  | "mixed";

export interface InterviewQuestion {
  id: number;
  type: "descriptive" | "mcq";
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: Difficulty;
  expectedTime: number;
}

interface InterviewState {
  interviewType: InterviewType;
  difficulty: Difficulty;
  company: string;
  duration: number;

  questions: InterviewQuestion[];
  currentQuestion: number;
  answers: Record<number, string>;

  evaluation: InterviewEvaluationResponse | null;

  language: string;
  questionFormat: QuestionFormat;

  isInterviewStarted: boolean;
  isInterviewFinished: boolean;
}

interface InterviewContextType {
  state: InterviewState;

  setInterviewType: (type: InterviewType) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setCompany: (company: string) => void;
  setDuration: (duration: number) => void;
  setQuestions: (questions: InterviewQuestion[]) => void;
  setLanguage: (language: string) => void;
  setQuestionFormat: (format: QuestionFormat) => void;
  setEvaluation: (evaluation: InterviewEvaluationResponse | null) => void;
  setAnswer: (questionId: number, answer: string) => void;

  nextQuestion: () => void;
  previousQuestion: () => void;

  startInterview: () => void;
  finishInterview: () => void;
  resetInterview: () => void;
}

// Default sample questions so the session page is viewable directly during development
const defaultInitialQuestions: InterviewQuestion[] = [
  {
    id: 1,
    type: "mcq",
    question:
      "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "150 metres", "180 metres", "324 metres"],
    correctAnswer: "150 metres",
    explanation:
      "Speed = 60 × (5/18) = 50/3 m/sec. Length = Speed × Time = (50/3) × 9 = 150 metres.",
    difficulty: "medium",
    expectedTime: 2,
  },
  {
    id: 2,
    type: "descriptive",
    question:
      "Explain the difference between optimistic and pessimistic locking in database transaction management. When would you use each approach?",
    difficulty: "hard",
    expectedTime: 4,
  },
  {
    id: 3,
    type: "mcq",
    question:
      "Which data structure is primarily used for implementing an LRU (Least Recently Used) cache?",
    options: [
      "Stack and Array",
      "Doubly Linked List and Hash Map",
      "Binary Search Tree and Queue",
      "Min-Heap and Hash Map",
    ],
    correctAnswer: "Doubly Linked List and Hash Map",
    explanation:
      "A doubly linked list allows O(1) removals and insertions at head/tail, and a hash map provides O(1) lookups.",
    difficulty: "medium",
    expectedTime: 2,
  },
];

const InterviewContext =
  createContext<InterviewContextType | null>(null);

export function InterviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<InterviewState>({
    interviewType: "technical",
    difficulty: "medium",
    company: "Google",
    duration: 30,

    questions: defaultInitialQuestions,
    currentQuestion: 0,
    answers: {},

    evaluation: null,

    language: "English",
    questionFormat: "mixed",

    isInterviewStarted: true,
    isInterviewFinished: false,
  });

  const update = <K extends keyof InterviewState>(
    key: K,
    value: InterviewState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const setAnswer = (questionId: number, answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  };

  const setInterviewType = useCallback((type: InterviewType) => {
    setState((prev) => ({ ...prev, interviewType: type }));
  }, []);

  const nextQuestion = () => {
    setState((prev) => {
      if (prev.questions.length === 0) return prev;
      return {
        ...prev,
        currentQuestion: Math.min(
          prev.currentQuestion + 1,
          prev.questions.length - 1
        ),
      };
    });
  };

  const previousQuestion = () => {
    setState((prev) => {
      if (prev.questions.length === 0) return prev;
      return {
        ...prev,
        currentQuestion: Math.max(prev.currentQuestion - 1, 0),
      };
    });
  };

  const startInterview = () => {
    setState((prev) => ({
      ...prev,
      isInterviewStarted: true,
      currentQuestion: 0,
    }));
  };

  const finishInterview = () => {
    setState((prev) => ({ ...prev, isInterviewFinished: true }));
  };

  const resetInterview = () => {
    setState({
      interviewType: "technical",
      difficulty: "medium",
      company: "Google",
      duration: 30,

      questions: defaultInitialQuestions,
      currentQuestion: 0,
      answers: {},

      evaluation: null,

      language: "English",
      questionFormat: "mixed",

      isInterviewStarted: true,
      isInterviewFinished: false,
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        state,

        setInterviewType,
        setDifficulty: (v) => update("difficulty", v),
        setCompany: (v) => update("company", v),
        setDuration: (v) => update("duration", v),
        setQuestions: (v) => update("questions", v),
        setLanguage: (v) => update("language", v),
        setQuestionFormat: (v) => update("questionFormat", v),
        setEvaluation: (v) => update("evaluation", v),
        setAnswer,

        nextQuestion,
        previousQuestion,

        startInterview,
        finishInterview,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used inside InterviewProvider"
    );
  }

  return context;
}
