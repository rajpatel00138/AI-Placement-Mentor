"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Brain } from "lucide-react";

interface HeroBannerProps {
  readinessScore?: number;
  bestScore?: number;
  completedCount?: number;
  isLoading?: boolean;
}

export default function HeroBanner({
  readinessScore = 0,
  bestScore = 0,
  completedCount = 0,
  isLoading = false,
}: HeroBannerProps) {
  const router = useRouter();

  const handleScrollToRecent = () => {
    const el = document.getElementById("recent-interviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm backdrop-blur-xl">
      {/* Background Subtle Glows */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            <Brain size={14} className="text-accent" />
            <span>AI Placement Mentor</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Interview Practice Hub
          </h1>

          <p className="mt-3 max-w-2xl text-base sm:text-lg leading-7 text-slate-600 dark:text-slate-300">
            Practice AI-powered mock interviews for HR, Technical, DSA, DBMS,
            Operating Systems and System Design with instant diagnostic scoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/dashboard/interview/start")}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-3 font-semibold text-on-accent shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Mock Interview</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleScrollToRecent}
              className="rounded-2xl border border-border bg-surface px-6 py-3 font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-soft cursor-pointer"
            >
              Interview History
            </button>
          </div>
        </div>

        {/* Right Summary Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-base p-4 text-center shadow-xs transition hover:border-accent/50">
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">Readiness</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isLoading ? "--" : `${readinessScore}%`}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-base p-4 text-center shadow-xs transition hover:border-accent/50">
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">Best Score</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-accent">
              {isLoading ? "--" : bestScore > 0 ? `${bestScore}%` : "0"}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-base p-4 text-center shadow-xs transition hover:border-accent/50">
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">Completed</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isLoading ? "--" : completedCount}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}