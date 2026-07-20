"use client";

import { BookOpen } from "lucide-react";

const recommendations = [
  {
    title: "Dynamic Programming",
    reason: "Practice memoization and tabulation problems.",
  },
  {
    title: "System Design",
    reason: "Learn scalability, caching, and load balancing concepts.",
  },
  {
    title: "DBMS",
    reason: "Revise indexing, normalization, and transactions.",
  },
  {
    title: "Operating Systems",
    reason: "Focus on processes, threads, synchronization, and deadlocks.",
  },
];

export default function RecommendationCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center gap-3">
        <BookOpen className="text-violet-400" />

        <div>
          <h2 className="text-2xl font-bold text-white">
            Recommended Topics
          </h2>

          <p className="text-slate-400">
            Topics to improve before your next interview.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {recommendations.map((topic) => (
          <div
            key={topic.title}
            className="rounded-2xl bg-slate-950 p-4"
          >
            <h3 className="font-semibold text-white">
              {topic.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {topic.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}