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
    score >= 85
      ? "Placement Ready"
      : score >= 70
      ? "Almost Ready"
      : score >= 50
      ? "Need More Practice"
      : "Needs Improvement";

  const color =
    score >= 85
      ? "text-emerald-400"
      : score >= 70
      ? "text-cyan-400"
      : score >= 50
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400">
            Placement Readiness
          </p>

          <h1 className="mt-4 text-6xl font-bold text-white">
            {score}
            <span className="text-3xl text-slate-500">%</span>
          </h1>

          <p className={`mt-4 font-semibold ${color}`}>
            {status}
          </p>

        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4">

          <BriefcaseBusiness
            className="h-10 w-10 text-emerald-400"
          />

        </div>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

      <div className="mt-6 flex justify-between text-sm text-slate-400">

        <span>Interview</span>

        <span>Hiring Ready</span>

      </div>

    </motion.div>
  );
}