"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  ChevronRight,
  Briefcase,
  Layers,
  Search,
  BookOpen,
} from "lucide-react";
import { StudentAnalyticsRecord, CollegeStatistics } from "@/lib/analytics/types";

interface CollegeOption {
  id: string;
  name: string;
  code?: string | null;
}

export default function RecruiterAnalyticsPage() {
  const [students, setStudents] = useState<StudentAnalyticsRecord[]>([]);
  const [summary, setSummary] = useState<CollegeStatistics | null>(null);
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");

  useEffect(() => {
    async function loadRecruiterData() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCollege !== "all") params.append("college", selectedCollege);
        if (selectedBatch !== "all") params.append("batch", selectedBatch);
        if (selectedBranch !== "all") params.append("branch", selectedBranch);

        const res = await fetch(`/api/analytics/recruiter?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStudents(json.data.students || []);
            setSummary(json.data.summary || null);
            setColleges(json.data.colleges || []);
          }
        }
      } catch (err) {
        console.error("Failed to load recruiter analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecruiterData();
  }, [selectedCollege, selectedBatch, selectedBranch]);

  // Derived cohort metrics
  const totalStudents = students.length;
  const placementReadyStudents = useMemo(() => {
    return students.filter((s) => s.readinessScore >= 80);
  }, [students]);

  const moderateStudents = useMemo(() => {
    return students.filter((s) => s.readinessScore >= 60 && s.readinessScore < 80);
  }, [students]);

  const developingStudents = useMemo(() => {
    return students.filter((s) => s.readinessScore < 60);
  }, [students]);

  const readyPercentage = totalStudents > 0 ? Math.round((placementReadyStudents.length / totalStudents) * 100) : 0;
  const moderatePercentage = totalStudents > 0 ? Math.round((moderateStudents.length / totalStudents) * 100) : 0;
  const developingPercentage = totalStudents > 0 ? Math.round((developingStudents.length / totalStudents) * 100) : 0;

  const avgDsa = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.dsaScore, 0) / students.length);
  }, [students]);

  const avgResume = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.resumeScore, 0) / students.length);
  }, [students]);

  const avgInterview = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.interviewScore, 0) / students.length);
  }, [students]);

  const avgReadiness = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.readinessScore, 0) / students.length);
  }, [students]);

  // College-wise aggregation
  const collegeBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; ready: number; dsaSum: number; interviewSum: number; resumeSum: number }>();
    
    // Seed default colleges
    colleges.forEach((c) => {
      map.set(c.name, { total: 0, ready: 0, dsaSum: 0, interviewSum: 0, resumeSum: 0 });
    });

    students.forEach((s) => {
      const colName = s.college || "Apex Institute of Technology";
      const existing = map.get(colName) || { total: 0, ready: 0, dsaSum: 0, interviewSum: 0, resumeSum: 0 };
      existing.total += 1;
      if (s.readinessScore >= 80) existing.ready += 1;
      existing.dsaSum += s.dsaScore;
      existing.interviewSum += s.interviewScore;
      existing.resumeSum += s.resumeScore;
      map.set(colName, existing);
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      ready: data.ready,
      readyRate: data.total > 0 ? Math.round((data.ready / data.total) * 100) : 0,
      avgDsa: data.total > 0 ? Math.round(data.dsaSum / data.total) : 0,
      avgInterview: data.total > 0 ? Math.round(data.interviewSum / data.total) : 0,
      avgResume: data.total > 0 ? Math.round(data.resumeSum / data.total) : 0,
    }));
  }, [students, colleges]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-0.5 text-xs font-bold text-accent uppercase tracking-wider">
              <Building2 size={13} />
              <span>Campus & Cohort Intelligence</span>
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Institutional Talent Analytics
          </h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Evaluate cohort distributions, institutional readiness benchmarks, and talent funnel velocity across partner colleges.
          </p>
        </div>

        <Link
          href="/recruiter/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-on-accent transition hover:bg-accent-hover shadow-xs active:scale-[0.99] self-start md:self-auto"
        >
          <Users size={16} />
          <span>Browse Candidate Pool</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 2. Global Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider pr-2 border-r border-border">
          <Filter size={14} className="text-accent" />
          <span>Filter Cohort:</span>
        </div>

        {/* College Filter */}
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="rounded-xl border border-border bg-base px-3 py-1.5 text-xs font-semibold text-primary outline-none transition focus:border-accent"
        >
          <option value="all">All Partner Colleges</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Branch Filter */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="rounded-xl border border-border bg-base px-3 py-1.5 text-xs font-semibold text-primary outline-none transition focus:border-accent"
        >
          <option value="all">All Departments / Branches</option>
          <option value="CSE">Computer Science (CSE)</option>
          <option value="IT">Information Technology (IT)</option>
          <option value="AI & DS">AI & Data Science (AI & DS)</option>
          <option value="ECE">Electronics (ECE)</option>
        </select>

        {/* Batch Filter */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="rounded-xl border border-border bg-base px-3 py-1.5 text-xs font-semibold text-primary outline-none transition focus:border-accent"
        >
          <option value="all">All Batches (2025-2026)</option>
          <option value="2025-A">Batch 2025-A</option>
          <option value="2025-B">Batch 2025-B</option>
        </select>
      </div>

      {/* 3. Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pool */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Candidate Pool</span>
            <div className="rounded-xl bg-soft p-2 text-accent">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? "..." : totalStudents}
          </div>
          <p className="text-xs text-muted">Registered across selected cohort</p>
        </div>

        {/* Placement Ready Rate */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Placement Ready (≥80%)</span>
            <div className="rounded-xl bg-success/15 p-2 text-success">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? "..." : `${readyPercentage}%`}
          </div>
          <div className="text-xs text-success font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>{placementReadyStudents.length} candidates interview-ready</span>
          </div>
        </div>

        {/* Average Readiness */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Avg Readiness Index</span>
            <div className="rounded-xl bg-soft p-2 text-accent">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? "..." : `${avgReadiness}/100`}
          </div>
          <p className="text-xs text-muted">Combined diagnostic rating</p>
        </div>

        {/* ATS Resume Benchmark */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Avg Resume ATS Score</span>
            <div className="rounded-xl bg-accent-secondary/15 p-2 text-accent-secondary">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-primary">
            {isLoading ? "..." : `${avgResume}/100`}
          </div>
          <p className="text-xs text-muted">Average resume optimization</p>
        </div>
      </div>

      {/* 4. Hiring Funnel & Domain Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Talent Readiness Funnel */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary">Talent Pipeline Funnel</h2>
              <p className="text-xs text-muted">Readiness classification across the candidate cohort</p>
            </div>
            <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-accent">
              {totalStudents} Candidates
            </span>
          </div>

          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="rounded-2xl border border-border bg-base p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Tier 1: Placement Ready (80 - 100%)
                </span>
                <span className="font-extrabold text-success">{placementReadyStudents.length} ({readyPercentage}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${readyPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">Passed rigorous DSA benchmarks & mock interviews.</p>
            </div>

            {/* Tier 2 */}
            <div className="rounded-2xl border border-border bg-base p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Tier 2: Approaching Ready (60 - 79%)
                </span>
                <span className="font-extrabold text-accent">{moderateStudents.length} ({moderatePercentage}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${moderatePercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">Active in roadmaps; completing targeted practice tracks.</p>
            </div>

            {/* Tier 3 */}
            <div className="rounded-2xl border border-border bg-base p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted" />
                  Tier 3: Skill Building (&lt; 60%)
                </span>
                <span className="font-extrabold text-muted">{developingStudents.length} ({developingPercentage}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-muted/60 transition-all duration-500"
                  style={{ width: `${developingPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">Undergoing foundational topic refinement.</p>
            </div>
          </div>
        </div>

        {/* Right: Technical Pillar Benchmarks */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary">Technical Competency Pillars</h2>
            <p className="text-xs text-muted">Average evaluation scores across core candidate skillsets</p>
          </div>

          <div className="space-y-4">
            {/* DSA */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-primary flex items-center gap-1.5">
                  <BookOpen size={14} className="text-accent" />
                  Data Structures & Algorithms (DSA)
                </span>
                <span className="text-accent font-extrabold">{avgDsa}/100</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${avgDsa}%` }} />
              </div>
            </div>

            {/* Resume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-primary flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent-secondary" />
                  Resume & ATS Compliance
                </span>
                <span className="text-accent-secondary font-extrabold">{avgResume}/100</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div className="h-full rounded-full bg-accent-secondary" style={{ width: `${avgResume}%` }} />
              </div>
            </div>

            {/* Mock Interview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-primary flex items-center gap-1.5">
                  <Award size={14} className="text-success" />
                  Mock Interview Technical & Behavioral
                </span>
                <span className="text-success font-extrabold">{avgInterview}/100</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-soft overflow-hidden">
                <div className="h-full rounded-full bg-success" style={{ width: `${avgInterview}%` }} />
              </div>
            </div>

            {/* Overall Placement Probability */}
            <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-primary">Cohort Placement Index</p>
                <p className="text-[11px] text-muted">Estimated campus drive conversion likelihood</p>
              </div>
              <div className="text-2xl font-extrabold text-accent">
                {avgReadiness > 0 ? `${Math.min(95, Math.round(avgReadiness * 1.05))}%` : "0%"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Institutional Comparison Table / Cards */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary">Partner College Benchmarking</h2>
            <p className="text-xs text-muted">Comparative metrics across participating academic institutions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {collegeBreakdown.map((col, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-base p-4 space-y-3 hover:border-accent/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-primary truncate max-w-[200px]" title={col.name}>
                  {col.name}
                </span>
                <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                  {col.total} Students
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-border/60">
                <div className="rounded-xl bg-surface p-2">
                  <p className="text-[10px] text-muted">Ready Rate</p>
                  <p className="text-xs font-extrabold text-success">{col.readyRate}%</p>
                </div>
                <div className="rounded-xl bg-surface p-2">
                  <p className="text-[10px] text-muted">Avg DSA</p>
                  <p className="text-xs font-extrabold text-primary">{col.avgDsa}</p>
                </div>
                <div className="rounded-xl bg-surface p-2">
                  <p className="text-[10px] text-muted">Interview</p>
                  <p className="text-xs font-extrabold text-accent">{col.avgInterview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
