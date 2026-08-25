"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness } from "lucide-react";

interface PlacementCardProps {
  score: number;
}

export default function PlacementCard({
  score,
}: PlacementCardProps) {

  const status =
    score >= 71
      ? "Placement Ready"
      : score >= 41
      ? "Almost Ready"
      : "Needs Improvement";

  const color =
    score >= 71
      ? "text-success"
      : score >= 41
      ? "text-warning"
      : "text-error";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">
            Placement Readiness
          </p>

          <h1 className="mt-4 text-5xl sm:text-6xl font-bold text-primary">
            {score}
            <span className="text-2xl sm:text-3xl text-muted font-normal">%</span>
          </h1>

          <p className={`mt-4 font-semibold text-sm ${color}`}>
            {status}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-soft p-4 text-accent">
          <BriefcaseBusiness className="h-9 w-9 text-accent" />
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

      <div className="mt-4 flex justify-between text-xs text-muted">
        <span>Interview Prep</span>
        <span>Hiring Ready</span>
      </div>
    </motion.div>
  );
}