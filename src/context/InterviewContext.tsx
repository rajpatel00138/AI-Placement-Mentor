"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

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

export interface InterviewQuestion {
  id: number;
  question: string;
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

  language: string;

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

  setAnswer: (
    questionId: number,
    answer: string
  ) => void;

  nextQuestion: () => void;
  previousQuestion: () => void;

  startInterview: () => void;
  finishInterview: () => void;

  resetInterview: () => void;
}

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

    questions: [],
    currentQuestion: 0,
    answers: {},

    language: "English",

    isInterviewStarted: false,
    isInterviewFinished: false,
  });

  const update = <K extends keyof InterviewState>(
    key: K,
    value: InterviewState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setAnswer = (
    questionId: number,
    answer: string
  ) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const nextQuestion = () => {
    setState((prev) => {
      if (prev.questions.length === 0) {
        return prev;
      }

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
      if (prev.questions.length === 0) {
        return prev;
      }

      return {
        ...prev,
        currentQuestion: Math.max(
          prev.currentQuestion - 1,
          0
        ),
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
    setState((prev) => ({
      ...prev,
      isInterviewFinished: true,
    }));
  };

  const resetInterview = () => {
    setState({
      interviewType: "technical",
      difficulty: "medium",
      company: "Google",
      duration: 30,

      questions: [],
      currentQuestion: 0,
      answers: {},

      language: "English",

      isInterviewStarted: false,
      isInterviewFinished: false,
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        state,

        setInterviewType: (v) =>
          update("interviewType", v),

        setDifficulty: (v) =>
          update("difficulty", v),

        setCompany: (v) =>
          update("company", v),

        setDuration: (v) =>
          update("duration", v),

        setQuestions: (v) =>
          update("questions", v),

        setLanguage: (v) =>
          update("language", v),

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