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
      iconBg: "bg-accent/15 border border-accent/30",
      iconColor: "text-accent",
    },
    {
      title: "Solved",
      value: solvedProblems,
      subtitle: "Completed Successfully",
      icon: CheckCircle2,
      iconBg: "bg-success/15 border border-success/30",
      iconColor: "text-success",
    },
    {
      title: "Progress",
      value: `${progress}%`,
      subtitle: "Overall Completion",
      icon: TrendingUp,
      iconBg: "bg-accent-secondary/15 border border-accent-secondary/30",
      iconColor: "text-accent-secondary",
    },
    {
      title: "Daily Goal",
      value: "5",
      subtitle: "Problems Today",
      icon: Target,
      iconBg: "bg-warning/15 border border-warning/30",
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-primary">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-muted">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`${card.iconBg} rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon
                  className={card.iconColor}
                  size={24}
                />
              </div>
            </div>

            {card.title === "Progress" && (
              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-700"
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