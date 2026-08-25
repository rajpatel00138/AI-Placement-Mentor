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
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-success">
          <Trophy className="h-6 w-6 text-success" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            Strengths
          </h2>

          <p className="text-sm text-muted">
            Areas where your resume performs well
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {strengths.length > 0 ? (
          strengths.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-3.5 rounded-2xl border border-success/30 bg-success/10 p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-on-accent">
                ✓
              </div>

              <p className="text-sm font-medium text-primary">
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-muted">
            No strengths identified.
          </p>
        )}
      </div>
    </motion.div>
  );
}