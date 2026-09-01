"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  Search,
  ArrowUpDown,
  Filter,
  Eye,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Flame,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { StudentAnalyticsRecord, CollegeStatistics } from "@/lib/analytics/types";

interface CollegeOption {
  id: string;
  name: string;
}

export default function RecruiterDashboardPage() {
  const [students, setStudents] = useState<Array<StudentAnalyticsRecord & { readinessGain7d?: number }>>([]);
  const [summary, setSummary] = useState<CollegeStatistics | null>(null);
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"all" | "top_performers" | "most_improved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "readinessScore" | "placementProbability" | "name" | "dsaScore" | "resumeScore" | "interviewScore" | "lastLoginAt"
  >("readinessScore");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("tab", activeTab);
      if (selectedCollege !== "all") params.append("college", selectedCollege);
      if (selectedBatch !== "all") params.append("batch", selectedBatch);
      if (selectedBranch !== "all") params.append("branch", selectedBranch);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (minScore > 0) params.append("minReadinessScore", minScore.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

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
      console.error("Failed to load candidate list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCollege, selectedBatch, selectedBranch, minScore, sortBy, sortOrder]);

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Derived Batches for filter dropdown
  const batches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.batch) set.add(s.batch);
    });
    return ["all", ...Array.from(set).sort()];
  }, [students]);

  // Derived Branches for filter dropdown
  const branches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.branch) set.add(s.branch);
    });
    return ["all", ...Array.from(set).sort()];
  }, [students]);

  // KPI calculations
  const totalCandidateCount = students.length;
  const avgReadiness = summary?.averageReadinessScore ?? (totalCandidateCount > 0 ? Math.round(students.reduce((acc, curr) => acc + curr.readinessScore, 0) / totalCandidateCount) : 0);
  const placementReadyCount = students.filter((s) => s.readinessScore >= 70).length;
  const placementReadyPercentage = totalCandidateCount > 0 ? Math.round((placementReadyCount / totalCandidateCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header with Live Status Badge */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Recruiter Intelligence Portal</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Candidate Discovery & Evaluation
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live evaluation of registered candidates powered directly by verified student performance.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-primary shadow-xs transition hover:bg-soft md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 text-accent ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards (Only shown if students exist or searching) */}
      {totalCandidateCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Registered</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-soft text-accent">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-primary">{totalCandidateCount}</p>
            <p className="mt-1 text-xs text-muted">Registered Candidates</p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Placement Ready</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-success/30 bg-success/15 text-success">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-success">{placementReadyCount}</p>
            <p className="mt-1 text-xs text-muted">{placementReadyPercentage}% with ≥ 70% readiness</p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Avg Readiness</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-primary">{avgReadiness}%</p>
            <p className="mt-1 text-xs text-muted">Cohort-wide readiness average</p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Active Momentum</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-warning/30 bg-warning/15 text-warning">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-warning">
              {students.filter((s) => (s.readinessGain7d || 0) > 0).length}
            </p>
            <p className="mt-1 text-xs text-muted">Improving within last 7 days</p>
          </div>
        </div>
      )}

      {/* 3. Ranking Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          {/* Ranking Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-accent text-on-accent shadow-xs"
                  : "border border-border bg-surface text-muted hover:text-primary hover:bg-soft"
              }`}
            >
              All Candidates
            </button>
            <button
              onClick={() => setActiveTab("top_performers")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "top_performers"
                  ? "bg-accent text-on-accent shadow-xs"
                  : "border border-border bg-surface text-muted hover:text-primary hover:bg-soft"
              }`}
            >
              <Award size={13} />
              <span>Top Performers (≥ 70%)</span>
            </button>
            <button
              onClick={() => setActiveTab("most_improved")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "most_improved"
                  ? "bg-accent text-on-accent shadow-xs"
                  : "border border-border bg-surface text-muted hover:text-primary hover:bg-soft"
              }`}
            >
              <Flame size={13} />
              <span>Most Improved (7 Days)</span>
            </button>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary outline-none focus:border-accent"
            >
              <option value="readinessScore">Placement Readiness</option>
              <option value="resumeScore">Resume ATS Score</option>
              <option value="interviewScore">Interview Score</option>
              <option value="dsaScore">DSA Score</option>
              <option value="name">Candidate Name</option>
            </select>
          </div>
        </div>

        {/* Multi-Field Search & Filter Bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name, email, college, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface py-2.5 pl-10 pr-4 text-xs sm:text-sm text-primary placeholder:text-muted outline-none transition focus:border-accent shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {branches.length > 2 && (
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-primary outline-none focus:border-accent"
              >
                <option value="all">All Branches</option>
                {branches.filter((b) => b !== "all").map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 4. Candidate Talent Pool Roster or Empty State */}
      {totalCandidateCount === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/60 p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-border bg-soft text-muted mb-4">
            <Users className="h-8 w-8 text-muted" />
          </div>
          <h2 className="text-xl font-bold text-primary">No students have registered yet.</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            {searchQuery
              ? `No registered students matched your search "${searchQuery}". Clear your search query to view all students.`
              : "As new students sign up via Google or credentials and begin their placement prep, their live dynamic readiness scores and module diagnostics will appear here automatically."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-5 rounded-2xl border border-border bg-base px-5 py-2 text-xs font-bold text-primary hover:bg-soft transition"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-elevated/60 text-[11px] font-bold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-4 py-3.5">College & Branch</th>
                  <th className="px-4 py-3.5 text-center">DSA Score</th>
                  <th className="px-4 py-3.5 text-center">Resume ATS</th>
                  <th className="px-4 py-3.5 text-center">Mock Interview</th>
                  <th className="px-4 py-3.5 text-center">Readiness</th>
                  <th className="px-4 py-3.5 text-center">Placement Probability</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => {
                  const userInitials = student.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "ST";

                  const readiness = student.readinessScore;
                  const prob = student.placementProbability;

                  return (
                    <tr key={student.id} className="transition hover:bg-soft/40">
                      {/* Candidate Avatar & Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent font-bold text-xs shadow-xs overflow-hidden">
                            {student.image ? (
                              <img
                                src={student.image}
                                alt={student.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              userInitials
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-primary truncate">{student.name}</p>
                            <p className="text-[11px] text-muted truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* College & Branch */}
                      <td className="px-4 py-4">
                        <p className="font-semibold text-primary">{student.college || "Apex Tech"}</p>
                        <p className="text-[11px] text-muted">{student.branch || "CSE"}</p>
                      </td>

                      {/* DSA Score */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex rounded-full border border-border bg-base px-2.5 py-1 font-bold text-primary">
                          {student.dsaScore}%
                        </span>
                      </td>

                      {/* Resume ATS Score */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 font-bold border ${
                          student.resumeScore >= 75
                            ? "bg-success/15 text-success border-success/30"
                            : student.resumeScore > 0
                            ? "bg-warning/15 text-warning border-warning/30"
                            : "bg-base text-muted border-border"
                        }`}>
                          {student.resumeScore > 0 ? `${student.resumeScore}/100` : "0/100"}
                        </span>
                      </td>

                      {/* Interview Score */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex rounded-full border border-border bg-base px-2.5 py-1 font-bold text-primary">
                          {student.interviewScore > 0 ? `${student.interviewScore}%` : "0%"}
                        </span>
                      </td>

                      {/* Readiness Score */}
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`rounded-xl px-2.5 py-1 font-extrabold text-xs border ${
                            readiness >= 70
                              ? "bg-success/15 text-success border-success/30"
                              : readiness >= 40
                              ? "bg-accent/15 text-accent border-accent/30"
                              : "bg-base text-muted border-border"
                          }`}>
                            {readiness}%
                          </span>
                        </div>
                      </td>

                      {/* Placement Probability */}
                      <td className="px-4 py-4 text-center">
                        <span className="font-extrabold text-primary text-xs">
                          {prob}%
                        </span>
                      </td>

                      {/* Action Link */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/recruiter/students/${student.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-base px-3.5 py-1.5 font-bold text-primary hover:bg-soft transition shadow-xs"
                        >
                          <Eye size={13} className="text-accent" />
                          <span>Deep Dive</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
