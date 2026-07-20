export type MetricCardData = {
  title: string;
  value: string;
  change: string;
  accent: string;
  icon: React.ReactNode;
};

export type ProgressBarItem = {
  label: string;
  value: number;
  detail: string;
};

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  due: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  type: string;
};

export type InsightItem = {
  title: string;
  description: string;
  score: string;
};

export type WeeklyPoint = {
  day: string;
  score: number;
};
