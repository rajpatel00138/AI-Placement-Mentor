"use client";

import {
  Code2,
  CheckCircle2,
  TrendingUp,
  Target,
} from "lucide-react";
import useDSA from "./hooks/useDSA";

export default function StatsCards() {
  const { totalProblems, solvedProblems } = useDSA();

  const progress =
    totalProblems === 0
      ? 0
      : Math.round((solvedProblems / totalProblems) * 100);

  const stats = [
    {
      title: "Total Problems",
      value: totalProblems,
      subtitle: "Curated DSA Questions",
      icon: Code2,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Solved",
      value: solvedProblems,
      subtitle: "Completed Successfully",
      icon: CheckCircle2,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Progress",
      value: `${progress}%`,
      subtitle: "Overall Completion",
      icon: TrendingUp,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Daily Goal",
      value: "5",
      subtitle: "Problems Today",
      icon: Target,
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-700 bg-[#0f172a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-white">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`${card.iconBg} rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon
                  className={card.iconColor}
                  size={28}
                />
              </div>
            </div>

            {card.title === "Progress" && (
              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}