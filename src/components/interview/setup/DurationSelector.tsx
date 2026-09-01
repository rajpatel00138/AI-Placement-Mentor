"use client";

import { useInterview } from "@/context/InterviewContext";
import { Clock3, CheckCircle2 } from "lucide-react";

const durations = [
  {
    id: 15,
    title: "15 Minutes",
    subtitle: "Quick Practice & Warmup",
  },
  {
    id: 30,
    title: "30 Minutes",
    subtitle: "Standard Round (Recommended)",
  },
  {
    id: 45,
    title: "45 Minutes",
    subtitle: "Full Company Drill",
  },
  {
    id: 60,
    title: "60 Minutes",
    subtitle: "Comprehensive Simulation",
  },
  {
    id: 90,
    title: "90 Minutes",
    subtitle: "Extended Marathon (50+ Qs)",
  },
  {
    id: 120,
    title: "120 Minutes",
    subtitle: "Full Scale Assessment (100 Qs)",
  },
];

export default function DurationSelector() {
  const { state, setDuration } = useInterview();

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 border border-accent/30 p-2 text-accent">
          <Clock3 size={18} />
        </div>

        <div>
          <h2 className="text-base font-bold text-heading">
            Interview Duration
          </h2>
          <p className="text-xs text-body-muted mt-0.5">
            Select the allocated time for your session.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {durations.map((duration) => {
          const active = state.duration === duration.id;

          return (
            <button
              key={duration.id}
              type="button"
              onClick={() => setDuration(duration.id)}
              className={`w-full rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent text-heading"
                  : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-heading">
                    {duration.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-body-muted">
                    {duration.subtitle}
                  </p>
                </div>

                {active && (
                  <CheckCircle2
                    className="text-accent"
                    size={20}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}