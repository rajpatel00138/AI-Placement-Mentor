"use client";

import ScoreCard from "./ScoreCard";
import PerformanceChart from "./PerformanceChart";
import StrengthsCard from "./StrengthsCard";
import WeaknessesCard from "./WeaknessesCard";
import AIInsights from "./AIInsights";
import RecommendationCard from "./RecommendationCard";
import QuestionsReview from "./QuestionsReview";
import ReportActions from "./ReportActions";

export default function InterviewReport() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-bold text-heading">
          Interview Report
        </h1>

        <p className="mt-2 text-body-muted">
          Review your interview performance and identify areas for improvement.
        </p>
      </div>

      <ScoreCard />
      <PerformanceChart />
        <div className="grid gap-6 lg:grid-cols-2">
            <StrengthsCard />
            <WeaknessesCard />
        </div>
        <AIInsights />
        <QuestionsReview />
        <RecommendationCard />
        <ReportActions />

    </div>
  );
}