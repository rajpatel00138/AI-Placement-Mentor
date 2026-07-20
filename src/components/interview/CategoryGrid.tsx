"use client";

import {
  Users,
  Laptop2,
  BrainCircuit,
  Database,
  Cpu,
  Network,
  Boxes,
  Building2,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "HR Interview",
    description: "Behavioral & communication round",
    icon: Users,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
  {
    title: "Technical Interview",
    description: "Core CS & programming concepts",
    icon: Laptop2,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    title: "DSA",
    description: "Coding & problem solving",
    icon: BrainCircuit,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    title: "DBMS",
    description: "SQL, Transactions & Queries",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    title: "Operating System",
    description: "Process, Threads & Scheduling",
    icon: Cpu,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    title: "Computer Networks",
    description: "TCP/IP, HTTP & Protocols",
    icon: Network,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  {
    title: "System Design",
    description: "Scalable architecture concepts",
    icon: Boxes,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
  {
    title: "Company Interviews",
    description: "Google, Amazon, Zoho & more",
    icon: Building2,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
];

export default function CategoryGrid() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Interview Categories
        </h2>

        <p className="mt-2 text-slate-400">
          Select a category and start practicing with AI-powered mock interviews.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.title}
              className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div
                className={`inline-flex rounded-2xl ${category.bg} p-3`}
              >
                <Icon
                  size={28}
                  className={category.color}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {category.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {category.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-violet-400 opacity-0 transition-all group-hover:opacity-100">
                <span className="text-sm font-medium">
                  Start Practice
                </span>

                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}