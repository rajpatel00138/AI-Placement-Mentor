"use client";

import { ExternalLink } from "lucide-react";
import { Problem } from "@/types/dsa";
import { useDSAContext } from "./context/DSAContext";
import StatusDropdown from "./StatusDropdown";
import RevisionButtons from "./RevisionButtons";

interface ProblemRowProps {
  problem: Problem;
}

export default function ProblemRow({
  problem,
}: ProblemRowProps) {
  const {
    revisions,
    toggleRevision,
    status,
    updateStatus,
  } = useDSAContext();

  const revision =
    revisions[problem.id] ?? {
      r1: false,
      r2: false,
      r3: false,
      r4: false,
    };

  const currentStatus =
    status[problem.id] ?? "not-started";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-violet-500/40">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="flex-1">

          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-violet-400"
          >
            {problem.name}
            <ExternalLink size={16} />
          </a>

          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium
            ${
              problem.difficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>

        </div>

        {/* Status */}
        <div className="min-w-[180px]">
          <StatusDropdown
            value={currentStatus}
            onChange={(value) =>
              updateStatus(problem.id, value)
            }
          />
        </div>

        {/* Revision */}
        <RevisionButtons
          revision={revision}
          onToggle={(key) =>
            toggleRevision(problem.id, key)
          }
        />

      </div>

    </div>
  );
}