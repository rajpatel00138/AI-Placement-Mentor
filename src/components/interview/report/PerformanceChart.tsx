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
      score: evaluation?.technicalScore ?? 0,
    },
    {
      round: "Communication",
      score: evaluation?.communicationScore ?? 0,
    },
    {
      round: "Confidence",
      score: evaluation?.confidenceScore ?? 0,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-bold text-white">
        Performance Analysis
      </h2>

      <p className="mt-2 text-slate-400">
        Visual representation of your interview performance.
      </p>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" />

            <XAxis
              dataKey="round"
              stroke="#94A3B8"
            />

            <YAxis
              domain={[0, 100]}
              stroke="#94A3B8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}