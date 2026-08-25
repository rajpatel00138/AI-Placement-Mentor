"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DomainBreakdownProps {
  averages: {
    dsa: number;
    coding: number;
    interview: number;
    resume: number;
    aptitude: number;
  };
}

export function DomainBreakdownChart({ averages }: DomainBreakdownProps) {
  const data = [
    { domain: "DSA", score: averages.dsa, full: "Data Structures & Algorithms" },
    { domain: "Coding", score: averages.coding, full: "Implementation & Speed" },
    { domain: "Interview", score: averages.interview, full: "Mock Interview & Comm" },
    { domain: "Resume", score: averages.resume, full: "ATS & Keyword Match" },
    { domain: "Aptitude", score: averages.aptitude, full: "Quantitative Reasoning" },
  ];

  return (
    <div className="rounded-[24px] border border-border bg-surface p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent font-semibold">Skill Pillars</p>
          <h3 className="text-lg font-semibold text-primary">Domain Performance Average</h3>
        </div>
        <span className="rounded-xl border border-border bg-soft px-3 py-1 text-xs font-medium text-primary">
          Target: 75+
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="domainGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3368A0" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#66A3BF" stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#D9D2C1" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="domain"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#1E2A32", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D9D2C1",
                borderRadius: "16px",
                color: "#1E2A32",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              formatter={(val: unknown, _name: unknown, entry: unknown) => {
                const entryData = entry as { payload?: { full?: string } };
                return [`${val ?? 0} / 100`, entryData.payload?.full || "Average Score"];
              }}
            />
            <Bar dataKey="score" fill="url(#domainGradient)" radius={[0, 8, 8, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
