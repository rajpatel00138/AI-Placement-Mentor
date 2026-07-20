"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface StrengthCardProps {
  strengths: string[];
}

export default function StrengthCard({
  strengths,
}: StrengthCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-emerald-500/10 p-3">
          <Trophy className="h-6 w-6 text-emerald-400" />
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            Strengths
          </h2>

          <p className="text-sm text-slate-400">
            Areas where your resume performs well
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {strengths.length > 0 ? (
          strengths.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
            >
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </div>

              <p className="text-slate-200">
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-slate-500">
            No strengths identified.
          </p>
        )}

      </div>
    </motion.div>
  );
}