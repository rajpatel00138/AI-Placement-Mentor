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
    },
    {
      title: "Technical",
      value: evaluation?.technicalKnowledge ?? 0,
      icon: Brain,
    },
    {
      title: "Communication",
      value: evaluation?.communication ?? 0,
      icon: MessageCircle,
    },
    {
      title: "Confidence",
      value: evaluation?.confidence ?? 0,
      icon: Zap,
    },
  ];

  const getScoreColorClass = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    if (score >= 50) return "text-warning";
    return "text-error";
  };

  const getProgressColorClass = (score: number) => {
    if (score >= 85) return "bg-success";
    if (score >= 70) return "bg-warning";
    if (score >= 50) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {scores.map((score) => {
        const Icon = score.icon;

        return (
          <div
            key={score.title}
            className="rounded-3xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent"
          >
            <div className="inline-flex rounded-2xl bg-accent/10 p-3">
              <Icon className="text-accent" size={24} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-heading">
              {score.title}
            </h3>

            <p
              className={`mt-3 text-5xl font-bold ${getScoreColorClass(
                score.value
              )}`}
            >
              {score.value}%
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-soft">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getProgressColorClass(
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