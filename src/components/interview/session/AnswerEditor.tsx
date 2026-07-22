"use client";

import { FileText, CheckCircle2 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AnswerEditor() {
  const { state, setAnswer } = useInterview();

  const currentQuestion =
    state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return null;
  }

  const answer =
    state.answers[currentQuestion.id] ?? "";

  const isMCQ =
    currentQuestion.type === "mcq";

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

      <div className="flex items-center gap-3">
        <FileText className="text-violet-400" />

        <div>
          <h2 className="text-xl font-bold text-white">
            Your Answer
          </h2>

          <p className="text-sm text-slate-400">
            {isMCQ
              ? "Choose the correct option."
              : "Write your answer clearly and completely."}
          </p>
        </div>
      </div>

      {isMCQ ? (
        <div className="mt-6 space-y-4">

          {currentQuestion.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setAnswer(currentQuestion.id, option)
              }
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                answer === option
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-violet-500/50"
              }`}
            >
              <CheckCircle2
                size={18}
                className={
                  answer === option
                    ? "text-violet-400"
                    : "text-slate-500"
                }
              />

              <span className="text-slate-200">
                {option}
              </span>
            </button>
          ))}

        </div>
      ) : (
        <>
          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(
                currentQuestion.id,
                e.target.value
              )
            }
            placeholder="Start typing your answer here..."
            className="mt-6 h-72 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-200 outline-none transition focus:border-violet-500"
          />

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>
              Answer is automatically saved.
            </span>

            <span>
              {answer.length} Characters
            </span>
          </div>
        </>
      )}
    </section>
  );
}