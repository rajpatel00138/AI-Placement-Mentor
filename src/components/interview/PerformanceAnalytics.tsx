"use client";

import {
  TrendingUp,
  Target,
  Trophy,
  Brain,
} from "lucide-react";

const skills = [
  { name: "DSA", progress: 72, color: "bg-violet-500" },
  { name: "DBMS", progress: 84, color: "bg-green-500" },
  { name: "Operating System", progress: 65, color: "bg-orange-500" },
  { name: "Computer Networks", progress: 58, color: "bg-cyan-500" },
  { name: "HR", progress: 91, color: "bg-pink-500" },
];

const metrics = [
  {
    title: "Overall Readiness",
    value: "76%",
    icon: Target,
    color: "text-violet-400",
  },
  {
    title: "Average Score",
    value: "84%",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    title: "AI Confidence",
    value: "High",
    icon: Brain,
    color: "text-cyan-400",
  },
];

export default function PerformanceAnalytics() {
  return (
    <section className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Performance Analytics
        </h2>

        <p className="mt-2 text-slate-400">
          Track your interview readiness and monitor progress across important subjects.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

        {/* Skills */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="text-violet-400" />
            <h3 className="text-xl font-semibold text-white">
              Skill Progress
            </h3>
          </div>

          <div className="space-y-6">

            {skills.map((skill) => (

              <div key={skill.name}>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">
                    {skill.name}
                  </span>

                  <span className="text-white">
                    {skill.progress}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div
                    className={`h-3 rounded-full ${skill.color}`}
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

        <div className="space-y-5">

          {metrics.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      {item.value}
                    </h2>

                  </div>

                  <Icon
                    className={item.color}
                    size={34}
                  />

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </section>
  );
}