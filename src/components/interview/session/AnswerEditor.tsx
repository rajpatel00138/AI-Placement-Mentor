"use client";

import { FileText } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AnswerEditor() {
  const {
    state,
    setAnswer,
  } = useInterview();

  const currentQuestion =
    state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return null;
  }

  const answer =
    state.answers[currentQuestion.id] ?? "";

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

      <div className="flex items-center gap-3">
        <FileText className="text-violet-400" />

        <div>
          <h2 className="text-xl font-bold text-white">
            Your Answer
          </h2>

          <p className="text-sm text-slate-400">
            Write your answer clearly and completely.
          </p>
        </div>
      </div>

      <textarea
        value={answer}
        onChange={(e) =>
          setAnswer(currentQuestion.id, e.target.value)
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

    </section>
  );
}