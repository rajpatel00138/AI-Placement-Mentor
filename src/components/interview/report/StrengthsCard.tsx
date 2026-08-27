"use client";

import { CheckCircle2 } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function StrengthsCard() {
  const { state } = useInterview();

  const strengths = state.evaluation?.strengths ?? [];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-heading">
        Strengths
      </h2>

      <div className="mt-6 space-y-4">
        {strengths.length > 0 ? (
          strengths.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border bg-base p-4"
            >
              <div className="flex-shrink-0 rounded-lg bg-success/10 p-1.5">
                <CheckCircle2
                  className="text-success"
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
            No strengths available.
          </div>
        )}
      </div>
    </div>
  );
}