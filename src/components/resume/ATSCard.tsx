"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface ATSCardProps {
  score: number;
}

export default function ATSCard({ score }: ATSCardProps) {
  const getStatus = () => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  const getColor = () => {
    if (score >= 71) return "text-success";
    if (score >= 41) return "text-warning";
    return "text-error";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">
            ATS Score
          </p>

          <h1 className="mt-4 text-5xl sm:text-6xl font-bold text-primary">
            {score}
            <span className="text-2xl sm:text-3xl text-muted font-normal">%</span>
          </h1>

          <p className={`mt-4 font-semibold text-sm ${getColor()}`}>
            {getStatus()}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-soft p-4 text-accent">
          <Award className="h-9 w-9 text-accent" />
        </div>
      </div>

      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            score >= 71 ? "bg-success" : score >= 41 ? "bg-warning" : "bg-error"
          }`}
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </motion.div>
  );
}