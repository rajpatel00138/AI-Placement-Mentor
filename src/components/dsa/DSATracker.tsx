"use client";

import { dsaProblems } from "@/data/dsaProblems";
import { useState } from "react";
import SearchBar from "./SearchBar";
import StatsCards from "./StatsCards";
import ProgressBar from "./ProgressBar";
import CategoryAccordion from "./CategoryAccordion";
import { DSAProvider } from "./context/DSAContext";
import useDSA from "./hooks/useDSA";
import HeroBanner from "./HeroBanner";

function DSATrackerContent() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const filteredCategories = dsaProblems
    .map((category) => ({
      ...category,
      groups: category.groups
        .map((group) => ({
          ...group,
          problems: group.problems.filter((problem) => {
            const matchesSearch = problem.name
              .toLowerCase()
              .includes(search.toLowerCase());

            const matchesDifficulty =
              difficulty === "All" ||
              problem.difficulty === difficulty;

            return matchesSearch && matchesDifficulty;
          }),
        }))
        .filter((group) => group.problems.length > 0),
    }))
    .filter((category) => category.groups.length > 0);

  const { totalProblems, solvedProblems } = useDSA();

  return (
    <div className="space-y-6">
      <HeroBanner />

      <StatsCards />

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />

      <ProgressBar
        total={totalProblems}
        solved={solvedProblems}
      />

      <div id="problem-list">
        <CategoryAccordion categories={filteredCategories} />
      </div>
    </div>
  );
}

export default function DSATracker() {
  return (
    <DSAProvider>
      <DSATrackerContent />
    </DSAProvider>
  );
}