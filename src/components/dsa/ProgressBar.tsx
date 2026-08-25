"use client";

import { Trophy, Target } from "lucide-react";

interface ProgressBarProps {
  total: number;
  solved: number;
}

export default function ProgressBar({
  total,
  solved,
}: ProgressBarProps) {
  const percentage =
    total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <div id="overall-progress" className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary">
            Overall Progress
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-muted">
            Keep solving consistently to reach your placement readiness target.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-soft p-3 text-accent">
          <Target
            size={22}
            className="text-accent"
          />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-muted">
          {solved} / {total} Problems Solved
        </span>

        <span className="font-bold text-sm text-accent">
          {percentage}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-elevated p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-warning/30 bg-warning/15 p-2 text-warning">
            <Trophy
              size={18}
              className="text-warning"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted font-medium">
              Current Milestone
            </p>

            <p className="text-sm font-semibold text-primary">
              Daily Practice Active
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            {percentage}%
          </p>

          <p className="text-xs text-muted">
            Completed
          </p>
        </div>
      </div>
    </div>
  );
}