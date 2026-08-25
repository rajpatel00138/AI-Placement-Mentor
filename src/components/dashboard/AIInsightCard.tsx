"use client";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

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
      className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_24px_100px_rgba(11,15,25,0.4)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">AI Mentor</p>
          <h3 className="mt-2 text-xl font-semibold text-primary">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
            <button className="rounded-full border border-border bg-elevated/60 p-2 hover:bg-elevated transition-colors">
                <RefreshCw className="h-4 w-4 text-accent" />
            </button>
            <div className="rounded-2xl border border-border bg-elevated/60 px-3 py-2 text-sm text-primary">Today</div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted">{message}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-elevated/40 p-4">
          <p className="text-sm font-medium text-primary">Today's Recommendation</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {recommendation.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-base/60 p-4">
          <p className="text-sm font-medium text-primary">Expected Companies</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {companies.map((company) => (
              <span key={company} className="rounded-full border border-border bg-elevated/80 px-3 py-1 text-sm text-primary">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
