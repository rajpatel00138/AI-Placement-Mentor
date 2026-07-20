"use client";

import {
  Users,
  Laptop2,
  BrainCircuit,
  Database,
  Cpu,
  Network,
  Boxes,
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
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
  {
    id: "technical",
    title: "Technical",
    description: "Programming & core CS",
    icon: Laptop2,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    id: "dsa",
    title: "DSA",
    description: "Coding interview",
    icon: BrainCircuit,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    id: "dbms",
    title: "DBMS",
    description: "SQL & Database",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    id: "os",
    title: "Operating System",
    description: "Process & Memory",
    icon: Cpu,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    id: "cn",
    title: "Computer Networks",
    description: "TCP/IP & Protocols",
    icon: Network,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalable Architecture",
    icon: Boxes,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
];

export default function InterviewTypeCard() {
    const {
        state,
        setInterviewType,
    } = useInterview();

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-bold text-white">
        Select Interview Type
      </h2>

      <p className="mt-2 text-slate-400">
        Choose the interview you want to practice.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {interviewTypes.map((type) => {
          const Icon = type.icon;
          const active =
          state.interviewType === type.id;

          return (
            <button
              key={type.id}
              onClick={() =>
                   setInterviewType(type.id as InterviewType)
                }
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-violet-500/40"
              }`}
            >
              <div
                className={`inline-flex rounded-xl p-3 ${type.bg}`}
              >
                <Icon
                  size={24}
                  className={type.color}
                />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                {type.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}