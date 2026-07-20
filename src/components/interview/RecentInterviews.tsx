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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Interviews
          </h2>

          <p className="mt-2 text-slate-400">
            Continue your interview preparation or review previous sessions.
          </p>
        </div>

        <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500 hover:text-white">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {interviews.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
                    {item.company}
                  </span>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {item.difficulty}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {item.duration}
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-400"
                    />
                    {item.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    Score
                  </p>

                  <h2 className="text-3xl font-bold text-white">
                    {item.score}
                  </h2>
                </div>

                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-medium text-white transition hover:scale-105">
                  <PlayCircle size={18} />
                  {item.status === "Continue"
                    ? "Continue"
                    : "Review"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}