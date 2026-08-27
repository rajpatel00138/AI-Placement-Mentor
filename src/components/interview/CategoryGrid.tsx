"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Laptop2,
  BrainCircuit,
  Database,
  Cpu,
  Network,
  Boxes,
  Calculator,
  Building2,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "HR Interview",
    type: "hr",
    description: "Behavioral questions, culture fit & STAR method responses",
    icon: Users,
  },
  {
    title: "Technical Interview",
    type: "technical",
    description: "Core CS principles, programming concepts & debugging",
    icon: Laptop2,
  },
  {
    title: "DSA & Problem Solving",
    type: "dsa",
    description: "Algorithms, complexity analysis & live coding explanations",
    icon: BrainCircuit,
  },
  {
    title: "Database Management",
    type: "dbms",
    description: "SQL queries, normalization, ACID properties & indexing",
    icon: Database,
  },
  {
    title: "Operating Systems",
    type: "os",
    description: "Processes, multithreading, concurrency, memory & deadlock",
    icon: Cpu,
  },
  {
    title: "Computer Networks",
    type: "cn",
    description: "TCP/IP, HTTP/S, DNS, OSI model layers & network security",
    icon: Network,
  },
  {
    title: "System Design",
    type: "system-design",
    description: "Scalable architecture, load balancers, caching & microservices",
    icon: Boxes,
  },
  {
    title: "Quantitative Aptitude",
    type: "aptitude",
    description: "Logical reasoning, arithmetic problems & data interpretation",
    icon: Calculator,
  },
  {
    title: "Company Specific",
    type: "technical",
    description: "Tailored interview rounds for Google, Amazon, Microsoft & TCS",
    icon: Building2,
  },
];

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Interview Categories
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Choose a domain and start practicing with AI-powered mock interviews.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.title}
              onClick={() =>
                router.push(`/dashboard/interview/start?type=${category.type}`)
              }
              className="group rounded-2xl border border-border bg-surface p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-md cursor-pointer"
            >
              <div className="inline-flex rounded-xl border border-accent/30 bg-soft p-3 text-accent transition-transform duration-300 group-hover:scale-105">
                <Icon size={22} className="text-accent" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition">
                {category.title}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {category.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                <span>Start Practice</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
