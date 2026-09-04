"use client";

import { useEffect, useState, useCallback } from "react";
import HeroBanner from "./HeroBanner";
import StatsCards from "./StatsCards";
import CategoryGrid from "./CategoryGrid";
import RecentInterviews from "./RecentInterviews";
import { UserInterviewData } from "@/types/interview";

export default function InterviewDashboard() {
  const [data, setData] = useState<UserInterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviewData = useCallback(async () => {
    try {
      const res = await fetch("/api/user/interviews");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load interview metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviewData();

    const handleActivityUpdated = () => {
      fetchInterviewData();
    };

    window.addEventListener("activityUpdated", handleActivityUpdated);
    return () => {
      window.removeEventListener("activityUpdated", handleActivityUpdated);
    };
  }, [fetchInterviewData]);

  const readinessScore = data?.readinessScore ?? 0;
  const bestScore = data?.bestScore ?? 0;
  const completedCount = data?.completedCount ?? 0;
  const streakDays = data?.streakDays ?? 0;
  const lastUpdated = data?.lastUpdated ?? null;
  const interviews = data?.interviews ?? [];

  return (
    <div className="space-y-8">
      <HeroBanner
        readinessScore={readinessScore}
        bestScore={bestScore}
        completedCount={completedCount}
        isLoading={isLoading}
      />
      <StatsCards
        completedCount={completedCount}
        bestScore={bestScore}
        streakDays={streakDays}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
      />
      <CategoryGrid />
      <RecentInterviews
        interviews={interviews}
        isLoading={isLoading}
      />
    </div>
  );
}