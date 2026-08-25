"use client";

import { motion } from "framer-motion";

export type MomentumGaugeProps = {
  value: number; // 0 to 100
  label: string;
};

export function MomentumGauge({ value, label }: MomentumGaugeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-3xl border border-border shadow-sm">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            className="stroke-border"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            className="stroke-accent"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: value / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-2xl font-bold text-primary">
          {value}%
        </span>
      </div>
      <p className="mt-4 text-sm text-muted font-medium">{label}</p>
    </div>
  );
}
