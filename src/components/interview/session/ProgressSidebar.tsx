"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Flag,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/context/InterviewContext";

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

  const currentQuestionData = state.questions[state.currentQuestion];

  const hasAnsweredCurrentQuestion = currentQuestionData
    ? (state.answers[currentQuestionData.id] ?? "").trim().length > 0
    : false;

  const progress =
    totalQuestions === 0
      ? 0
      : (answeredQuestions / totalQuestions) * 100;

  const handleFinishInterview = async () => {
    try {
      setIsEvaluating(true);

      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <aside className="sticky top-6 h-fit rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-xl font-bold text-heading">
        Interview Progress
      </h2>

      <p className="mt-2 text-sm text-body-muted">
        Track your interview status.
      </p>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-body-muted">Progress</span>
          <span className="font-semibold text-heading">
            {answeredQuestions} / {totalQuestions}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft/40 dark:bg-soft/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-center text-xs text-body-muted">
          Question {currentQuestion} of {totalQuestions}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-base p-4">
          <div className="flex items-center gap-2 text-body-muted">
            <CheckCircle2 size={18} className="text-accent" />
            Answered
          </div>
          <span className="font-semibold text-heading">
            {answeredQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-base p-4">
          <div className="flex items-center gap-2 text-body-muted">
            <Clock3 size={18} className="text-accent" />
            Remaining
          </div>
          <span className="font-semibold text-heading">
            {totalQuestions - answeredQuestions}
          </span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 space-y-3">
        {/* Previous */}
        <button
          onClick={previousQuestion}
          disabled={state.currentQuestion === 0 || isEvaluating}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-base py-3 text-heading transition hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        {/* Next — accent filled */}
        <button
          onClick={nextQuestion}
          disabled={
            state.currentQuestion === totalQuestions - 1 ||
            isEvaluating ||
            !hasAnsweredCurrentQuestion
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ArrowRight size={18} />
        </button>

        {/* Finish — danger/destructive red */}
        <button
          onClick={handleFinishInterview}
          disabled={isEvaluating}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Flag size={18} />
              Finish Interview
            </>
          )}
        </button>
      </div>
    </aside>
  );
}