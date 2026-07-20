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
    value: "0",
    subtitle: "Completed",
    icon: Mic,
    gradient:
      "from-violet-500/20 to-fuchsia-500/10",
    iconBg:
      "bg-violet-500/20",
    iconColor:
      "text-violet-400",
  },
  {
    title: "Best Score",
    value: "0%",
    subtitle: "Highest Performance",
    icon: Trophy,
    gradient:
      "from-amber-500/20 to-orange-500/10",
    iconBg:
      "bg-amber-500/20",
    iconColor:
      "text-amber-400",
  },
  {
    title: "Current Streak",
    value: "0",
    subtitle: "Days",
    icon: Flame,
    gradient:
      "from-rose-500/20 to-red-500/10",
    iconBg:
      "bg-rose-500/20",
    iconColor:
      "text-rose-400",
  },
  {
    title: "AI Feedback",
    value: "Ready",
    subtitle: "Gemini Powered",
    icon: Brain,
    gradient:
      "from-cyan-500/20 to-sky-500/10",
    iconBg:
      "bg-cyan-500/20",
    iconColor:
      "text-cyan-400",
  },
];

export default function StatsCards() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${card.gradient} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10`}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 blur-3xl" />

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
                className={`rounded-2xl ${card.iconBg} p-3`}
              >
                <Icon
                  className={card.iconColor}
                  size={26}
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-500">
                Updated just now
              </span>

              <ArrowUpRight
                size={18}
                className="text-slate-500 transition group-hover:text-white"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}