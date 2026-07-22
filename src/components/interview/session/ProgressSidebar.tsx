"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Flag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useInterview } from "@/context/InterviewContext";
// import { evaluateInterview } from "@/lib/ai/interview";  

export default function ProgressSidebar() {
  const router = useRouter();

  const {
    state,
    nextQuestion,
    previousQuestion,
    finishInterview,
    setEvaluation,
  } = useInterview();

  const [isEvaluating, setIsEvaluating] = useState(false);

  const totalQuestions = state.questions.length;

  const currentQuestion = state.currentQuestion + 1;

  const answeredQuestions = Object.values(state.answers).filter(
    (answer) => answer.trim().length > 0
  ).length;

  const progress =
    totalQuestions === 0
      ? 0
      : (currentQuestion / totalQuestions) * 100;

  const handleFinishInterview = async () => {
  try {
    setIsEvaluating(true);

    const response = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewType: state.interviewType,
        difficulty: state.difficulty,
        company: state.company,
        questions: state.questions.map((q) => ({
          question: q.question,
          answer: state.answers[q.id] ?? "",
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Evaluation failed.");
    }

    setEvaluation(data.evaluation);

    finishInterview();

    router.push("/dashboard/interview/report");
  } catch (error) {
    console.error("Interview evaluation failed:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to evaluate interview."
    );
  } finally {
    setIsEvaluating(false);
  }
};

  return (
    <aside className="sticky top-6 h-fit rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-bold text-white">
        Interview Progress
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Track your interview status.
      </p>

      {/* Progress */}

      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">
            Progress
          </span>

          <span className="font-semibold text-white">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Stats */}

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={18} />
            Answered
          </div>

          <span className="font-semibold text-white">
            {answeredQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock3 size={18} />
            Remaining
          </div>

          <span className="font-semibold text-white">
            {totalQuestions - answeredQuestions}
          </span>
        </div>
      </div>

      {/* Navigation */}

      <div className="mt-8 space-y-3">
        <button
          onClick={previousQuestion}
          disabled={
            state.currentQuestion === 0 || isEvaluating
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-white transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={
            state.currentQuestion === totalQuestions - 1 ||
            isEvaluating
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ArrowRight size={18} />
        </button>

        <button
          onClick={handleFinishInterview}
          disabled={isEvaluating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Flag size={18} />
          {isEvaluating
            ? "Evaluating..."
            : "Finish Interview"}
        </button>
      </div>
    </aside>
  );
}