export interface FormattedInterviewRecord {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  score: number;
  durationMin: number;
  feedback?: string | null;
  createdAt: string;
  dateFormatted: string;
}

export interface UserInterviewData {
  completedCount: number;
  bestScore: number;
  streakDays: number;
  readinessScore: number;
  lastUpdated: string | null;
  interviews: FormattedInterviewRecord[];
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "No sessions yet";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "No sessions yet";

  const diffMs = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 2) return "Updated just now";
  if (diffMins < 60) return `Updated ${diffMins}m ago`;
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays}d ago`;
  return `Updated on ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
