"use client";

import { BookOpen } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function RecommendationCard() {
  const { state } = useInterview();

  const recommendations =
    state.evaluation?.recommendations ?? [];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center gap-3">
        <BookOpen
          className="text-blue-400"
          size={24}
        />

        <h2 className="text-2xl font-bold text-white">
          Recommended Topics
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <div
              key={item}
              className="rounded-xl bg-slate-950 p-4 text-slate-300"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-slate-950 p-4 text-slate-400">
            No recommendations available.
          </div>
        )}
      </div>
    </div>
  );
}