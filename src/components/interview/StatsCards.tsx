"use client";

import {
  Trophy,
  Brain,
  Flame,
  Mic,
  ArrowUpRight,
} from "lucide-react";
import { formatRelativeTime } from "@/types/interview";

interface StatsCardsProps {
  completedCount?: number;
  bestScore?: number;
  streakDays?: number;
  lastUpdated?: string | null;
  isLoading?: boolean;
}

export default function StatsCards({
  completedCount = 0,
  bestScore = 0,
  streakDays = 0,
  lastUpdated = null,
  isLoading = false,
}: StatsCardsProps) {
  const relativeUpdateTime = formatRelativeTime(lastUpdated);

  const stats = [
    {
      title: "Mock Interviews",
      value: isLoading ? "..." : String(completedCount),
      subtitle: completedCount === 1 ? "1 Completed Session" : `${completedCount} Completed Sessions`,
      icon: Mic,
      iconBg: "bg-accent/15 border border-accent/30",
      iconColor: "text-accent",
      timeText: completedCount > 0 ? relativeUpdateTime : "No sessions yet",
    },
    {
      title: "Best Score",
      value: isLoading ? "..." : bestScore > 0 ? `${bestScore}%` : "0%",
      subtitle: bestScore > 0 ? "Highest Performance" : "Take a mock test",
      icon: Trophy,
      iconBg: "bg-accent-secondary/15 border border-accent-secondary/30",
      iconColor: "text-accent-secondary",
      timeText: bestScore > 0 ? relativeUpdateTime : "No scores recorded",
    },
    {
      title: "Current Streak",
      value: isLoading ? "..." : `${streakDays}`,
      subtitle: streakDays === 1 ? "1 Active Day" : `${streakDays} Active Days`,
      icon: Flame,
      iconBg: "bg-amber-500/15 border border-amber-500/30",
      iconColor: "text-amber-500",
      timeText: streakDays > 0 ? `${streakDays}d continuous practice` : "No active streak",
    },
    {
      title: "AI Mentor Status",
      value: "Ready",
      subtitle: "Gemini 2.5 Flash",
      icon: Brain,
      iconBg: "bg-emerald-500/15 border border-emerald-500/30",
      iconColor: "text-emerald-500",
      timeText: "Online & Analyzing",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
          >
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {card.subtitle}
                </p>
              </div>

              <div className={`rounded-xl ${card.iconBg} p-3`}>
                <Icon
                  className={card.iconColor}
                  size={22}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {card.timeText}
              </span>

              <ArrowUpRight
                size={16}
                className="text-slate-400 transition group-hover:text-accent"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}