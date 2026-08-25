import * as Progress from "@radix-ui/react-progress";

export type WeakTopicsProps = {
  items: Array<{ label: string; value: number; detail: string }>;
};

export function WeakTopics({ items }: WeakTopicsProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_20px_90px_rgba(11,15,25,0.3)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm text-muted">Weak Topics</p>
        <h3 className="text-lg font-semibold text-primary">Focus areas</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm text-primary">
              <span>{item.label}</span>
              <span className="font-semibold text-muted">{item.value}%</span>
            </div>
            <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-elevated" value={item.value}>
              <Progress.Indicator
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all"
                style={{ transform: `translateX(-${100 - item.value}%)` }}
              />
            </Progress.Root>
            <p className="mt-2 text-xs text-muted">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
