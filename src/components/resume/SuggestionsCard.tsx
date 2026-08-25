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
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-border bg-soft p-3 text-accent">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            AI Suggestions
          </h2>

          <p className="text-sm text-muted">
            Personalized recommendations to improve your resume
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-3.5 rounded-2xl border border-border bg-elevated p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-success flex-shrink-0" />

              <p className="text-sm text-primary leading-6">
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-medium text-success">
            🎉 Excellent! Your resume already looks well optimized.
          </div>
        )}
      </div>
    </motion.div>
  );
}