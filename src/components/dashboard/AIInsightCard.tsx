import { motion } from "framer-motion";

export type AIInsightCardProps = {
  title: string;
  message: string;
  companies: string[];
  recommendation: string[];
};

export function AIInsightCard({ title, message, companies, recommendation }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.24),rgba(2,6,23,0.92))] p-6 shadow-[0_24px_100px_rgba(2,6,23,0.35)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">AI Mentor</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-indigo-100">Today</div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-200">{message}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm font-medium text-white">Today's Recommendation</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {recommendation.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm font-medium text-white">Expected Companies</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {companies.map((company) => (
              <span key={company} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
