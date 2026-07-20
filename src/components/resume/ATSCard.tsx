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
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-cyan-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: .25 }}
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400">
            ATS Score
          </p>

          <h1 className="mt-4 text-6xl font-bold text-white">
            {score}
            <span className="text-3xl text-slate-500">%</span>
          </h1>

          <p className={`mt-4 font-semibold ${getColor()}`}>
            {getStatus()}
          </p>

        </div>

        <div className="rounded-2xl bg-indigo-500/10 p-4">

          <Award className="h-10 w-10 text-indigo-400"/>

        </div>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </motion.div>
  );
}