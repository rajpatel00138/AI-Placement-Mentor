"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Clock3,
  BarChart3,
} from "lucide-react";

const companies = [
  {
    name: "Google",
    difficulty: "hard",
    duration: "60 min",
    questions: 25,
  },
  {
    name: "Amazon",
    difficulty: "medium",
    duration: "45 min",
    questions: 20,
  },
  {
    name: "Microsoft",
    difficulty: "hard",
    duration: "60 min",
    questions: 25,
  },
  {
    name: "Zoho",
    difficulty: "medium",
    duration: "40 min",
    questions: 18,
  },
  {
    name: "Infosys",
    difficulty: "easy",
    duration: "30 min",
    questions: 15,
  },
  {
    name: "TCS",
    difficulty: "easy",
    duration: "30 min",
    questions: 15,
  },
];

export default function CompanyMockSection() {
  const router = useRouter();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Company Mock Interviews
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Practice company-specific interview rounds with AI-powered diagnostic feedback.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.name}
            className="group rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="rounded-2xl border border-accent/30 bg-soft p-3 text-accent transition-transform duration-300 group-hover:scale-105">
                <Building2 size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {company.name}
                </h3>

                <span className="inline-block rounded-md bg-base border border-border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {company.difficulty}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-slate-400" />
                <span>{company.duration} Duration</span>
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-slate-400" />
                <span>{company.questions} Questions</span>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/dashboard/interview/start?company=${encodeURIComponent(
                    company.name
                  )}&difficulty=${company.difficulty}`
                )
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2.5 text-xs font-semibold text-on-accent shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Mock</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}