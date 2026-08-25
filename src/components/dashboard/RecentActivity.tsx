import Link from "next/link";
import { Sparkles } from "lucide-react";

export type RecentActivityProps = {
  items: Array<{ id: string; title: string; time: string; type: string; detail?: string | null }>;
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-muted">Recent Activity</p>
        <h3 className="text-lg font-semibold text-primary">Timeline</h3>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-elevated/50 p-6 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-primary">No activities yet</p>
          <p className="mt-1 text-xs text-muted">
            Your live learning actions (DSA solves, resume analyses, mock interviews) will appear here in real time.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/dashboard/dsa-tracker"
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-soft transition"
            >
              Solve DSA Problem
            </Link>
            <Link
              href="/dashboard/resume"
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-soft transition"
            >
              Upload Resume
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 rounded-2xl border border-border bg-elevated p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary">{item.title}</p>
                  <span className="text-[11px] text-muted">{item.time}</span>
                </div>
                {item.detail && <p className="mt-0.5 text-xs text-muted">{item.detail}</p>}
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-accent">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
