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
      className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
        </div>
        <div className={`rounded-2xl p-2.5 ${accent}`}>{icon}</div>
      </div>
      <p className="mt-4 text-sm text-muted">{detail}</p>
      <p className="mt-1 text-sm font-medium text-success">{trend}</p>
    </motion.div>
  );
}
