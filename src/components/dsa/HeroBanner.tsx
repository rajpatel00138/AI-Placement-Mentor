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

  const progress =
    totalProblems === 0
      ? 0
      : Math.round((solvedProblems / totalProblems) * 100);


  const handleContinue = () => {
    document
      .getElementById("problem-list")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 shadow-2xl">

      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">

        {/* Left */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            <BookOpen size={16} />
            AI Placement Mentor
          </div>

          <h1 className="mt-5 text-5xl font-extrabold leading-tight text-white">
            DSA Practice Hub
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Master Data Structures & Algorithms with more than{" "}
            <span className="font-semibold text-white">
              500 curated interview problems
            </span>
            , revision tracking, and real placement preparation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Continue Solving
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
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              View Progress
            </button>

          </div>

        </div>

       <div className="grid grid-cols-2 gap-5">

          {/* Current Streak */}
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-6 transition-all duration-300 hover:-translate-y-1">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Current Streak
                </p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  0
                </h2>

                <p className="mt-2 text-sm text-orange-300">
                  Days
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
                <Flame
                  className="text-orange-400"
                  size={28}
                />
              </div>

            </div>

          </div>

          {/* Daily Goal */}
          <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/20 to-pink-500/5 p-6 transition-all duration-300 hover:-translate-y-1">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Daily Goal
                </p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  5
                </h2>

                <p className="mt-2 text-sm text-pink-300">
                  Problems
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
                <Target
                  className="text-pink-400"
                  size={28}
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}