"use client";

import { CheckCircle2 } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function StrengthsCard() {
  const { state } = useInterview();

  const strengths = state.evaluation?.strengths ?? [];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-bold text-white">
        Strengths
      </h2>

      <div className="mt-6 space-y-4">
        {strengths.length > 0 ? (
          strengths.map((item) => (
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
          ))
        ) : (
          <div className="rounded-xl bg-slate-950 p-4 text-slate-400">
            No strengths available.
          </div>
        )}
      </div>
    </div>
  );
}