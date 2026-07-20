export type TaskChecklistProps = {
  items: Array<{ id: string; title: string; done: boolean; due: string }>;
};

export function TaskChecklist({ items }: TaskChecklistProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_90px_rgba(2,6,23,0.28)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Today's Tasks</p>
        <h3 className="text-lg font-semibold text-white">Checklist</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked={item.done} className="h-4 w-4 rounded border-slate-600 bg-transparent" />
              <div>
                <p className="text-sm text-white">{item.title}</p>
                <p className="text-xs text-slate-500">Due {item.due}</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs ${item.done ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
              {item.done ? "Done" : "Pending"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
