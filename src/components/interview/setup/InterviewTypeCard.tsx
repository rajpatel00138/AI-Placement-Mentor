"use client";

import {
  Users,
  Laptop2,
  BrainCircuit,
  Database,
  Cpu,
  Network,
  Boxes,
  Calculator,
} from "lucide-react";

import {
  useInterview,
  type InterviewType,
} from "@/context/InterviewContext";

const interviewTypes = [
  {
    id: "hr",
    title: "HR Interview",
    description: "Behavioral & communication round",
    icon: Users,
  },
  {
    id: "technical",
    title: "Technical",
    description: "Programming & core CS fundamentals",
    icon: Laptop2,
  },
  {
    id: "dsa",
    title: "DSA & Algorithms",
    description: "Live coding & algorithm challenges",
    icon: BrainCircuit,
  },
  {
    id: "dbms",
    title: "DBMS & SQL",
    description: "Database queries & schema design",
    icon: Database,
  },
  {
    id: "os",
    title: "Operating Systems",
    description: "Processes, threads & memory management",
    icon: Cpu,
  },
  {
    id: "cn",
    title: "Computer Networks",
    description: "Protocols, TCP/IP & network models",
    icon: Network,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalable architecture & distributed systems",
    icon: Boxes,
  },
  {
    id: "aptitude",
    title: "Aptitude Round",
    description: "Quantitative, logical & verbal reasoning",
    icon: Calculator,
  },
];

export default function InterviewTypeCard() {
  const { state, setInterviewType } = useInterview();

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-heading">
        Select Interview Type
      </h2>

      <p className="mt-1 text-xs sm:text-sm text-body-muted">
        Choose the specialized focus domain for this practice interview.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {interviewTypes.map((type) => {
          const Icon = type.icon;
          const active = state.interviewType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setInterviewType(type.id as InterviewType)}
              className={`group flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent text-heading"
                  : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
              }`}
            >
              <div>
                <div
                  className={`inline-flex rounded-xl p-2.5 transition-colors ${
                    active
                      ? "bg-accent text-on-accent shadow-xs"
                      : "bg-accent/10 text-accent group-hover:bg-accent/20"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="mt-3.5 text-sm sm:text-base font-bold text-heading">
                  {type.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-body-muted">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
