"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useInterview } from "@/context/InterviewContext";

export default function PerformanceChart() {
  const { state } = useInterview();

  const evaluation = state.evaluation;

  const data = [
    {
      round: "Overall",
      score: evaluation?.overallScore ?? 0,
    },
    {
      round: "Technical",
      score: evaluation?.technicalKnowledge ?? 0,
    },
    {
      round: "Communication",
      score: evaluation?.communication ?? 0,
    },
    {
      round: "Confidence",
      score: evaluation?.confidence ?? 0,
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-heading">
        Performance Analysis
      </h2>

      <p className="mt-2 text-body-muted">
        Visual representation of your interview performance.
      </p>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="var(--color-border)" />

            <XAxis
              dataKey="round"
              stroke="var(--color-text-muted)"
            />

            <YAxis
              domain={[0, 100]}
              stroke="var(--color-text-muted)"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-elevated)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                borderRadius: "0.75rem",
              }}
              labelStyle={{ color: "var(--color-text-primary)" }}
              itemStyle={{ color: "var(--color-accent)" }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ r: 6, fill: "var(--color-accent)" }}
              activeDot={{ r: 8, fill: "var(--color-accent-hover)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}