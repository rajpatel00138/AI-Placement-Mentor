import { motion } from "framer-motion";

export type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  trend: string;
  accent: string;
  icon: React.ReactNode;
};

export function StatCard({ title, value, detail, trend, accent, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_90px_rgba(2,6,23,0.28)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-2 ${accent}`}>{icon}</div>
      </div>
      <p className="mt-4 text-sm text-slate-400">{detail}</p>
      <p className="mt-1 text-sm font-medium text-emerald-300">{trend}</p>
    </motion.div>
  );
}
