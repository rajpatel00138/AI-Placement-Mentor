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
    <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 via-slate-900 to-slate-950 p-8">

      <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">

        {/* Left */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-300">
            <Sparkles size={16} />
            AI Recommendation
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Your next recommended interview
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Based on your DSA progress, interview history and weak topics,
            our AI recommends practicing a Technical Interview focused on
            Arrays, Dynamic Programming and DBMS.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:scale-105">
              Start AI Interview
            </button>

            <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white">
              View Learning Plan
            </button>

          </div>

        </div>

        {/* Right */}
        <div className="space-y-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3">
              <Brain className="text-violet-400" />
              <div>
                <p className="text-white font-semibold">
                  Technical Interview
                </p>
                <p className="text-sm text-slate-400">
                  Recommended Today
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3">
              <Target className="text-cyan-400" />
              <div>
                <p className="text-white font-semibold">
                  Weak Areas
                </p>
                <p className="text-sm text-slate-400">
                  Arrays • DP • DBMS
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-400" />
                <div>
                  <p className="font-semibold text-white">
                    Estimated Improvement
                  </p>
                  <p className="text-sm text-slate-400">
                    +12% readiness
                  </p>
                </div>
              </div>

              <ArrowRight className="text-violet-400" />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}