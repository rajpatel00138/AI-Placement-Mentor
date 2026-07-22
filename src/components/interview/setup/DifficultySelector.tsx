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
    description: "Beginner friendly questions",
    icon: Shield,
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    id: "medium",
    title: "Medium",
    description: "Most interview questions",
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    id: "hard",
    title: "Hard",
    description: "Company-level challenges",
    icon: Skull,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
];

export default function DifficultySelector() {
  const {
        state,
        setDifficulty,
    } = useInterview();
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-bold text-white">
        Select Difficulty
      </h2>

      <p className="mt-2 text-slate-400">
        Choose the interview difficulty level.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon;
          const active =
          state.difficulty === difficulty.id;

          return (
            <button
              key={difficulty.id}
              onClick={() =>
                    setDifficulty(difficulty.id as Difficulty)
                }
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-violet-500/40"
              }`}
            >
              <div className={`inline-flex rounded-xl p-3 ${difficulty.bg}`}>
                <Icon
                  className={difficulty.color}
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {difficulty.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {difficulty.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}