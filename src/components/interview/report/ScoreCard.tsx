"use client";

import {
  Trophy,
  Brain,
  MessageCircle,
  Zap,
} from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function ScoreCard() {
  const { state } = useInterview();

  const evaluation = state.evaluation;

  const scores = [
    {
      title: "Overall",
      value: evaluation?.overallScore ?? 0,
      icon: Trophy,
      color: "from-violet-500 to-indigo-500",
    },
    {
      title: "Technical",
      value: evaluation?.technicalKnowledge ?? 0,
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Communication",
      value: evaluation?.communication ?? 0,
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Confidence",
      value: evaluation?.confidence ?? 0,
      icon: Zap,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {scores.map((score) => {
        const Icon = score.icon;

        return (
          <div
            key={score.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-violet-500"
          >
            <div
              className={`inline-flex rounded-2xl bg-gradient-to-r ${score.color} p-3`}
            >
              <Icon className="text-white" size={24} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-300">
              {score.title}
            </h3>

            <p
              className={`mt-3 text-5xl font-bold ${getScoreColor(
                score.value
              )}`}
            >
              {score.value}%
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getProgressColor(
                  score.value
                )}`}
                style={{
                  width: `${score.value}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}