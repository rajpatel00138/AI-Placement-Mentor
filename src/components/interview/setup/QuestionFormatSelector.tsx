"use client";

import { FileText, CheckSquare, Shuffle } from "lucide-react";
import { useInterview, QuestionFormat } from "@/context/InterviewContext";

const formats: {
  value: QuestionFormat;
  title: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    value: "descriptive",
    title: "Descriptive",
    description: "Answer technical and behavioral questions in full detail.",
    icon: FileText,
  },
  {
    value: "mcq",
    title: "Multiple Choice (MCQ)",
    description: "Solve rapid multiple-choice questions with instant scoring.",
    icon: CheckSquare,
  },
  {
    value: "mixed",
    title: "Mixed Format",
    description: "Realistic mix of descriptive questions and MCQs.",
    icon: Shuffle,
  },
];

export default function QuestionFormatSelector() {
  const {
    state: { questionFormat },
    setQuestionFormat,
  } = useInterview();

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-heading">
        Question Format
      </h2>

      <p className="mt-1 text-xs sm:text-sm text-body-muted">
        Select whether you want open descriptive answers, MCQs, or a blended format.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {formats.map((format) => {
          const Icon = format.icon;
          const active = questionFormat === format.value;

          return (
            <button
              key={format.value}
              type="button"
              onClick={() => setQuestionFormat(format.value)}
              className={`flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent text-heading"
                  : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
              }`}
            >
              <div>
                <div
                  className={`inline-flex rounded-xl p-2.5 transition-colors ${
                    active
                      ? "bg-accent text-on-accent shadow-xs"
                      : "bg-accent/10 text-accent group-hover:bg-accent/20"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="mt-3.5 text-sm sm:text-base font-bold text-heading">
                  {format.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-body-muted">
                  {format.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
