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
  { name: "Computer Networks", progress: 58, color: "bg-warning" },
  { name: "HR & Behavioral", progress: 91, color: "bg-success" },
];

const metrics = [
  {
    title: "Overall Readiness",
    value: "76%",
    icon: Target,
    iconBg: "bg-accent/15 border-accent/30",
    color: "text-accent",
  },
  {
    title: "Average Score",
    value: "84%",
    icon: Trophy,
    iconBg: "bg-success/15 border-success/30",
    color: "text-success",
  },
  {
    title: "AI Confidence",
    value: "High",
    icon: Brain,
    iconBg: "bg-soft border-border",
    color: "text-accent",
  },
];

export default function PerformanceAnalytics() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">
          Performance Analytics
        </h2>

        <p className="mt-1 text-sm text-muted">
          Track your interview readiness and monitor progress across core placement domains.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Skills */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl border border-border bg-soft p-2.5 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-primary">
              Domain Skill Progress
            </h3>
          </div>

          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1.5 flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-primary">
                    {skill.name}
                  </span>

                  <span className="font-bold text-primary">
                    {skill.progress}%
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-border overflow-hidden">
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
                    <p className="text-xs uppercase tracking-wider text-muted font-medium">
                      {item.title}
                    </p>

                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-primary">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`rounded-2xl border ${item.iconBg} p-3.5 ${item.color}`}>
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