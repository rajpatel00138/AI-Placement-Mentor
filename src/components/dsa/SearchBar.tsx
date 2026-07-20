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
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search problems..."
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter size={16} />
          Difficulty
        </div>

        {filters.map((item) => {
          const active = difficulty === item;

          return (
            <button
              key={item}
              onClick={() => onDifficultyChange(item)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}