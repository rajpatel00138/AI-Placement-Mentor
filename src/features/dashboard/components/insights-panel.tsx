import type { InsightItem } from "@/features/dashboard/types";

export function InsightsPanel({ items }: { items: InsightItem[] }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-slate-400">AI insights</p>
        <h3 className="text-lg font-semibold text-white">Smart recommendedTopics</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300">{item.score}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
