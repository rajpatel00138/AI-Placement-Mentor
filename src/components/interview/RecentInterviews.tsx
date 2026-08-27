"use client";

import {
  ArrowRight,
  Calendar,
  Clock3,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

const interviews = [
  {
    id: 1,
    title: "Technical Interview",
    company: "Google",
    score: "92%",
    difficulty: "Hard",
    duration: "48 min",
    date: "Today",
    status: "Completed",
  },
  {
    id: 2,
    title: "HR Interview",
    company: "Amazon",
    score: "85%",
    difficulty: "Medium",
    duration: "32 min",
    date: "Yesterday",
    status: "Completed",
  },
  {
    id: 3,
    title: "DSA Interview",
    company: "Microsoft",
    score: "--",
    difficulty: "Hard",
    duration: "In Progress",
    date: "2 days ago",
    status: "Continue",
  },
];

export default function RecentInterviews() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Recent Interviews
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Continue your interview preparation or review previous sessions.
          </p>
        </div>

        <button className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-soft cursor-pointer">
          View All
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {interviews.map((item, index) => (
          <div
            key={item.id}
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
                  {item.company}
                </span>

                <span className="rounded-full bg-base border border-border px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {item.difficulty}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  {item.date}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 size={14} className="text-slate-400" />
                  {item.duration}
                </span>

                <span className="flex items-center gap-1.5 text-success font-medium">
                  <CheckCircle2
                    size={14}
                    className="text-success"
                  />
                  {item.status}
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
                  {item.score}
                </h2>
              </div>

              <button className="flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2 text-xs font-semibold text-on-accent shadow-sm transition hover:scale-105 cursor-pointer">
                <PlayCircle size={15} />
                <span>{item.status === "Continue" ? "Continue" : "Review"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}