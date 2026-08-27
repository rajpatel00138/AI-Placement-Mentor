"use client";

import { Building2, Briefcase, Clock3, Gauge } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import InterviewTimer from "./InterviewTimer";

export default function SessionHeader() {
  const { state } = useInterview();

  const title = state.interviewType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-heading">
            {title} Interview
          </h1>

          <p className="mt-2 text-body-muted">
            Stay calm, answer confidently, and manage your time well.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
              <Building2 size={16} className="text-accent" />
              {state.company}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
              <Gauge size={16} className="text-accent" />
              {state.difficulty}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
              <Clock3 size={16} className="text-accent" />
              {state.duration} Minutes
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-base px-4 py-2 text-sm text-heading">
              <Briefcase size={16} className="text-accent" />
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