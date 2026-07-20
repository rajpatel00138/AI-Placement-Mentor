export type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
