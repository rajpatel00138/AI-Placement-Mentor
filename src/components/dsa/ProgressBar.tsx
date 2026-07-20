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
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Overall Progress
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Keep solving consistently to reach your goal.
          </p>
        </div>

        <div className="rounded-xl bg-blue-600/20 p-3">
          <Target
            size={22}
            className="text-blue-400"
          />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {solved} / {total} Problems Solved
        </span>

        <span className="font-semibold text-blue-400">
          {percentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-yellow-500/20 p-2">
            <Trophy
              size={18}
              className="text-yellow-400"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Current Progress
            </p>

            <p className="text-xs text-slate-400">
              Stay consistent every day.
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-white">
            {percentage}%
          </p>

          <p className="text-xs text-slate-400">
            Completed
          </p>
        </div>
      </div>
    </div>
  );
}