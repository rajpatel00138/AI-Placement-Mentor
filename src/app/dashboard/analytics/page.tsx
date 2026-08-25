"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Search,
  ArrowUpDown,
  Building,
  GraduationCap,
  Sparkles,
  Eye,
  RefreshCw,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import {
  CollegeStatistics,
  StudentAnalyticsRecord,
} from "@/lib/analytics/types";
import { ScoreDistributionChart } from "@/components/analytics/ScoreDistributionChart";
import { DomainBreakdownChart } from "@/components/analytics/DomainBreakdownChart";
import { StudentDetailModal } from "@/components/analytics/StudentDetailModal";

interface CollegeOverviewRecord {
  id: string;
  name: string;
  code?: string | null;
}

export default function AnalyticsDashboardPage() {
  const [summary, setSummary] = useState<CollegeStatistics | null>(null);
  const [colleges, setColleges] = useState<CollegeOverviewRecord[]>([]);
  const [students, setStudents] = useState<StudentAnalyticsRecord[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalyticsRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"readinessScore" | "placementProbability" | "dsaScore" | "name">("readinessScore");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCollege !== "all") params.append("collegeId", selectedCollege);
      if (selectedBatch !== "all") params.append("batch", selectedBatch);
      if (searchQuery) params.append("search", searchQuery);
      if (minScore > 0) params.append("minScore", minScore.toString());
      if (sortBy) params.append("sortBy", sortBy);

      const res = await fetch(`/api/analytics/recruiter?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSummary(json.data.summary);
          setColleges(json.data.colleges || []);
          setStudents(json.data.students || []);
        }
      }
    } catch (e) {
      console.error("Failed to load recruiter analytics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCollege, selectedBatch, searchQuery, minScore, sortBy]);

  // Derived Batches for filter dropdown
  const batches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.batch) set.add(s.batch);
    });
    return ["all", ...Array.from(set).sort()];
  }, [students]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" />
            <span>Recruitment & Performance Intelligence</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold text-primary">
            Placement Readiness Analytics
          </h1>
          <p className="mt-1 text-sm text-muted">
            Cohort rankings, domain weakness breakdowns, and predictive placement probability metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition hover:bg-soft"
          >
            <RefreshCw className={`h-4 w-4 text-accent ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Avg Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">Avg Readiness</span>
            <div className="rounded-xl bg-accent/15 border border-accent/30 p-2 text-accent">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {summary ? `${summary.averageReadinessScore}` : "--"}
            </span>
            <span className="text-xs text-muted">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span>Score across all 5 pillars</span>
          </div>
        </motion.div>

        {/* Card 2: Placement Ready % */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">High Probability</span>
            <div className="rounded-xl bg-success/15 border border-success/30 p-2 text-success">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-success">
              {summary ? `${Math.round(summary.averagePlacementProbability * 100)}%` : "--%"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span>Score 71+ or High logistic probability</span>
          </div>
        </motion.div>

        {/* Card 3: Total Candidates Assessed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">Active Talent Pool</span>
            <div className="rounded-xl bg-soft border border-border p-2 text-accent">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {summary ? summary.totalStudents : "--"}
            </span>
            <span className="text-xs text-muted">candidates</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span>Across {colleges.length || 1} college branches</span>
          </div>
        </motion.div>

        {/* Card 4: Top Skill Domain */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted font-medium">Domain Leader</span>
            <div className="rounded-xl bg-accent-secondary/15 border border-accent-secondary/30 p-2 text-accent-secondary">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-accent-secondary">
              DSA & Coding
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-muted">DSA: {summary?.averageScores.dsa ?? 0}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">Resume: {summary?.averageScores.resume ?? 0}</span>
          </div>
        </motion.div>
      </div>

      {/* Visualizations Grid */}
      {summary && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ScoreDistributionChart distribution={summary.scoreDistribution} />
          <DomainBreakdownChart averages={summary.averageScores} />
        </div>
      )}

      {/* College Recommendations & Actionable Insights */}
      {summary && summary.weakAreas.length > 0 && (
        <div className="rounded-[24px] border border-warning/30 bg-warning/10 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warning/20 p-2.5 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary">Cohort Curriculum Recommendations</h3>
              <p className="text-xs text-muted">Automated diagnostic suggestions for placement officers and mentors</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {summary.weakAreas.map((area: { domain: string; averageScore: number; recommendation: string }) => (
              <div key={area.domain} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-warning text-sm">{area.domain}</span>
                  <span className="rounded-full bg-warning/15 border border-warning/30 px-2.5 py-0.5 text-xs text-warning font-medium">
                    Avg: {area.averageScore}/100
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name, branch, target company..."
              className="w-full rounded-2xl border border-border bg-base pl-10 pr-4 py-2.5 text-sm text-primary placeholder-muted outline-none focus:border-accent transition"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* College Dropdown */}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted" />
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                aria-label="Filter by College"
                className="rounded-2xl border border-border bg-base px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
              >
                <option value="all">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Filter */}
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                aria-label="Filter by Batch"
                className="rounded-2xl border border-border bg-base px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
              >
                <option value="all">All Batches</option>
                {batches.filter((b) => b !== "all").map((b) => (
                  <option key={b} value={b}>
                    Batch {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Score Buttons */}
            <div className="flex items-center gap-1 rounded-2xl border border-border bg-base p-1">
              {[0, 60, 75, 85].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinScore(score)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
                    minScore === score
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-muted hover:text-primary hover:bg-soft"
                  }`}
                >
                  {score === 0 ? "All Scores" : `${score}+ Score`}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort Candidates by"
                className="rounded-2xl border border-border bg-base px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
              >
                <option value="readinessScore">Sort by Readiness</option>
                <option value="placementProbability">Sort by Placement %</option>
                <option value="dsaScore">Sort by DSA Score</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Students Leaderboard Table */}
      <div className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-sm backdrop-blur-xl">
        <div className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary">Student Leaderboard & Readiness Index</h2>
            <p className="text-xs text-muted mt-0.5">
              Showing {students.length} candidates matching active filters
            </p>
          </div>
          <span className="rounded-full bg-soft border border-border px-3 py-1 text-xs font-semibold text-primary">
            Live Rankings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-elevated text-xs uppercase text-muted">
              <tr>
                <th className="px-6 py-4 font-semibold">Rank</th>
                <th className="px-6 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">College & Branch</th>
                <th className="px-6 py-4 font-semibold text-center">Readiness</th>
                <th className="px-6 py-4 font-semibold text-center">Placement Chance</th>
                <th className="px-6 py-4 font-semibold">Strengths & Signals</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-primary">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted">
                    No candidates found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const probPercent = Math.round(student.placementProbability * 100);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-soft/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs ${
                              student.rank === 1
                                ? "bg-warning/20 text-warning border border-warning/40"
                                : student.rank === 2
                                ? "bg-soft text-primary border border-border"
                                : student.rank === 3
                                ? "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/40"
                                : "bg-base text-muted border border-border"
                            }`}
                          >
                            {student.rank ?? "-"}
                          </span>
                          {student.rank === 1 && <Trophy className="h-4 w-4 text-warning" />}
                        </div>
                      </td>

                      {/* Candidate */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-primary">{student.name}</p>
                          <p className="text-xs text-muted">{student.email}</p>
                          {student.targetCompany && (
                            <span className="mt-1 inline-block text-[11px] text-accent font-medium">
                              Target: {student.targetCompany}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* College & Branch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-primary font-medium text-xs">{student.college}</p>
                          <p className="text-xs text-muted">
                            {student.branch || "CSE"} • Batch {student.batch || "2025"}
                          </p>
                        </div>
                      </td>

                      {/* Readiness Score */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-base font-bold text-primary">
                            {student.readinessScore}
                            <span className="text-xs text-muted font-normal">/100</span>
                          </span>
                          <div className="mt-1 h-1.5 w-16 rounded-full bg-border overflow-hidden">
                            <div
                              style={{ width: `${student.readinessScore}%` }}
                              className={`h-full rounded-full ${
                                student.readinessScore >= 71
                                  ? "bg-success"
                                  : student.readinessScore >= 41
                                  ? "bg-warning"
                                  : "bg-error"
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Placement Probability */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                            probPercent >= 71
                              ? "bg-success/15 border-success/30 text-success"
                              : probPercent >= 41
                              ? "bg-warning/15 border-warning/30 text-warning"
                              : "bg-error/15 border-error/30 text-error"
                          }`}
                        >
                          {probPercent}% Chance
                        </span>
                      </td>

                      {/* Strengths / Weaknesses */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.strengths?.slice(0, 2).map((st) => (
                            <span
                              key={st}
                              className="rounded-md bg-success/15 border border-success/30 px-2.5 py-0.5 text-[11px] text-success whitespace-nowrap font-medium"
                            >
                              {st}
                            </span>
                          ))}
                          {student.weaknesses?.slice(0, 1).map((wk) => (
                            <span
                              key={wk}
                              className="rounded-md bg-warning/15 border border-warning/30 px-2.5 py-0.5 text-[11px] text-warning whitespace-nowrap font-medium"
                            >
                              {wk}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="rounded-xl border border-border bg-base px-3 py-1.5 text-xs font-medium text-primary hover:bg-soft transition flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="h-3.5 w-3.5 text-accent" />
                          <span>View Breakdown</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Student Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
