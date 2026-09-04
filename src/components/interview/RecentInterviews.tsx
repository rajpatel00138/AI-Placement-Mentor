"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Clock3,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Bot,
} from "lucide-react";
import { FormattedInterviewRecord } from "@/types/interview";

interface RecentInterviewsProps {
  interviews?: FormattedInterviewRecord[];
  isLoading?: boolean;
}

export default function RecentInterviews({
  interviews = [],
  isLoading = false,
}: RecentInterviewsProps) {
  const router = useRouter();

  return (
    <section id="recent-interviews" className="space-y-5 scroll-mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Recent Interviews
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Continue your interview preparation or review previous completed sessions.
          </p>
        </div>

        {interviews.length > 0 && (
          <button
            onClick={() => router.push("/dashboard/interview/start")}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-soft hover:border-accent cursor-pointer"
          >
            New Session
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-soft/60 animate-pulse rounded-lg" />
          <div className="h-16 w-full bg-soft/40 animate-pulse rounded-xl" />
          <div className="h-16 w-full bg-soft/40 animate-pulse rounded-xl" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-surface/50 p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent mb-4">
            <Bot size={28} />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No mock interviews completed yet
          </h3>

          <p className="mt-2 max-w-md mx-auto text-sm text-slate-600 dark:text-slate-400">
            Select an interview category above or start a custom AI mock interview session to generate personalized diagnostic feedback and score ratings.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/dashboard/interview/start")}
              className="inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-5 py-2.5 text-sm font-semibold text-on-accent shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Start First Mock Interview</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {interviews.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex flex-col gap-4 p-5 transition hover:bg-soft/40 dark:hover:bg-soft/10 lg:flex-row lg:items-center lg:justify-between ${
                index !== interviews.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              {/* Left */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <span className="rounded-full bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-base border border-border px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {item.difficulty}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {item.dateFormatted}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} className="text-slate-400" />
                    {item.durationMin} min
                  </span>

                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500"
                    />
                    Completed
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
                    Score
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {item.score}%
                  </h2>
                </div>

                <button
                  onClick={() => router.push("/dashboard/interview/start")}
                  className="flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2 text-xs font-semibold text-on-accent shadow-sm transition hover:scale-105 cursor-pointer"
                >
                  <PlayCircle size={15} />
                  <span>Practice Again</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}