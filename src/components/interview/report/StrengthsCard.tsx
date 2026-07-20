"use client";

import { CheckCircle2 } from "lucide-react";

const strengths = [
  "Strong Problem Solving",
  "Good Communication",
  "Clean Code Structure",
  "Effective Time Management",
];

export default function StrengthsCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-bold text-white">
        Strengths
      </h2>

      <div className="mt-6 space-y-4">
        {strengths.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl bg-slate-950 p-4"
          >
            <CheckCircle2
              className="text-green-400"
              size={20}
            />

            <span className="text-slate-300">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}