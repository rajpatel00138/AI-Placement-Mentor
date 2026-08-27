"use client";

import {
  TrendingUp,
  Target,
  Trophy,
  Brain,
} from "lucide-react";

const skills = [
  { name: "DSA & Problem Solving", progress: 72, color: "bg-accent" },
  { name: "DBMS & SQL", progress: 84, color: "bg-accent-secondary" },
  { name: "Operating Systems", progress: 65, color: "bg-warning" },
  { name: "Computer Networks", progress: 58, color: "bg-accent-secondary" },
  { name: "HR & Behavioral", progress: 91, color: "bg-success" },
];

const metrics = [
  {
    title: "Overall Readiness",
    value: "76%",
    icon: Target,
    iconBg: "bg-accent/15 border border-accent/30",
    color: "text-accent",
  },
  {
    title: "Average Score",
    value: "84%",
    icon: Trophy,
    iconBg: "bg-success/15 border border-success/30",
    color: "text-success",
  },
  {
    title: "AI Confidence",
    value: "High",
    icon: Brain,
    iconBg: "bg-accent/15 border border-accent/30",
    color: "text-accent",
  },
];

export default function PerformanceAnalytics() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Performance Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Track your interview readiness and monitor progress across core placement domains.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Skills */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-2.5 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Domain Skill Progress
            </h3>
          </div>

          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1.5 flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-slate-800 dark:text-slate-200">
                    {skill.name}
                  </span>

                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {skill.progress}%
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-base border border-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skill.color} transition-all duration-700`}
                    style={{
                      width: `${skill.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Metrics */}
        <div className="space-y-4">
          {metrics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
                      {item.title}
                    </p>

                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`rounded-2xl ${item.iconBg} p-3.5 ${item.color}`}>
                    <Icon size={26} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}