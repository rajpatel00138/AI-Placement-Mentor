export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/70" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-80 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/70" />
        <div className="h-80 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/70" />
      </div>
    </div>
  );
}
