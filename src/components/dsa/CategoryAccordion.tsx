"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Layers3,
} from "lucide-react";

import { Category } from "@/types/dsa";
import ProblemRow from "./ProblemRow";
import useDSA from "./hooks/useDSA";

interface Props {
  categories: Category[];
}

export default function CategoryAccordion({
  categories,
}: Props) {
  const { status } = useDSA();

  const [openCategory, setOpenCategory] = useState<string | null>(
    categories.length ? categories[0].id : null
  );

  const solvedSet = useMemo(() => {
    return new Set(
      Object.entries(status)
        .filter(
          ([, value]) =>
            value === "completed" ||
            (value as string) === "done"
        )
        .map(([id]) => id)
    );
  }, [status]);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = openCategory === category.id;

        const totalProblems = category.groups.reduce(
          (sum, group) => sum + group.problems.length,
          0
        );

        const solvedProblems = category.groups.reduce(
          (sum, group) => {
            return (
              sum +
              group.problems.filter((problem) =>
                solvedSet.has(problem.id)
              ).length
            );
          },
          0
        );

        const progress =
          totalProblems === 0
            ? 0
            : Math.round(
                (solvedProblems / totalProblems) * 100
              );

        return (
          <div
            key={category.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all"
          >
            <button
              onClick={() =>
                setOpenCategory(
                  isOpen ? null : category.id
                )
              }
              className="w-full p-5 sm:p-6 text-left hover:bg-soft/20 transition cursor-pointer"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="rounded-xl border border-border bg-soft p-3 text-accent">
                    <FolderOpen
                      className="text-accent"
                      size={22}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-primary">
                        {category.name}
                      </h2>

                      {isOpen ? (
                        <ChevronDown
                          className="text-muted"
                          size={18}
                        />
                      ) : (
                        <ChevronRight
                          className="text-muted"
                          size={18}
                        />
                      )}
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-muted">
                      {category.groups.length} Sections •{" "}
                      {totalProblems} Problems
                    </p>
                  </div>
                </div>

                {/* Right Progress */}
                <div className="w-full max-w-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted font-medium uppercase tracking-wider">
                      Progress
                    </span>

                    <span className="text-sm font-bold text-primary">
                      {solvedProblems}/{totalProblems}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1.5 text-right text-xs font-semibold text-accent">
                    {progress}% Completed
                  </p>
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border bg-elevated p-4 sm:p-6">
                <div className="space-y-6">
                  {category.groups.map((group, index) => (
                    <div key={index}>
                      {group.name && (
                        <div className="mb-3 flex items-center gap-2">
                          <Layers3
                            size={18}
                            className="text-accent"
                          />

                          <h3 className="text-base font-bold text-primary">
                            {group.name}
                          </h3>
                        </div>
                      )}

                      <div className="space-y-2.5">
                        {group.problems.map((problem) => (
                          <ProblemRow
                            key={problem.id}
                            problem={problem}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}