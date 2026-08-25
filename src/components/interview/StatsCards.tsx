"use client";

import {
  Trophy,
  Brain,
  Flame,
  Mic,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Mock Interviews",
    value: "12",
    subtitle: "Completed Sessions",
    icon: Mic,
    iconBg: "bg-accent/15 border border-accent/30",
    iconColor: "text-accent",
  },
  {
    title: "Best Score",
    value: "92%",
    subtitle: "Highest Performance",
    icon: Trophy,
    iconBg: "bg-success/15 border border-success/30",
    iconColor: "text-success",
  },
  {
    title: "Current Streak",
    value: "8",
    subtitle: "Active Days",
    icon: Flame,
    iconBg: "bg-warning/15 border border-warning/30",
    iconColor: "text-warning",
  },
  {
    title: "AI Mentor Status",
    value: "Ready",
    subtitle: "Gemini 2.5 Flash",
    icon: Brain,
    iconBg: "bg-success/15 border border-success/30",
    iconColor: "text-success",
  },
];

export default function StatsCards() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted font-medium">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-primary">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-muted">
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
              <span className="text-xs text-muted">
                Updated just now
              </span>

              <ArrowUpRight
                size={16}
                className="text-muted transition group-hover:text-accent"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}