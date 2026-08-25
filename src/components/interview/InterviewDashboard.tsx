"use client";

import HeroBanner from "./HeroBanner";
import StatsCards from "./StatsCards";
import CategoryGrid from "./CategoryGrid";
import RecentInterviews from "./RecentInterviews";

export default function InterviewDashboard() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <StatsCards />
      <CategoryGrid />
      <RecentInterviews />
    </div>
  );
} 