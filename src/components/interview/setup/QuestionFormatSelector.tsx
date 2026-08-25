"use client";

import { FileText, CheckSquare, Shuffle } from "lucide-react";
import { useInterview, QuestionFormat } from "@/context/InterviewContext";

const formats: {
  value: QuestionFormat;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "descriptive",
    title: "Descriptive",
    description: "Answer interview questions in detail.",
    icon: <FileText size={22} />,
  },
  {
    value: "mcq",
    title: "MCQ",
    description: "Solve multiple choice interview questions.",
    icon: <CheckSquare size={22} />,
  },
  {
    value: "mixed",
    title: "Mixed",
    description: "Combination of descriptive and MCQs.",
    icon: <Shuffle size={22} />,
  },
];

export default function QuestionFormatSelector() {
  const {
    state: { questionFormat },
    setQuestionFormat,
  } = useInterview();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Question Format
      </h2>

      <p className="-mt-3 mb-6 text-sm text-slate-400">
        MCQ works best for aptitude practice.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {formats.map((format) => {
          const active = questionFormat === format.value;

          return (
            <button
              key={format.value}
              type="button"
              onClick={() => setQuestionFormat(format.value)}
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-slate-700 bg-slate-950 hover:border-violet-500/60"
              }`}
            >
              <div className="mb-4 text-violet-400">
                {format.icon}
              </div>

              <h3 className="font-semibold text-white">
                {format.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {format.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
