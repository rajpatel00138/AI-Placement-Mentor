"use client";

import {
  Trophy,
  Brain,
  MessageCircle,
  Zap,
} from "lucide-react";

const scores = [
  {
    title: "Overall",
    value: 82,
    icon: Trophy,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Technical",
    value: 85,
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Communication",
    value: 78,
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Confidence",
    value: 80,
    icon: Zap,
    color: "from-orange-500 to-yellow-500",
  },
];

export default function ScoreCard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {scores.map((score) => {
        const Icon = score.icon;

        return (
          <div
            key={score.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
          >
            <div
              className={`inline-flex rounded-2xl bg-gradient-to-r ${score.color} p-3`}
            >
              <Icon className="text-white" size={24} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-300">
              {score.title}
            </h3>

            <p className="mt-3 text-5xl font-bold text-white">
              {score.value}%
            </p>
          </div>
        );
      })}
    </div>
  );
}