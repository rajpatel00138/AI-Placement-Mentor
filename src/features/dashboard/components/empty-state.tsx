export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-400">
      <p className="text-lg font-medium text-white">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}
