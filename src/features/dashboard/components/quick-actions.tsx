export function QuickActions({ actions }: { actions: { label: string; hint: string }[] }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Quick actions</p>
        <h3 className="text-lg font-semibold text-white">Jump to focus</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button key={action.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10">
            <p className="text-sm font-medium text-white">{action.label}</p>
            <p className="mt-1 text-xs text-slate-400">{action.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
