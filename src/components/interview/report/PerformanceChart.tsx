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

const data = [
  {
    round: "Overall",
    score: 82,
  },
  {
    round: "Technical",
    score: 85,
  },
  {
    round: "Communication",
    score: 78,
  },
  {
    round: "Confidence",
    score: 80,
  },
];

export default function PerformanceChart() {
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

            <XAxis dataKey="round" stroke="#94A3B8" />

            <YAxis stroke="#94A3B8" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#8B5CF6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}