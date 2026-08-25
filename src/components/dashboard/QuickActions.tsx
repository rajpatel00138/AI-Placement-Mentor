export type QuickActionsProps = {
  items: Array<{ label: string; hint: string }>;
};

export function QuickActions({ items }: QuickActionsProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-muted">Quick Actions</p>
        <h3 className="text-lg font-semibold text-primary">Fast access</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button key={item.label} className="rounded-2xl border border-border bg-elevated p-4 text-left transition hover:bg-soft">
            <p className="text-sm font-medium text-primary">{item.label}</p>
            <p className="mt-1 text-xs text-muted">{item.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
