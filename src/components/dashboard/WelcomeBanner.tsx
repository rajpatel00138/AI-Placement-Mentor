import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export type WelcomeBannerProps = {
  greeting: string;
  userName: string;
  message: string;
  badge: string;
};

export function WelcomeBanner({ greeting, userName, message, badge }: WelcomeBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">
            <Sparkles className="h-4 w-4" />
            {greeting}, {userName}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {message}
          </h2>
          <p className="text-slate-300">
            A calm, modern overview of your placement prep, performance, and daily momentum.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
          <Zap className="h-4 w-4 text-amber-300" />
          {badge}
        </div>
      </div>
    </motion.section>
  );
}
