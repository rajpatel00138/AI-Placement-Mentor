"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface SuggestionsCardProps {
  suggestions: string[];
}

export default function SuggestionsCard({
  suggestions,
}: SuggestionsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-indigo-500/10 p-3">
          <Sparkles className="h-6 w-6 text-indigo-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            AI Suggestions
          </h2>

          <p className="text-sm text-slate-400">
            Personalized recommendations to improve your resume
          </p>
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-4"
            >
              <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-400 flex-shrink-0" />

              <p className="text-slate-200 leading-7">
                {item}
              </p>

            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            🎉 Excellent! Your resume already looks well optimized.
          </div>
        )}

      </div>
    </motion.div>
  );
}