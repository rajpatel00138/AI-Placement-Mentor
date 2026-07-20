import { motion } from "framer-motion";
import type { MetricCardData } from "@/features/dashboard/types";

export function MetricCard({ title, value, change, accent, icon }: MetricCardData) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-2 ${accent}`}>{icon}</div>
      </div>
      <p className="mt-4 text-sm text-emerald-300">{change}</p>
    </motion.div>
  );
}
