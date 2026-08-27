"use client";

import {
  Sparkles,
  Brain,
  ArrowRight,
  Target,
  TrendingUp,
} from "lucide-react";

export default function AIRecommendationPanel() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm backdrop-blur-xl">
      {/* Background Subtle Glows */}
      <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-accent-secondary/10 blur-3xl pointer-events-none" />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles size={14} className="text-accent" />
            <span>AI Recommendation</span>
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Your next recommended interview
          </h2>

          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Based on your DSA diagnostic, interview performance history and detected weak topics,
            our AI recommends practicing a Technical Mock Interview focused on
            Arrays, Dynamic Programming and DBMS normalization.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Start AI Interview
            </button>

            <button className="rounded-2xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-soft cursor-pointer">
              View Learning Plan
            </button>
          </div>
        </div>

        {/* Right Recommended Targets */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-base p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-2.5 text-accent">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Technical Mock Interview
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Recommended Today based on diagnostic
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-base p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-accent-secondary/30 bg-accent-secondary/10 p-2.5 text-accent-secondary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Focus Weak Areas
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Arrays • DP • DBMS Queries
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-base p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-success/30 bg-success/10 p-2.5 text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Estimated Improvement
                  </p>
                  <p className="text-xs text-success font-semibold">
                    +12% Readiness Gain
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}