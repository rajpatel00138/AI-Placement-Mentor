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
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
      {/* Background Subtle Glows */}
      <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles size={14} className="text-accent" />
            <span>AI Recommendation</span>
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Your next recommended interview
          </h2>

          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted">
            Based on your DSA diagnostic, interview performance history and detected weak topics,
            our AI recommends practicing a Technical Mock Interview focused on
            Arrays, Dynamic Programming and DBMS normalization.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98]">
              Start AI Interview
            </button>

            <button className="rounded-2xl border border-border bg-base px-6 py-3 text-sm font-semibold text-primary transition hover:bg-soft">
              View Learning Plan
            </button>
          </div>
        </div>

        {/* Right Recommended Targets */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-elevated p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-border bg-soft p-2.5 text-accent">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">
                  Technical Mock Interview
                </p>
                <p className="text-xs text-muted">
                  Recommended Today based on diagnostic
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-elevated p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-warning/30 bg-warning/15 p-2.5 text-warning">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">
                  Focus Weak Areas
                </p>
                <p className="text-xs text-muted">
                  Arrays • DP • DBMS Queries
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-elevated p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-success/30 bg-success/15 p-2.5 text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    Estimated Improvement
                  </p>
                  <p className="text-xs text-success font-semibold">
                    +12% Readiness Gain
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}