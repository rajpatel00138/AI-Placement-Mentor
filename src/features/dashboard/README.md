# Dashboard Feature

This folder contains reusable dashboard UI components for the AI Placement Mentor experience.

## Components
- MetricCard: Displays a key metric with a visual accent and change summary.
- ProgressBars: Renders topic progress with animated Radix progress bars.
- WeeklyChart: Shows the weekly performance trend using Recharts.
- Checklist: Presents tasks using a reusable, prop-driven checklist UI.
- Timeline: Displays recent activity in a vertical timeline layout.
- InsightsPanel: Shows AI-style recommendedTopics and insights.
- QuickActions: Provides shortcut actions for common dashboard tasks.
- EmptyState: Provides a reusable placeholder for empty data views.
- DashboardSkeleton: Renders a loading state for dashboard content.

Each component accepts props and is isolated from hardcoded behavior so it can be reused in future API-backed screens.
