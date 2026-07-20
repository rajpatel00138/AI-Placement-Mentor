"use client";

import { HelpCircle, Tag, Clock3 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function QuestionCard() {
  const { state } = useInterview();

  const currentQuestion =
    state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-center text-slate-400">
          No questions available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

      <div className="flex items-center gap-3">
        <HelpCircle className="text-violet-400" />

        <div>
          <h2 className="text-xl font-bold text-white">
            Question {state.currentQuestion + 1}
          </h2>

          <p className="text-sm text-slate-400">
            Read the question carefully before answering.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <p className="text-lg leading-8 text-slate-200">
          {currentQuestion.question}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
          <Tag size={16} />
          {currentQuestion.difficulty}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
          <Clock3 size={16} />
          Expected Time: {currentQuestion.expectedTime} Minutes
        </div>

      </div>

    </section>
  );
}