import type { ReactNode } from "react";

export type DashboardGridProps = {
  children: ReactNode;
};

export function DashboardGrid({ children }: DashboardGridProps) {
  return <div className="grid gap-6 xl:grid-cols-2">{children}</div>;
}
