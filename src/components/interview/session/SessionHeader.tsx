"use client";

import { Building2, Briefcase, Clock3, Gauge } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import InterviewTimer from "./InterviewTimer";

export default function SessionHeader() {
  const { state } = useInterview();

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-white">
                {state.interviewType
                    .split("-")
                    .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1)
                    )
                    .join(" ")}{" "}
                Interview
            </h1>

          <p className="mt-2 text-slate-400">
            Stay calm, answer confidently, and manage your time well.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              <Building2 size={16} />
              {state.company}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              <Gauge size={16} />
              {state.difficulty}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              <Clock3 size={16} />
              {state.duration} Minutes
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              <Briefcase size={16} />
              Live Interview
            </div>

          </div>
        </div>

        {/* Right */}
        <InterviewTimer />
      </div>
    </section>
  );        
}