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
      <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted md:block">
        Revision
      </span>

      <div className="flex gap-1.5">
        {buttons.map((key, index) => {
          const completed = revision[key];

          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              title={`Revision ${index + 1}`}
              className={`
                flex h-9 min-w-[48px] items-center justify-center
                rounded-xl border px-2.5
                text-xs font-bold
                transition-all duration-200
                hover:scale-105 active:scale-95

                ${
                  completed
                    ? "border-success bg-success text-on-accent shadow-sm"
                    : "border-border bg-base text-muted hover:border-accent hover:text-primary hover:bg-soft"
                }
              `}
            >
              {completed ? (
                <div className="flex items-center gap-1">
                  <Check size={13} />
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