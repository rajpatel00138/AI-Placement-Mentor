"use client";

import {
  ArrowRight,
  Building2,
  Clock3,
  BarChart3,
} from "lucide-react";

const companies = [
  {
    name: "Google",
    difficulty: "Hard",
    duration: "60 min",
    questions: 25,
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    name: "Amazon",
    difficulty: "Medium",
    duration: "45 min",
    questions: 20,
    color: "from-orange-500/20 to-yellow-500/10",
  },
  {
    name: "Microsoft",
    difficulty: "Hard",
    duration: "60 min",
    questions: 25,
    color: "from-green-500/20 to-emerald-500/10",
  },
  {
    name: "Zoho",
    difficulty: "Medium",
    duration: "40 min",
    questions: 18,
    color: "from-red-500/20 to-pink-500/10",
  },
  {
    name: "Infosys",
    difficulty: "Easy",
    duration: "30 min",
    questions: 15,
    color: "from-indigo-500/20 to-blue-500/10",
  },
  {
    name: "TCS",
    difficulty: "Easy",
    duration: "30 min",
    questions: 15,
    color: "from-slate-500/20 to-slate-700/10",
  },
];

export default function CompanyMockSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Company Mock Interviews
        </h2>

        <p className="mt-2 text-slate-400">
          Practice company-specific interview rounds with AI-powered feedback.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.name}
            className={`group rounded-3xl border border-slate-800 bg-gradient-to-br ${company.color} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-3">
                <Building2 className="text-white" size={26} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  {company.name}
                </h3>

                <p className="text-sm text-slate-300">
                  {company.difficulty} Level
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                {company.duration}
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 size={16} />
                {company.questions} Questions
              </div>
            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition-all hover:bg-violet-500">
              Start Mock
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}