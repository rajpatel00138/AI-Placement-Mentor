"use client";

import HeroBanner from "./HeroBanner";
import StatsCards from "./StatsCards";
import CategoryGrid from "./CategoryGrid";
import AIRecommendationPanel from "./AIRecommendationPanel";
import RecentInterviews from "./RecentInterviews";
import CompanyMockSection from "./CompanyMockSection";
import PerformanceAnalytics from "./PerformanceAnalytics";

export default function InterviewDashboard() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <StatsCards />
      <CategoryGrid />
      <AIRecommendationPanel />
      <CompanyMockSection />
      <PerformanceAnalytics />
      <RecentInterviews />
    </div>
  );
}