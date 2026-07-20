"use client";

import { useInterview } from "@/context/InterviewContext";
import { Clock3, CheckCircle2 } from "lucide-react";


const durations = [
  {
    id: 15,
    title: "15 Minutes",
    subtitle: "Quick Practice",
  },
  {
    id: 30,
    title: "30 Minutes",
    subtitle: "Standard Round",
  },
  {
    id: 45,
    title: "45 Minutes",
    subtitle: "Company Round",
  },
  {
    id: 60,
    title: "60 Minutes",
    subtitle: "Full Interview",
  },
];

export default function DurationSelector() {
    const {
        state,
        setDuration,
    } = useInterview();

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

      <div className="mb-6 flex items-center gap-3">
        <Clock3 className="text-violet-400" />

        <div>
          <h2 className="text-lg font-semibold text-white">
            Interview Duration
          </h2>

          <p className="text-sm text-slate-400">
            Select how long your interview should be.
          </p>
        </div>
      </div>

      <div className="space-y-3">

        {durations.map((duration) => {

          const active = state.duration === duration.id;

          return (

            <button
              key={duration.id}
              onClick={() => setDuration(duration.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                active
                  ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-violet-500/40"
              }`}
            >

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-white">
                    {duration.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {duration.subtitle}
                  </p>
                </div>

                {active && (
                  <CheckCircle2
                    className="text-green-400"
                    size={22}
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