export type RecentActivityProps = {
  items: Array<{ id: string; title: string; time: string; type: string }>;
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_90px_rgba(2,6,23,0.28)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Recent Activity</p>
        <h3 className="text-lg font-semibold text-white">Timeline</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item.type}</p>
              <p className="mt-2 text-xs text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
