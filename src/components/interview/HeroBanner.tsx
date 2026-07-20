"use client";

import { ArrowRight, Brain, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 shadow-2xl">

      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">

        {/* Left */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400">
            <Brain size={16} />
            AI Placement Mentor
          </div>

          <h1 className="mt-5 text-5xl font-extrabold leading-tight text-white">
            Interview Practice Hub
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Practice HR, Technical, DSA, DBMS, OS and System Design interviews
            with AI-powered feedback and company-specific mock interviews.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/30">
              Start Mock Interview
              <ArrowRight size={18} />
            </button>

            <button className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white">
              Interview History
            </button>

          </div>

        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-transparent p-6">

            <p className="text-sm text-slate-400">
              Readiness
            </p>

            <h2 className="mt-2 text-5xl font-bold text-white">
              0%
            </h2>

            <p className="mt-2 text-sm text-violet-300">
              Placement Ready
            </p>

          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-transparent p-6">

            <div className="flex items-center gap-2">
              <Sparkles
                className="text-cyan-400"
                size={20}
              />

              <span className="text-sm text-slate-400">
                AI Feedback
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Ready
            </h2>

            <p className="mt-2 text-sm text-cyan-300">
              Gemini Integration
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}