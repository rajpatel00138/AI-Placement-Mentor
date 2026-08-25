"use client";

import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

interface WeaknessCardProps {
  weaknesses: string[];
}

export default function WeaknessCard({
  weaknesses,
}: WeaknessCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-warning">
          <CircleAlert className="h-6 w-6 text-warning" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            Weaknesses
          </h2>

          <p className="text-sm text-muted">
            Areas that need improvement
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {weaknesses.length > 0 ? (
          weaknesses.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-3.5 rounded-2xl border border-warning/30 bg-warning/10 p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning font-bold text-xs text-white">
                !
              </div>

              <p className="text-sm font-medium text-primary">
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-medium text-success">
            🎉 No major weaknesses detected.
          </div>
        )}
      </div>
    </motion.div>
  );
}