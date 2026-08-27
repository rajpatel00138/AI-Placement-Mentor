"use client";

import { FileText, CheckCircle2, Circle } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AnswerEditor() {
  const { state, setAnswer } = useInterview();

  const currentQuestion = state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return null;
  }

  const answer = state.answers[currentQuestion.id] ?? "";
  const isMCQ = currentQuestion.type === "mcq";

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
          <FileText size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-heading">
            Your Answer
          </h2>

          <p className="text-sm text-body-muted">
            {isMCQ
              ? "Choose the correct option."
              : "Write your answer clearly and completely."}
          </p>
        </div>
      </div>

      {isMCQ ? (
        <div className="mt-6 space-y-3">
          {currentQuestion.options?.map((option) => {
            const selected = answer === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setAnswer(currentQuestion.id, option)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-accent bg-accent/10 ring-1 ring-accent text-heading"
                    : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
                }`}
              >
                {selected ? (
                  <CheckCircle2 size={18} className="shrink-0 text-accent" />
                ) : (
                  <Circle size={18} className="shrink-0 text-body-muted" />
                )}
                <span className="text-heading">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            placeholder="Start typing your answer here..."
            className="mt-6 h-72 w-full resize-none rounded-2xl border border-border bg-base p-5 text-heading placeholder:text-body-muted outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          />

          <div className="mt-4 flex items-center justify-between text-sm text-body-muted">
            <span>Answer is automatically saved.</span>
            <span>{answer.length} Characters</span>
          </div>
        </>
      )}
    </section>
  );
}