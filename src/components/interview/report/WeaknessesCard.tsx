"use client";

import { AlertTriangle } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function WeaknessesCard() {
  const { state } = useInterview();

  const weaknesses = state.evaluation?.weaknesses ?? [];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-heading">
        Areas for Improvement
      </h2>

      <div className="mt-6 space-y-4">
        {weaknesses.length > 0 ? (
          weaknesses.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border bg-base p-4"
            >
              <div className="flex-shrink-0 rounded-lg bg-warning/10 p-1.5">
                <AlertTriangle
                  className="text-warning"
                  size={18}
                />
              </div>

              <span className="text-heading">
                {item}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-base p-4 text-body-muted">
            No weaknesses available.
          </div>
        )}
      </div>
    </div>
  );
}