"use client";

import { Filter, Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
}

export default function SearchBar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
}: SearchBarProps) {
  const filters = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search problems by name or keyword..."
          className="h-11 w-full rounded-xl border border-border bg-base pl-11 pr-4 text-sm text-primary placeholder-muted outline-none transition-all focus:border-accent"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
          <Filter size={14} className="text-accent" />
          <span>Difficulty:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => {
            const active = difficulty === item;

            return (
              <button
                key={item}
                onClick={() => onDifficultyChange(item)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-accent text-on-accent shadow-sm"
                    : "border border-border bg-base text-muted hover:text-primary hover:bg-soft"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}