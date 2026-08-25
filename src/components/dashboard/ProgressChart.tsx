"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export type ProgressChartProps = {
  data: Array<{ day: string; score: number }>;
};

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Weekly Progress</p>
          <h3 className="text-lg font-semibold text-primary">Performance trend</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3368A0" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3368A0" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#D9D2C1" strokeDasharray="4 4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D9D2C1",
                borderRadius: "16px",
                color: "#1E2A32",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />
            <Area type="monotone" dataKey="score" stroke="#3368A0" fill="url(#trend)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
