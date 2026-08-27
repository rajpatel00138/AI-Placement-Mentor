"use client";

import { BookOpen } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function RecommendationCard() {
  const { state } = useInterview();

  const recommendedTopics =
    state.evaluation?.recommendedTopics ?? [];

  // Palette-consistent priority badge styles using theme tokens
  const priorityStyles = {
    High: "bg-error/10 text-error border border-error/30",
    Medium: "bg-warning/10 text-warning border border-warning/30",
    Low: "bg-success/10 text-success border border-success/30",
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BookOpen
          className="text-accent-secondary"
          size={24}
        />

        <h2 className="text-2xl font-bold text-heading">
          Recommended Topics
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {recommendedTopics.length > 0 ? (
          recommendedTopics.map((item, index) => (
            <div
              key={`${item.topic}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-base p-4"
            >
              <div>
                <p className="font-semibold text-heading">
                  {item.topic}
                </p>

                <p className="mt-1 text-sm text-body-muted">
                  Recommended for focused practice
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityStyles[
                    item.priority as keyof typeof priorityStyles
                  ] ?? priorityStyles.Medium
                }`}
              >
                {item.priority}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-base p-4 text-body-muted">
            No recommendedTopics available.
          </div>
        )}
      </div>
    </div>
  );
}