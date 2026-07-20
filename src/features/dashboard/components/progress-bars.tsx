import * as Progress from "@radix-ui/react-progress";
import type { ProgressBarItem } from "@/features/dashboard/types";

export function ProgressBars({ items }: { items: ProgressBarItem[] }) {
  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Weak topics</p>
          <h3 className="text-lg font-semibold text-white">Focus areas</h3>
        </div>
      </div>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800" value={item.value}>
            <Progress.Indicator
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all"
              style={{ transform: `translateX(-${100 - item.value}%)` }}
            />
          </Progress.Root>
          <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
