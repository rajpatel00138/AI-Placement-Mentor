"use client";

import { BookOpen } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function RecommendationCard() {
  const { state } = useInterview();

  const recommendedTopics =
    state.evaluation?.recommendedTopics ?? [];

  const priorityColors = {
    High: "bg-red-500/15 text-red-300 border-red-500/30",
    Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    Low: "bg-green-500/15 text-green-300 border-green-500/30",
  };

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
        {recommendedTopics.length > 0 ? (
          recommendedTopics.map((item, index) => (
            <div
              key={`${item.topic}-${index}`}
              className="flex items-center justify-between rounded-2xl bg-slate-950 p-4"
            >
              <div>
                <p className="font-semibold text-white">
                  {item.topic}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Recommended for focused practice
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  priorityColors[
                    item.priority as keyof typeof priorityColors
                  ] ?? priorityColors.Medium
                }`}
              >
                {item.priority}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-slate-950 p-4 text-slate-400">
            No recommendedTopics available.
          </div>
        )}
      </div>
    </div>
  );
}