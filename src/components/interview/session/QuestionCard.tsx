"use client";

import { HelpCircle, Tag, Clock3 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function QuestionCard() {
  const { state } = useInterview();

  const currentQuestion = state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return (
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-center text-body-muted">
          No questions available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
          <HelpCircle size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-heading">
            Question {state.currentQuestion + 1}
          </h2>

          <p className="text-sm text-body-muted">
            Read the question carefully before answering.
          </p>
        </div>
      </div>

      {/* Question body */}
      <div className="mt-6 rounded-2xl border border-border bg-base p-6">
        <p className="text-base leading-8 text-heading">
          {currentQuestion.question}
        </p>
      </div>

      {/* Meta tags */}
      <div className="mt-6 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
          <Tag size={16} className="text-accent" />
          {currentQuestion.difficulty}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
          <Clock3 size={16} className="text-accent" />
          Expected Time: {currentQuestion.expectedTime} Minutes
        </div>

      </div>

    </section>
  );
}