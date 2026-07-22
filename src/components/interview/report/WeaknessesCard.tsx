"use client";

import { AlertTriangle } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function WeaknessesCard() {
  const { state } = useInterview();

  const weaknesses = state.evaluation?.weaknesses ?? [];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-bold text-white">
        Areas for Improvement
      </h2>

      <div className="mt-6 space-y-4">
        {weaknesses.length > 0 ? (
          weaknesses.map((item) => (
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
          ))
        ) : (
          <div className="rounded-xl bg-slate-950 p-4 text-slate-400">
            No weaknesses available.
          </div>
        )}
      </div>
    </div>
  );
}