"use client";

import { useEffect, useState } from "react";
import { Brain, FileText, Target, TrendingUp, Trophy } from "lucide-react";
import {
  AIInsightCard,
  DashboardGrid,
  DashboardHeader,
  LoadingSkeleton,
  ProgressChart,
  QuickActions,
  RecentActivity,
  StatCard,
  TaskChecklist,
  WeakTopics,
  WelcomeBanner,
} from "@/components/dashboard";

const statCards = [
  {
    title: "Placement Readiness",
    value: "87%",
    detail: "Momentum is strong this month",
    trend: "+8% from last week",
    accent: "bg-emerald-500/15 text-emerald-300",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Resume ATS Score",
    value: "82/100",
    detail: "Keyword density looks solid",
    trend: "+5 points this week",
    accent: "bg-indigo-500/15 text-indigo-300",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "DSA Progress",
    value: "145 / 455",
    detail: "Steady growth across arrays and trees",
    trend: "12 more problems this month",
    accent: "bg-cyan-500/15 text-cyan-300",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Interview Score",
    value: "78%",
    detail: "Confidence is improving quickly",
    trend: "Communication +7%",
    accent: "bg-amber-500/15 text-amber-300",
    icon: <Trophy className="h-5 w-5" />,
  },
];

const weeklyData = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 72 },
  { day: "Thu", score: 76 },
  { day: "Fri", score: 81 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 88 },
];

const weakTopics = [
  { label: "Arrays", value: 72, detail: "Good control with medium-level questions" },
  { label: "Trees", value: 64, detail: "Needs more recursive practice" },
  { label: "Graphs", value: 58, detail: "Revise traversals and shortest paths" },
  { label: "DP", value: 49, detail: "Revisit state transition patterns" },
  { label: "Heap", value: 53, detail: "Practice priority queue usage" },
];

const tasks = [
  { id: "1", title: "Solve 5 DSA Questions", done: true, due: "09:00" },
  { id: "2", title: "Upload Resume", done: false, due: "12:30" },
  { id: "3", title: "Complete Mock Interview", done: false, due: "18:00" },
  { id: "4", title: "Revise Graphs", done: false, due: "20:00" },
];

const activityFeed = [
  { id: "1", title: "Resume Uploaded", time: "10 min ago", type: "Resume" },
  { id: "2", title: "Interview Completed", time: "1 hr ago", type: "Mock Interview" },
  { id: "3", title: "DSA Solved", time: "3 hrs ago", type: "Practice" },
  { id: "4", title: "ATS Improved", time: "Today", type: "Resume" },
];

const quickActions = [
  { label: "Upload Resume", hint: "Add latest version" },
  { label: "Start Interview", hint: "Practice live" },
  { label: "Open DSA Tracker", hint: "See recent solves" },
  { label: "Ask AI Mentor", hint: "Get guidance" },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner
        greeting="Good Morning"
        userName="Aarav"
        message="You’re building momentum faster than ever."
        badge="Momentum score 88/100"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <AIInsightCard
            title="AI Mentor"
            message="Today's Recommendation focuses on trees, SQL confidence, and refining your resume for faster shortlist conversion."
            companies={["Zoho", "TCS", "Infosys"]}
            recommendation={["Revise Trees", "Improve SQL", "Upload Updated Resume"]}
          />
          <ProgressChart data={weeklyData} />
        </div>
        <div className="space-y-6">
          <WeakTopics items={weakTopics} />
          <TaskChecklist items={tasks} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <RecentActivity items={activityFeed} />
        <QuickActions items={quickActions} />
      </section>

      <section className="rounded-[24px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Brain className="h-4 w-4 text-indigo-300" />
          Dashboard is API-ready and uses dummy data only.
        </div>
      </section>
    </div>
  );
}
