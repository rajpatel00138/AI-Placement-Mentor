"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  Building2,
  Search,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Check,
  ChevronDown,
  Star,
  Award,
  Layers,
  Flame,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

interface CompanyMeta {
  companyName: string;
  slug: string;
  totalQuestions: number;
  availableTimeframes: string[];
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

interface CompanyQuestionItem {
  id: string;
  companyName: string;
  timeframe: string;
  leetcodeId: number | null;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  acceptanceRate: number | null;
  frequency: number | null;
  problemUrl: string;
  isSolved?: boolean;
  isBookmarked?: boolean;
  status?: "SOLVED" | "BOOKMARKED" | "UNSOLVED";
}

interface CompanyStats {
  totalQuestions: number;
  solvedCount: number;
  bookmarkedCount: number;
  easyCount: number;
  easySolved: number;
  mediumCount: number;
  mediumSolved: number;
  hardCount: number;
  hardSolved: number;
  readinessScore: number;
  readinessLevel: "High" | "Moderate" | "Needs Prep";
}

const TIMEFRAME_LABELS: Record<string, string> = {
  thirty_days: "30 Days",
  three_months: "3 Months",
  six_months: "6 Months",
  more_than_six_months: "6+ Months",
  one_year: "1 Year",
  more_than_two_years: "2+ Years",
  all_time: "All Time",
  alltime: "All Time",
  all: "All",
  "1year": "1 Year",
  "2year": "2 Years",
  "6months": "6 Months",
};

const POPULAR_COMPANIES = [
  "Amazon",
  "Google",
  "Microsoft",
  "Meta",
  "Apple",
  "Bloomberg",
  "Uber",
  "Adobe",
  "Goldman Sachs",
  "Oracle",
  "Walmart Labs",
  "Flipkart",
];

function formatAcceptance(rate: number | null): string {
  if (rate === null || rate === undefined || isNaN(rate)) return "—";
  if (rate <= 0.01) {
    return `${(rate * 10000).toFixed(1)}%`;
  }
  if (rate <= 1.0) {
    return `${(rate * 100).toFixed(1)}%`;
  }
  return `${rate.toFixed(1)}%`;
}

export default function CompanyPrepView() {
  const [companies, setCompanies] = useState<CompanyMeta[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("Amazon");
  const [companySearch, setCompanySearch] = useState<string>("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState<boolean>(false);

  const [timeframe, setTimeframe] = useState<string>("thirty_days");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [problemSearch, setProblemSearch] = useState<string>("");

  const [questions, setQuestions] = useState<CompanyQuestionItem[]>([]);
  const [stats, setStats] = useState<CompanyStats>({
    totalQuestions: 0,
    solvedCount: 0,
    bookmarkedCount: 0,
    easyCount: 0,
    easySolved: 0,
    mediumCount: 0,
    mediumSolved: 0,
    hardCount: 0,
    hardSolved: 0,
    readinessScore: 0,
    readinessLevel: "Needs Prep",
  });
  const [availableTimeframes, setAvailableTimeframes] = useState<string[]>([
    "thirty_days",
    "three_months",
    "six_months",
    "more_than_six_months",
    "all_time",
  ]);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch company directory on mount
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/company-prep/companies");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCompanies(json.data);
          const amazonExists = json.data.some((c: CompanyMeta) => c.companyName.toLowerCase() === "amazon");
          if (!amazonExists) {
            setSelectedCompany(json.data[0].companyName);
          }
        }
      } catch (err) {
        console.error("Error loading companies:", err);
      }
    }
    loadCompanies();
  }, []);

  // Fetch questions when company, timeframe, difficulty, search, status, or page changes
  useEffect(() => {
    let isCancelled = false;

    async function loadQuestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (timeframe) params.set("timeframe", timeframe);
        if (difficulty && difficulty !== "ALL") params.set("difficulty", difficulty);
        if (problemSearch.trim()) params.set("search", problemSearch.trim());
        if (statusFilter && statusFilter !== "ALL") params.set("status", statusFilter);
        params.set("page", String(page));
        params.set("limit", "50");

        const res = await fetch(
          `/api/company-prep/companies/${encodeURIComponent(selectedCompany)}/questions?${params.toString()}`
        );
        const json = await res.json();

        if (!isCancelled && json.success && json.data) {
          setQuestions(json.data.questions || []);
          if (json.data.stats) setStats(json.data.stats);
          if (json.data.availableTimeframes && json.data.availableTimeframes.length > 0) {
            setAvailableTimeframes(json.data.availableTimeframes);
          }
          if (json.data.pagination) {
            setTotalPages(json.data.pagination.totalPages || 1);
            setTotalQuestionsCount(json.data.pagination.total || 0);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching questions:", err);
          toast.error("Failed to load questions");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadQuestions();
    return () => {
      isCancelled = true;
    };
  }, [selectedCompany, timeframe, difficulty, problemSearch, statusFilter, page]);

  // Filter company list for dropdown search
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return companies;
    const term = companySearch.toLowerCase().trim();
    return companies.filter((c) => c.companyName.toLowerCase().includes(term));
  }, [companies, companySearch]);

  // Max frequency for normalizing visual frequency bars
  const maxFrequency = useMemo(() => {
    let max = 1;
    for (const q of questions) {
      if (q.frequency && q.frequency > max) max = q.frequency;
    }
    return max;
  }, [questions]);

  // Toggle Solved Status (Optimistic Update)
  const toggleSolved = async (question: CompanyQuestionItem) => {
    const newSolved = !question.isSolved;
    const newStatus: "SOLVED" | "UNSOLVED" = newSolved ? "SOLVED" : "UNSOLVED";

    // 1. Optimistic state update
    setQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? { ...q, isSolved: newSolved, status: newStatus } : q))
    );

    setStats((prev) => {
      const delta = newSolved ? 1 : -1;
      const newSolvedCount = Math.max(0, prev.solvedCount + delta);
      const newReadiness = prev.totalQuestions > 0 ? Math.round((newSolvedCount / prev.totalQuestions) * 100) : 0;
      let newLevel: "High" | "Moderate" | "Needs Prep" = "Needs Prep";
      if (newReadiness >= 70) newLevel = "High";
      else if (newReadiness >= 40) newLevel = "Moderate";

      let easySolved = prev.easySolved;
      let mediumSolved = prev.mediumSolved;
      let hardSolved = prev.hardSolved;
      if (question.difficulty === "EASY") easySolved = Math.max(0, easySolved + delta);
      else if (question.difficulty === "HARD") hardSolved = Math.max(0, hardSolved + delta);
      else mediumSolved = Math.max(0, mediumSolved + delta);

      return {
        ...prev,
        solvedCount: newSolvedCount,
        readinessScore: newReadiness,
        readinessLevel: newLevel,
        easySolved,
        mediumSolved,
        hardSolved,
      };
    });

    try {
      const res = await fetch(`/api/company-prep/questions/${encodeURIComponent(question.id)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(newSolved ? `Solved: ${question.title}` : `Marked unsolved: ${question.title}`, {
          duration: 1800,
        });
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      toast.error("Failed to update status on server");
      // Revert on error
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? { ...q, isSolved: !newSolved } : q))
      );
    }
  };

  // Toggle Bookmark Status
  const toggleBookmark = async (question: CompanyQuestionItem) => {
    const newBookmarked = !question.isBookmarked;
    const newStatus: "BOOKMARKED" | "UNSOLVED" = newBookmarked ? "BOOKMARKED" : "UNSOLVED";

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, isBookmarked: newBookmarked, status: newStatus } : q
      )
    );

    setStats((prev) => ({
      ...prev,
      bookmarkedCount: Math.max(0, prev.bookmarkedCount + (newBookmarked ? 1 : -1)),
    }));

    try {
      const res = await fetch(`/api/company-prep/questions/${encodeURIComponent(question.id)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(newBookmarked ? `Bookmarked: ${question.title}` : `Bookmark removed`, {
          duration: 1500,
        });
      }
    } catch (err) {
      toast.error("Failed to save bookmark");
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? { ...q, isBookmarked: !newBookmarked } : q))
      );
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "EASY":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            Easy
          </span>
        );
      case "HARD":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
            Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            Medium
          </span>
        );
    }
  };

  // Predefined or available timeframes
  const displayedTimeframes = [
    "thirty_days",
    "three_months",
    "six_months",
    "more_than_six_months",
    "all_time",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HERO HEADER */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-border text-primary text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>Targeted Technical Interview Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Company-Wise Preparation
            </h1>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Master company-specific LeetCode problems curated by frequency and recency from recent technical interviews. Track solved problems, bookmark key questions, and gauge your readiness.
            </p>
          </div>

          {/* Quick Target Overview Badge */}
          <div className="flex items-center gap-4 bg-base p-4 rounded-2xl border border-border shrink-0">
            <div className="w-12 h-12 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-lg shadow-xs">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Active Target</p>
              <p className="text-lg font-bold text-primary">{selectedCompany}</p>
              <p className="text-xs text-accent font-medium">
                {stats.totalQuestions} questions curated
              </p>
            </div>
          </div>
        </div>

        {/* Popular Quick Company Chips */}
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted mr-1">Popular Companies:</span>
          {POPULAR_COMPANIES.map((comp) => {
            const isSelected = selectedCompany.toLowerCase() === comp.toLowerCase();
            return (
              <button
                key={comp}
                onClick={() => {
                  setSelectedCompany(comp);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-accent text-on-accent shadow-xs border border-accent"
                    : "bg-elevated text-muted hover:text-primary hover:bg-soft border border-border"
                }`}
              >
                {comp}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COMPANY SELECTOR & TIMEFRAME CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Company Dropdown / Search Combobox */}
        <div className="lg:col-span-5 relative">
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            Select Target Company ({companies.length} Available)
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 bg-surface border border-border rounded-2xl px-4 py-3 text-sm font-bold text-primary shadow-xs hover:border-accent transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Building2 className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">{selectedCompany}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted shrink-0" />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-elevated border border-border rounded-2xl shadow-xl max-h-80 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-border bg-surface">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-base border border-border text-xs">
                    <Search className="w-3.5 h-3.5 text-muted" />
                    <input
                      type="text"
                      placeholder="Search 470+ companies (e.g. Adobe, Google, Uber)..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className="bg-transparent outline-none w-full text-xs text-primary placeholder-muted"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {filteredCompanies.length === 0 ? (
                    <p className="p-4 text-center text-xs text-muted">No companies match your search</p>
                  ) : (
                    filteredCompanies.map((c) => {
                      const isSelected = selectedCompany.toLowerCase() === c.companyName.toLowerCase();
                      return (
                        <button
                          key={c.companyName}
                          onClick={() => {
                            setSelectedCompany(c.companyName);
                            setIsCompanyDropdownOpen(false);
                            setPage(1);
                            setCompanySearch("");
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? "bg-accent text-on-accent font-bold"
                              : "text-primary hover:bg-soft"
                          }`}
                        >
                          <span className="truncate">{c.companyName}</span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-lg ${
                              isSelected ? "bg-white/20 text-white" : "bg-soft text-muted"
                            }`}
                          >
                            {c.totalQuestions}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="lg:col-span-7">
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            Interview Recency Window
          </label>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl shadow-xs">
            {displayedTimeframes.map((tf) => {
              const isSelected = timeframe === tf;
              const isAvailable = availableTimeframes.includes(tf) || availableTimeframes.length === 0;
              return (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setPage(1);
                  }}
                  className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                    isSelected
                      ? "bg-accent text-on-accent shadow-xs"
                      : isAvailable
                      ? "text-muted hover:text-primary hover:bg-soft"
                      : "text-muted/40 hover:bg-transparent"
                  }`}
                >
                  {TIMEFRAME_LABELS[tf] || tf}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. READINESS STATS BAR */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <h2 className="text-base font-bold text-primary">
                {selectedCompany} Readiness Assessment
              </h2>
            </div>
            <p className="text-xs text-muted">
              {stats.solvedCount} of {stats.totalQuestions} questions completed ({stats.readinessScore}% progress)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border shadow-xs ${
                stats.readinessLevel === "High"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : stats.readinessLevel === "Moderate"
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                  : "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.readinessLevel} Readiness</span>
            </div>

            <div className="bg-base border border-border px-3 py-1.5 rounded-2xl text-xs font-bold text-primary flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{stats.bookmarkedCount} Bookmarked</span>
            </div>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full h-3 bg-base rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-accent transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, stats.readinessScore)}%` }}
          />
        </div>

        {/* Difficulty Breakdown Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Easy */}
          <div className="bg-base border border-border rounded-2xl p-3">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Easy</span>
              <span className="font-semibold text-muted text-[11px]">
                {stats.easySolved} / {stats.easyCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${stats.easyCount > 0 ? (stats.easySolved / stats.easyCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="bg-base border border-border rounded-2xl p-3">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-amber-700 dark:text-amber-400">Medium</span>
              <span className="font-semibold text-muted text-[11px]">
                {stats.mediumSolved} / {stats.mediumCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${stats.mediumCount > 0 ? (stats.mediumSolved / stats.mediumCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="bg-base border border-border rounded-2xl p-3">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-rose-700 dark:text-rose-400">Hard</span>
              <span className="font-semibold text-muted text-[11px]">
                {stats.hardSolved} / {stats.hardCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${stats.hardCount > 0 ? (stats.hardSolved / stats.hardCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FILTERS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Difficulty Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "EASY", "MEDIUM", "HARD"].map((d) => {
            const isSelected = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-accent text-on-accent shadow-xs border border-accent"
                    : "bg-surface text-muted hover:text-primary hover:bg-soft border border-border"
                }`}
              >
                {d === "ALL" ? "All Difficulties" : d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            );
          })}

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Status Filter */}
          {["ALL", "SOLVED", "BOOKMARKED", "UNSOLVED"].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-accent-secondary text-white shadow-xs border border-accent-secondary"
                    : "bg-surface text-muted hover:text-primary hover:bg-soft border border-border"
                }`}
              >
                {st === "ALL" ? "All Status" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Problem Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problem title..."
            value={problemSearch}
            onChange={(e) => {
              setProblemSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface border border-border rounded-2xl pl-9 pr-3 py-2 text-xs font-medium text-primary placeholder-muted outline-none focus:border-accent transition shadow-xs"
          />
          {problemSearch && (
            <button
              onClick={() => setProblemSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 5. QUESTIONS TABLE */}
      <div className="rounded-3xl border border-border bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base/60 text-[11px] font-bold text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Solved</th>
                <th className="py-3.5 px-3 w-16">#</th>
                <th className="py-3.5 px-4">Problem Title</th>
                <th className="py-3.5 px-4 w-28">Difficulty</th>
                <th className="py-3.5 px-4 w-28">Acceptance</th>
                <th className="py-3.5 px-4 w-44">Interview Frequency</th>
                <th className="py-3.5 px-4 w-16 text-center">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="w-4 h-4 bg-muted/20 rounded mx-auto" />
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-8 h-3.5 bg-muted/20 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-48 h-3.5 bg-muted/20 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 h-5 bg-muted/20 rounded-full" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-12 h-3.5 bg-muted/20 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-28 h-2 bg-muted/20 rounded-full" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-4 h-4 bg-muted/20 rounded mx-auto" />
                    </td>
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted space-y-2">
                    <Layers className="w-8 h-8 text-muted/40 mx-auto" />
                    <p className="text-sm font-semibold text-primary">No questions found</p>
                    <p className="text-xs text-muted">
                      Try changing your difficulty filter, recency window, or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                questions.map((q, idx) => {
                  const freqRatio = q.frequency ? Math.min(100, Math.round((q.frequency / maxFrequency) * 100)) : 0;
                  const itemIndex = (page - 1) * 50 + idx + 1;
                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-soft/40 transition group ${
                        q.isSolved ? "bg-soft/20" : ""
                      }`}
                    >
                      {/* Solved Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSolved(q)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer mx-auto ${
                            q.isSolved
                              ? "bg-accent border-accent text-on-accent"
                              : "border-border hover:border-accent bg-base"
                          }`}
                          title={q.isSolved ? "Mark unsolved" : "Mark solved"}
                        >
                          {q.isSolved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Number */}
                      <td className="py-3.5 px-3 font-semibold text-muted text-[11px]">
                        {q.leetcodeId ? `#${q.leetcodeId}` : itemIndex}
                      </td>

                      {/* Title & External Link */}
                      <td className="py-3.5 px-4 font-semibold text-primary">
                        <div className="flex items-center gap-2">
                          <a
                            href={q.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hover:text-accent transition flex items-center gap-1.5 ${
                              q.isSolved ? "line-through text-muted" : ""
                            }`}
                          >
                            <span>{q.title}</span>
                            <ExternalLink className="w-3 h-3 text-muted group-hover:text-accent opacity-0 group-hover:opacity-100 transition shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">{getDifficultyBadge(q.difficulty)}</td>

                      {/* Acceptance Rate */}
                      <td className="py-3.5 px-4 font-medium text-muted">
                        {formatAcceptance(q.acceptanceRate)}
                      </td>

                      {/* Frequency Bar */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-muted font-semibold">
                            <span>Score</span>
                            <span>{q.frequency ? q.frequency.toFixed(1) : "0.0"}</span>
                          </div>
                          <div className="w-full h-1.5 bg-base rounded-full overflow-hidden border border-border">
                            <div
                              className="h-full bg-accent-secondary rounded-full"
                              style={{ width: `${Math.max(5, freqRatio)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Bookmark Button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(q)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            q.isBookmarked
                              ? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                              : "text-muted hover:text-primary hover:bg-soft"
                          }`}
                          title={q.isBookmarked ? "Remove bookmark" : "Bookmark question"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              q.isBookmarked ? "fill-amber-500 text-amber-500" : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. PAGINATION FOOTER */}
        <div className="p-4 border-t border-border bg-base/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-muted font-medium">
            Showing <span className="font-bold text-primary">{questions.length}</span> of{" "}
            <span className="font-bold text-primary">{totalQuestionsCount}</span> problems
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-primary font-bold hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 font-bold text-primary">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-primary font-bold hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
