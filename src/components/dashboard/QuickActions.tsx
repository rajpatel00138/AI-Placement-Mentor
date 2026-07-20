export type QuickActionsProps = {
  items: Array<{ label: string; hint: string }>;
};

export function QuickActions({ items }: QuickActionsProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_90px_rgba(2,6,23,0.28)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Quick Actions</p>
        <h3 className="text-lg font-semibold text-white">Fast access</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10">
            <p className="text-sm font-medium text-white">{item.label}</p>
            <p className="mt-1 text-xs text-slate-400">{item.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
