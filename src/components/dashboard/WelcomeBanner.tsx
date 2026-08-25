import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export type WelcomeBannerProps = {
  greeting: string;
  userName: string;
  message: string;
  badge: string;
  level: number; // 1-100
};

export function WelcomeBanner({ greeting, userName, message, badge, level }: WelcomeBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[32px] border border-border bg-surface p-6 sm:p-8 shadow-sm backdrop-blur-xl relative overflow-hidden"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1 text-sm text-primary font-medium">
            <Sparkles className="h-4 w-4 text-accent" />
            {greeting}, {userName}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            {message}
          </h2>
          <p className="text-muted">
            A calm, modern overview of your placement prep, performance, and daily momentum.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-border" strokeWidth="4" fill="transparent" />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-accent"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: level / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-xs font-bold text-primary">L{Math.floor(level/10) + 1}</span>
          </div>
          <div className="rounded-2xl border border-border bg-soft px-4 py-3 text-sm text-primary">
            <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                {badge}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
