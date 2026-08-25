export type TaskChecklistProps = {
  items: Array<{ id: string; title: string; done: boolean; due: string }>;
};

export function TaskChecklist({ items }: TaskChecklistProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-muted">Today's Tasks</p>
        <h3 className="text-lg font-semibold text-primary">Checklist</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-elevated px-4 py-3 cursor-pointer hover:bg-soft transition">
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked={item.done} className="h-4 w-4 rounded border-border accent-accent" />
              <div>
                <p className={`text-sm font-medium ${item.done ? "text-muted line-through" : "text-primary"}`}>{item.title}</p>
                <p className="text-xs text-muted">Due {item.due}</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.done ? "bg-success/15 border border-success/30 text-success" : "bg-warning/15 border border-warning/30 text-warning"}`}>
              {item.done ? "Done" : "Pending"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
