"use client";

import { Check } from "lucide-react";

type RevisionState = {
  r1: boolean;
  r2: boolean;
  r3: boolean;
  r4: boolean;
};

interface RevisionButtonsProps {
  revision: RevisionState;
  onToggle: (revision: keyof RevisionState) => void;
}

const buttons: (keyof RevisionState)[] = [
  "r1",
  "r2",
  "r3",
  "r4",
];

export default function RevisionButtons({
  revision,
  onToggle,
}: RevisionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-medium text-slate-400 md:block">
        Revision
      </span>

      <div className="flex gap-2">
        {buttons.map((key, index) => {
          const completed = revision[key];

          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              title={`Revision ${index + 1}`}
              className={`
                flex h-10 min-w-[52px] items-center justify-center
                rounded-xl border px-3
                text-sm font-semibold
                transition-all duration-200
                hover:scale-105 active:scale-95

                ${
                  completed
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-blue-500 hover:text-white hover:bg-slate-800"
                }
              `}
            >
              {completed ? (
                <div className="flex items-center gap-1">
                  <Check size={14} />
                  <span>R{index + 1}</span>
                </div>
              ) : (
                <span>R{index + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}