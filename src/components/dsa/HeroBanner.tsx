"use client";

import {
  ArrowRight,
  BookOpen,
  Flame,
  Target,
} from "lucide-react";
import useDSA from "./hooks/useDSA";

export default function HeroBanner() {
  const { totalProblems, solvedProblems } = useDSA();

  const handleContinue = () => {
    document
      .getElementById("problem-list")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
      {/* Background Subtle Glows */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        {/* Left Column */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen size={14} className="text-accent" />
            <span>AI Placement Mentor</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            DSA Practice Hub
          </h1>

          <p className="mt-3 max-w-2xl text-base sm:text-lg leading-7 text-muted">
            Master Data Structures & Algorithms with more than{" "}
            <span className="font-semibold text-primary">
              500 curated interview problems
            </span>
            , structured revision tracking, and predictive placement readiness.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-3 font-semibold text-on-accent shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Continue Solving</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("overall-progress")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-2xl border border-border bg-base px-6 py-3 font-semibold text-primary transition hover:bg-soft"
            >
              View Progress
            </button>
          </div>
        </div>

        {/* Right Stat Boxes */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Streak */}
          <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted font-medium">
                  Current Streak
                </p>

                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-primary">
                  14
                </h2>

                <p className="mt-1 text-xs text-warning font-semibold">
                  Active Days
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/30 bg-warning/15 text-warning">
                <Flame size={24} />
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="rounded-2xl border border-border bg-elevated p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted font-medium">
                  Daily Goal
                </p>

                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-primary">
                  5
                </h2>

                <p className="mt-1 text-xs text-accent font-semibold">
                  Target Problems
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent">
                <Target size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}