"use client";

import { ExternalLink } from "lucide-react";
import { TrackerProblem as Problem } from "@/types/dsa";
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
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-sm transition hover:border-accent/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex-1">
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base font-bold text-primary hover:text-accent transition"
          >
            <span>{problem.name}</span>
            <ExternalLink size={15} className="text-muted hover:text-accent" />
          </a>

          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
              ${
                problem.difficulty === "Easy"
                  ? "bg-success/15 text-success border border-success/30"
                  : problem.difficulty === "Medium"
                  ? "bg-warning/15 text-warning border border-warning/30"
                  : "bg-error/15 text-error border border-error/30"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="min-w-[170px]">
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