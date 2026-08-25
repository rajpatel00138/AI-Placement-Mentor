"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Building,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  FileText,
  GraduationCap,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StudentDeepDiveProfile } from "@/lib/recruiter/types";

export default function StudentDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profile, setProfile] = useState<StudentDeepDiveProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudent() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/recruiter/students/${id}`);
        if (!res.ok) {
          if (res.status === 403) {
            router.push("/dashboard");
            return;
          }
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load candidate deep dive.");
        }
        const json = await res.json();
        setProfile(json.data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    loadStudent();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-accent border-t-transparent" />
        <p className="text-sm font-semibold text-muted">Compiling candidate diagnostics...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center space-y-4 shadow-sm max-w-lg mx-auto mt-12">
        <div className="h-12 w-12 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto">
          <Award size={24} />
        </div>
        <h2 className="text-xl font-bold text-primary">Candidate Not Found</h2>
        <p className="text-sm text-muted">{error || "We couldn't retrieve this candidate's profile."}</p>
        <Link
          href="/recruiter/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-base hover:bg-soft px-5 py-2.5 text-xs font-semibold text-primary transition shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Return to Candidates</span>
        </Link>
      </div>
    );
  }

  const { student, resume, dsa, interview, roadmap } = profile;

  const getScoreColorClass = (score: number) => {
    if (score >= 75) return "text-success bg-success/15 border-success/30";
    if (score >= 50) return "text-warning bg-warning/15 border-warning/30";
    return "text-error bg-error/15 border-error/30";
  };

  const performanceHistory = (student as any).performanceHistory30d || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/recruiter/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface hover:bg-soft px-4 py-2 text-xs font-semibold text-primary transition shadow-xs"
        >
          <ArrowLeft size={14} className="text-accent" />
          <span>Back to Candidate Roster</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Candidate ID:</span>
          <code className="text-xs font-mono bg-elevated px-2 py-0.5 rounded border border-border text-primary">
            {student.id}
          </code>
        </div>
      </div>

      {/* Candidate Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-accent/15 text-accent shadow-sm">
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black">
                  {student.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-primary">{student.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-elevated border border-border text-muted">
                  <Clock size={11} className="text-accent" />
                  <span>{student.activityStatus || "Active recently"}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted">{student.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Building size={13} className="text-accent" />
                  <span>{student.college || "Apex Institute of Technology"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={13} className="text-accent" />
                  <span>{student.branch || "Computer Science"} (Batch of {student.graduationYear || 2025})</span>
                </span>
                {student.targetRole && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <Target size={13} className="text-accent" />
                      <span>Target: {student.targetRole}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Primary Score Badges */}
          <div className="flex items-center justify-center lg:justify-end gap-4 border-t lg:border-t-0 border-border pt-4 lg:pt-0">
            {/* Readiness Score */}
            <div className="rounded-2xl border border-border bg-elevated/70 p-4 text-center min-w-[120px] shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Readiness Score</p>
              <div className="text-2xl sm:text-3xl font-black text-primary mt-1">
                {student.readinessScore}%
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getScoreColorClass(student.readinessScore)}`}>
                {student.readinessScore >= 70 ? "Placement Ready" : student.readinessScore >= 40 ? "Moderate" : "Building"}
              </span>
            </div>

            {/* Placement Probability */}
            <div className="rounded-2xl border border-border bg-elevated/70 p-4 text-center min-w-[120px] shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Placement Prob</p>
              <div className="text-2xl sm:text-3xl font-black text-accent mt-1">
                {student.placementProbability}%
              </div>
              <p className="text-[10px] text-muted mt-1">AI Predicted Chance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Performance & Readiness Growth Graph */}
      {performanceHistory.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                  30-Day Placement Readiness Growth
                </h3>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Trailing 30-day performance trajectory and score momentum.
              </p>
            </div>
            <span className="text-xs font-bold text-accent bg-soft px-3 py-1 rounded-full border border-border">
              Current: {student.readinessScore}%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3368A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3368A0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#D9D2C1" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#D9D2C1" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border bg-surface p-2.5 shadow-md text-xs">
                          <p className="font-bold text-primary">{payload[0].payload.date}</p>
                          <p className="text-accent font-semibold mt-0.5">
                            Readiness: {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="readinessScore"
                  stroke="#3368A0"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#readinessGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Strengths */}
        <div className="rounded-3xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-success" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Core Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(student.strengths && student.strengths.length > 0
              ? student.strengths
              : ["Strong DSA Problem Solving", "Practical Coding Fluency", "Effective Communication"]
            ).map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-xl border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success"
              >
                <CheckCircle2 size={12} />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Growth & Weak Areas */}
        <div className="rounded-3xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-warning" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Identified Growth Areas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(student.weaknesses && student.weaknesses.length > 0
              ? student.weaknesses
              : ["System Design Depth", "Advanced SQL Optimization"]
            ).map((w, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-xl border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning"
              >
                <span>{w}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4-MODULE DIAGNOSTIC SECTION CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Resume Module Diagnostics */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Resume ATS Diagnostics</h3>
                <p className="text-xs text-muted">Latest verified ATS scan metrics</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xl font-black ${resume.atsScore >= 75 ? "text-success" : resume.atsScore > 0 ? "text-warning" : "text-muted"}`}>
                {resume.atsScore > 0 ? `${resume.atsScore}/100` : "0/100"}
              </span>
              <p className="text-[10px] text-muted font-semibold">ATS Score</p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">{resume.summary}</p>

          <div className="space-y-3 pt-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Verified Technical Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {resume.skillsIdentified.map((skill, i) => (
                  <span key={i} className="rounded-lg bg-soft border border-border px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. DSA Tracker Diagnostics */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <Code2 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">DSA Problem Solving</h3>
                <p className="text-xs text-muted">Live verified algorithm practice</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-primary">{dsa.totalSolved}</span>
              <p className="text-[10px] text-muted font-semibold">Solved Problems</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-elevated p-3 text-center">
              <p className="text-[10px] font-bold text-success uppercase">Easy</p>
              <p className="text-lg font-black text-primary mt-0.5">{dsa.easySolved}</p>
            </div>
            <div className="rounded-2xl border border-border bg-elevated p-3 text-center">
              <p className="text-[10px] font-bold text-warning uppercase">Medium</p>
              <p className="text-lg font-black text-primary mt-0.5">{dsa.mediumSolved}</p>
            </div>
            <div className="rounded-2xl border border-border bg-elevated p-3 text-center">
              <p className="text-[10px] font-bold text-error uppercase">Hard</p>
              <p className="text-lg font-black text-primary mt-0.5">{dsa.hardSolved}</p>
            </div>
          </div>
        </div>

        {/* 3. Interview Performance */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <Mic size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Mock Interview Analytics</h3>
                <p className="text-xs text-muted">AI technical evaluation performance</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-accent">{interview.averageScore > 0 ? `${interview.averageScore}%` : "0%"}</span>
              <p className="text-[10px] text-muted font-semibold">Average Score</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted">Completed Sessions:</span>
              <span className="font-bold text-primary">{interview.mockInterviewsCompleted}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Best Score:</span>
              <span className="font-bold text-success">{interview.bestScore > 0 ? `${interview.bestScore}%` : "0%"}</span>
            </div>
          </div>
        </div>

        {/* 4. Roadmap Completion */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <Compass size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Roadmap Progress</h3>
                <p className="text-xs text-muted">Curriculum milestone completion</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-primary">{roadmap.completionPercentage}%</span>
              <p className="text-[10px] text-muted font-semibold">Completed</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {roadmap.milestones.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-border bg-elevated">
                <span className="font-semibold text-primary">{m.title}</span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                  m.status === "completed" ? "bg-success/15 text-success" : "bg-soft text-primary"
                }`}>
                  {m.status === "completed" ? "Done" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
