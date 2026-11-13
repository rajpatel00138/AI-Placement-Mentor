"use client";

import { Shield, Flame, Skull } from "lucide-react";
import {
  useInterview,
  type Difficulty,
} from "@/context/InterviewContext";

const difficulties = [
  {
    id: "easy",
    title: "Easy",
    description: "Beginner friendly questions & foundational concepts",
    icon: Shield,
  },
  {
    id: "medium",
    title: "Medium",
    description: "Industry-standard placement interview questions",
    icon: Flame,
  },
  {
    id: "hard",
    title: "Hard",
    description: "Tier-1 company challenges & complex edge cases",
    icon: Skull,
  },
];

export default function DifficultySelector() {
  const { state, setDifficulty } = useInterview();

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-primary">
        Select Difficulty
      </h2>

      <p className="mt-1 text-xs sm:text-sm text-muted">
        Calibrate the depth and complexity of generated questions.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon;
          const active = state.difficulty === difficulty.id;

          return (
            <button
              key={difficulty.id}
              type="button"
              onClick={() => setDifficulty(difficulty.id as Difficulty)}
              className={`flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent"
                  : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10"
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

                <h3
                  className={`mt-3.5 text-base font-bold transition ${
                    active
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-900 dark:text-slate-100 group-hover:text-accent"
                  }`}
                >
                  {difficulty.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {difficulty.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}