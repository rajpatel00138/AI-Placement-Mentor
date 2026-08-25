"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FileText, Target, TrendingUp, Trophy, Sparkles } from "lucide-react";
import {
  AIInsightCard,
  LoadingSkeleton,
  MomentumGauge,
  QuickActions,
  RecentActivity,
  StatCard,
  TaskChecklist,
  WeakTopics,
  WelcomeBanner,
} from "@/components/dashboard";
import { UserPerformanceMetrics } from "@/lib/activity/service";

const quickActions = [
  { label: "Upload Resume", hint: "Add latest version", href: "/dashboard/resume" },
  { label: "Start Interview", hint: "Practice live", href: "/dashboard/interview" },
  { label: "Open DSA Tracker", hint: "See recent solves", href: "/dashboard/dsa-tracker" },
  { label: "View Roadmap", hint: "Track milestones", href: "/dashboard/roadmap" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<UserPerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPerformance = useCallback(async () => {
    try {
      const res = await fetch("/api/user/performance");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setMetrics(json.data);
        }
      }
    } catch (e) {
      console.error("Failed to load user performance:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();

    // Reactive metric updates without page reload
    const handleActivityUpdated = () => {
      fetchPerformance();
    };

    window.addEventListener("activityUpdated", handleActivityUpdated);
    return () => window.removeEventListener("activityUpdated", handleActivityUpdated);
  }, [fetchPerformance]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const studentName = session?.user?.name || "Student";
  const readiness = metrics?.readinessScore ?? 0;
  const placementProb = metrics?.placementProbability ?? 0;
  const dsaCount = metrics?.dsaSolvedCount ?? 0;
  const dsaScore = metrics?.dsaScore ?? 0;
  const resumeScore = metrics?.resumeScore ?? 0;
  const interviewScore = metrics?.interviewScore ?? 0;
  const interviewCount = metrics?.mockInterviewsCount ?? 0;
  const roadmapProgress = metrics?.roadmapProgress ?? 0;
  const activities = metrics?.recentActivities ?? [];

  const statCards = [
    {
      title: "Placement Readiness",
      value: `${readiness}%`,
      detail: readiness === 0 ? "Start solving tasks to build score" : `Placement Probability: ${placementProb}%`,
      trend: metrics?.readinessGain7d ? `+${metrics.readinessGain7d}% this week` : readiness > 0 ? "Active progress" : "Zero state",
      accent: readiness >= 70 ? "bg-success/15 text-success border border-success/30" : "bg-accent/15 text-accent border border-accent/30",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Resume ATS Score",
      value: resumeScore > 0 ? `${resumeScore}/100` : "0/100",
      detail: resumeScore > 0 ? (metrics?.latestResume?.fileName || "Latest Resume") : "No resume uploaded yet",
      trend: resumeScore > 0 ? "Verified by AI Analyzer" : "Upload to calculate",
      accent: resumeScore >= 75 ? "bg-success/15 text-success border border-success/30" : "bg-warning/15 text-warning border border-warning/30",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "DSA Progress",
      value: `${dsaCount} Solved`,
      detail: `${dsaScore}% Mastery (${metrics?.dsaEasyCount || 0}E • ${metrics?.dsaMediumCount || 0}M • ${metrics?.dsaHardCount || 0}H)`,
      trend: dsaCount > 0 ? "Real-time synced" : "0 problems solved",
      accent: "bg-accent/15 text-accent border border-accent/30",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Interview Score",
      value: interviewScore > 0 ? `${interviewScore}%` : "0%",
      detail: interviewCount > 0 ? `${interviewCount} mock session${interviewCount > 1 ? "s" : ""} completed` : "No sessions yet",
      trend: interviewCount > 0 ? "AI evaluated" : "Start a mock interview",
      accent: interviewScore >= 75 ? "bg-success/15 text-success border border-success/30" : "bg-accent/15 text-accent border border-accent/30",
      icon: <Trophy className="h-5 w-5" />,
    },
  ];

  // Dynamic Focus Topics based on user progress
  const dynamicWeakTopics = [
    { label: "Data Structures & Algorithms", value: Math.max(10, dsaScore), detail: dsaCount > 0 ? `${dsaCount} problems solved` : "Start with Arrays & Strings" },
    { label: "Resume ATS Optimization", value: Math.max(10, resumeScore), detail: resumeScore > 0 ? "ATS keywords verified" : "Upload your resume" },
    { label: "Mock Technical Interview", value: Math.max(10, interviewScore), detail: interviewCount > 0 ? `${interviewCount} completed` : "Practice AI interview questions" },
    { label: "Roadmap Milestones", value: Math.max(10, roadmapProgress), detail: `${roadmapProgress}% curriculum completed` },
  ];

  // Dynamic Actionable Tasks
  const dynamicTasks = [
    { id: "1", title: "Solve your next DSA challenge", done: dsaCount >= 5, due: "Daily Goal" },
    { id: "2", title: "Analyze Resume for ATS compatibility", done: resumeScore > 0, due: "Core Target" },
    { id: "3", title: "Complete a Technical Mock Interview", done: interviewCount > 0, due: "Weekly Target" },
    { id: "4", title: "Check off a Roadmap Milestone", done: roadmapProgress > 0, due: "Self Paced" },
  ];

  const momentumLevel = Math.max(5, Math.min(100, readiness > 0 ? readiness : 10));
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 pb-8">
      <WelcomeBanner
        greeting={greeting}
        userName={studentName}
        message={readiness === 0 ? "Welcome! Ready to start your placement preparation?" : "You're actively building real placement readiness."}
        badge={`Readiness ${readiness}%`}
        level={momentumLevel}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <AIInsightCard
            title="AI Placement Mentor"
            message={
              readiness === 0
                ? "Your dashboard is freshly initialized with 0 dummy data. Begin by solving your first DSA challenge or uploading your resume to start generating your readiness score."
                : `Your placement readiness is at ${readiness}%. Keep solving medium-level problems and complete mock interviews to boost your score above 75%.`
            }
            companies={["Google", "Microsoft", "Amazon", "Zoho"]}
            recommendation={
              readiness === 0
                ? ["Solve 1st DSA Problem", "Upload Resume for ATS Score", "Start 1st Mock Interview"]
                : ["Practice Hard DSA", "Target 85+ Resume ATS", "Complete System Design Roadmap"]
            }
          />
          <MomentumGauge value={momentumLevel} label="Overall Placement Momentum" />
        </div>
        <div className="space-y-6">
          <WeakTopics items={dynamicWeakTopics} />
          <TaskChecklist items={dynamicTasks} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <RecentActivity items={activities} />
        <QuickActions items={quickActions} />
      </section>
    </div>
  );
}
