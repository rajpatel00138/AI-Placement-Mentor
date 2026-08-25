"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Brain } from "lucide-react";

export default function HeroBanner() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
      {/* Background Subtle Glows */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Brain size={14} className="text-accent" />
            <span>AI Placement Mentor</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Interview Practice Hub
          </h1>

          <p className="mt-3 max-w-2xl text-base sm:text-lg leading-7 text-muted">
            Practice AI-powered mock interviews for HR, Technical, DSA, DBMS,
            Operating Systems and System Design with instant diagnostic scoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/dashboard/interview/start")}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-3 font-semibold text-on-accent shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Mock Interview</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push("/dashboard/interview/history")}
              className="rounded-2xl border border-border bg-base px-6 py-3 font-semibold text-primary transition hover:bg-soft"
            >
              Interview History
            </button>
          </div>
        </div>

        {/* Right Summary Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-elevated p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">Readiness</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">87%</h2>
          </div>

          <div className="rounded-2xl border border-border bg-elevated p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">Best Score</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-success">92</h2>
          </div>

          <div className="rounded-2xl border border-border bg-elevated p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">Completed</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">12</h2>
          </div>
        </div>
      </div>
    </section>
  );
}