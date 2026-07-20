"use client";

import { AlertTriangle } from "lucide-react";

const weaknesses = [
  "Dynamic Programming",
  "Database Optimization",
  "System Design",
  "Confidence Under Pressure",
];

export default function WeaknessesCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-bold text-white">
        Areas to Improve
      </h2>

      <div className="mt-6 space-y-4">
        {weaknesses.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl bg-slate-950 p-4"
          >
            <AlertTriangle
              className="text-yellow-400"
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