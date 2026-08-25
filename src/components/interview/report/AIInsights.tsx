"use client";

import { Sparkles, Briefcase } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AIInsights() {
  const { state } = useInterview();

  const evaluation = state.evaluation;

  const recommendation = evaluation?.hiringRecommendation;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center gap-3">
        <Sparkles className="text-violet-400" size={24} />

        <h2 className="text-2xl font-bold text-white">
          AI Interview Insights
        </h2>
      </div>

      <div className="mt-6 space-y-6">
        {/* Overall overallFeedback */}

        <div className="rounded-2xl bg-slate-950 p-5">
          <h3 className="mb-3 text-lg font-semibold text-white">
            Overall overallFeedback
          </h3>

          <p className="leading-7 text-slate-300">
            {evaluation?.overalloverallFeedback ??
              "No overallFeedback available."}
          </p>
        </div>

        {/* Hiring Recommendation */}

        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
          <div className="flex items-center gap-3">
            <Briefcase
              className="text-violet-400"
              size={22}
            />

            <h3 className="text-lg font-semibold text-white">
              Hiring Recommendation
            </h3>
          </div>

          {recommendation ? (
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold text-violet-300">
                {recommendation.status}
              </p>

              <p className="text-sm text-slate-400">
                Confidence:{" "}
                <span className="font-medium text-white">
                  {recommendation.confidence}
                </span>
              </p>

              <p className="leading-7 text-slate-300">
                {recommendation.reason}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-slate-400">
              Not Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}