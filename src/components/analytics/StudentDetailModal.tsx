"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Building, GraduationCap, Briefcase } from "lucide-react";
import { StudentAnalyticsRecord } from "@/lib/analytics/types";

interface StudentDetailModalProps {
  student: StudentAnalyticsRecord | null;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  if (!student) return null;

  const scoreBars = [
    { label: "DSA & Problem Solving", score: student.dsaScore, weight: "30%", color: "bg-accent" },
    { label: "Coding Implementation", score: student.codingScore, weight: "25%", color: "bg-accent-secondary" },
    { label: "Mock Interview & Comm", score: student.interviewScore, weight: "20%", color: "bg-accent" },
    { label: "Resume ATS Match", score: student.resumeScore, weight: "15%", color: "bg-success" },
    { label: "Aptitude & Logic", score: student.aptitudeScore, weight: "10%", color: "bg-warning" },
  ];

  const probPercent = Math.round(student.placementProbability * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-border bg-surface p-6 shadow-2xl backdrop-blur-2xl text-primary"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-soft text-primary font-bold text-lg">
                {student.rank ? `#${student.rank}` : "ST"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">{student.name}</h3>
                <p className="text-xs text-muted">{student.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Key Metrics Header */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-elevated p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Readiness Score</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary">{student.readinessScore}</span>
                <span className="text-xs text-muted">/ 100</span>
              </div>
              <p className="mt-1 text-xs text-muted">Weighted cross-domain performance</p>
            </div>

            <div className="rounded-2xl border border-border bg-elevated p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-success">Placement Probability</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-success">{probPercent}%</span>
                <span className="rounded-full bg-success/15 border border-success/30 px-2 py-0.5 text-[10px] font-medium text-success">
                  {probPercent >= 71 ? "High Likelihood" : probPercent >= 41 ? "Moderate" : "Needs Ramp-up"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Predictive logistic scaling model</p>
            </div>
          </div>

          {/* Context Details */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated p-2.5">
              <Building className="h-4 w-4 text-accent" />
              <div>
                <p className="text-muted">College</p>
                <p className="font-semibold text-primary truncate">{student.college || "AIT"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated p-2.5">
              <GraduationCap className="h-4 w-4 text-accent" />
              <div>
                <p className="text-muted">Branch & Batch</p>
                <p className="font-semibold text-primary">{student.branch || "CSE"} • {student.batch || "2025"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated p-2.5 col-span-2 sm:col-span-1">
              <Briefcase className="h-4 w-4 text-accent" />
              <div>
                <p className="text-muted">Target Role</p>
                <p className="font-semibold text-primary truncate">{student.targetRole || "Software Engineer"}</p>
              </div>
            </div>
          </div>

          {/* Detailed Score Breakdown */}
          <div className="mt-6 rounded-2xl border border-border bg-elevated p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary">Score Breakdown by Pillar</h4>
              <span className="text-xs text-muted">Weightage shown</span>
            </div>

            <div className="space-y-3">
              {scoreBars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-primary font-medium">{bar.label} <span className="text-muted font-normal">({bar.weight})</span></span>
                    <span className="font-bold text-primary">{bar.score} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.score}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-success text-xs font-semibold uppercase mb-2">
                <CheckCircle2 className="h-4 w-4" /> Key Strengths
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.strengths && student.strengths.length > 0 ? (
                  student.strengths.map((st) => (
                    <span key={st} className="rounded-lg bg-surface border border-success/30 px-2.5 py-1 text-xs text-success font-medium">
                      {st}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">Profile in progress</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
              <div className="flex items-center gap-2 text-warning text-xs font-semibold uppercase mb-2">
                <AlertCircle className="h-4 w-4" /> Recommended Focus
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.weaknesses && student.weaknesses.length > 0 ? (
                  student.weaknesses.map((wk) => (
                    <span key={wk} className="rounded-lg bg-surface border border-warning/30 px-2.5 py-1 text-xs text-warning font-medium">
                      {wk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">All targets met</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
