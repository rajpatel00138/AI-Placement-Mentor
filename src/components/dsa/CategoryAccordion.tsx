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
            value === "done"
        )
        .map(([id]) => id)
    );
  }, [status]);

  return (
    <div className="space-y-6">
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
            className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg transition-all"
          >
            <button
              onClick={() =>
                setOpenCategory(
                  isOpen ? null : category.id
                )
              }
              className="w-full p-6 text-left"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-blue-500/15 p-3">
                    <FolderOpen
                      className="text-blue-400"
                      size={22}
                    />
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-xl font-bold text-white">
                        {category.name}
                      </h2>

                      {isOpen ? (
                        <ChevronDown
                          className="text-slate-400"
                          size={18}
                        />
                      ) : (
                        <ChevronRight
                          className="text-slate-400"
                          size={18}
                        />
                      )}

                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                      {category.groups.length} Sections •{" "}
                      {totalProblems} Problems
                    </p>

                  </div>

                </div>

                {/* Right */}

                <div className="w-full max-w-sm">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Progress
                    </span>

                    <span className="font-semibold text-white">
                      {solvedProblems}/{totalProblems}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {progress}% Completed
                  </p>

                </div>

              </div>

            </button>
                        {isOpen && (
              <div className="border-t border-slate-700 bg-slate-950/60 p-6">
                <div className="space-y-8">
                  {category.groups.map((group, index) => (
                    <div key={index}>
                      {group.name && (
                        <div className="mb-4 flex items-center gap-2">
                          <Layers3
                            size={18}
                            className="text-blue-400"
                          />

                          <h3 className="text-lg font-semibold text-white">
                            {group.name}
                          </h3>
                        </div>
                      )}

                      <div className="space-y-3">
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