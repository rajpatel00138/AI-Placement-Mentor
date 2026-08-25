"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { ScoreDistributionBuckets } from "@/lib/analytics/types";

interface ScoreDistributionChartProps {
  distribution: ScoreDistributionBuckets;
}

export function ScoreDistributionChart({ distribution }: ScoreDistributionChartProps) {
  const data = [
    {
      category: "Needs Attention (0-40)",
      count: distribution.low,
      color: "#C1544D", // error
      gradient: "url(#errorGradient)",
    },
    {
      category: "Average / Readying (41-70)",
      count: distribution.medium,
      color: "#D99A3E", // warning
      gradient: "url(#warningGradient)",
    },
    {
      category: "Placement Ready (71-100)",
      count: distribution.high,
      color: "#4C9A6E", // success
      gradient: "url(#successGradient)",
    },
  ];

  return (
    <div className="rounded-[24px] border border-border bg-surface p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent font-semibold">Cohort Distribution</p>
          <h3 className="text-lg font-semibold text-primary">Readiness Score Buckets</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-error" /> 0–40</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> 41–70</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> 71–100</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C1544D" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#C1544D" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D99A3E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#D99A3E" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C9A6E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4C9A6E" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#D9D2C1" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D9D2C1",
                borderRadius: "16px",
                color: "#1E2A32",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              formatter={(value: unknown) => [`${value ?? 0} Candidates`, "Count"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={44}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.gradient} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
