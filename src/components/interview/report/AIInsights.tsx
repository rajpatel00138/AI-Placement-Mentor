"use client";

import { Sparkles, Briefcase } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AIInsights() {
  const { state } = useInterview();

  const evaluation = state.evaluation;

  const recommendation = evaluation?.hiringRecommendation;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Sparkles className="text-accent-secondary" size={24} />

        <h2 className="text-2xl font-bold text-heading">
          AI Interview Insights
        </h2>
      </div>

      <div className="mt-6 space-y-6">
        {/* Overall overallFeedback */}

        <div className="rounded-2xl border border-border bg-base p-5">
          <h3 className="mb-3 text-lg font-semibold text-heading">
            Overall overallFeedback
          </h3>

          <p className="leading-7 text-body-muted">
            {evaluation?.overalloverallFeedback ??
              "No overallFeedback available."}
          </p>
        </div>

        {/* Hiring Recommendation */}

        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-3">
            <Briefcase
              className="text-accent"
              size={22}
            />

            <h3 className="text-lg font-semibold text-heading">
              Hiring Recommendation
            </h3>
          </div>

          {recommendation ? (
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold text-accent">
                {recommendation.status}
              </p>

              <p className="text-sm text-body-muted">
                Confidence:{" "}
                <span className="font-medium text-heading">
                  {recommendation.confidence}
                </span>
              </p>

              <p className="leading-7 text-body-muted">
                {recommendation.reason}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-body-muted">
              Not Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}